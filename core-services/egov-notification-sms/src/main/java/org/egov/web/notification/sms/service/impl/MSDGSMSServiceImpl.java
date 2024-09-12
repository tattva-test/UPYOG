package org.egov.web.notification.sms.service.impl;

import lombok.extern.slf4j.Slf4j;
import org.egov.web.notification.sms.config.SMSProperties;
import org.egov.web.notification.sms.models.Sms;
import org.egov.web.notification.sms.service.BaseSMSService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.util.StringUtils;

import javax.annotation.PostConstruct;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.TrustManagerFactory;
import javax.net.ssl.X509TrustManager;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLEncoder;
import java.security.KeyManagementException;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.MessageDigest;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;

@Service
@Slf4j
@ConditionalOnProperty(value = "sms.provider.class", matchIfMissing = true, havingValue = "MSDG")
public class MSDGSMSServiceImpl extends BaseSMSService {

    @Autowired
    private SMSProperties smsProperties;

    private SSLContext sslContext;

    @PostConstruct
    private void postConstruct() {
        log.info("postConstruct() start");

        try {
            sslContext = SSLContext.getInstance("TLSv1.2");
            if (smsProperties.isVerifyCertificate()) {
                log.info("Checking certificate");

                try (InputStream is = getClass().getClassLoader().getResourceAsStream("smsgwsmsgovin.cer")) {
                    if (is == null) {
                        throw new IOException("Certificate file not found");
                    }

                    CertificateFactory certFactory = CertificateFactory.getInstance("X.509");
                    X509Certificate caCert = (X509Certificate) certFactory.generateCertificate(is);

                    KeyStore trustStore = KeyStore.getInstance(KeyStore.getDefaultType());
                    trustStore.load(null);
                    trustStore.setCertificateEntry("caCert", caCert);

                    TrustManagerFactory trustFactory = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
                    trustFactory.init(trustStore);

                    TrustManager[] trustManagers = trustFactory.getTrustManagers();
                    sslContext.init(null, trustManagers, null);
                } catch (KeyManagementException | CertificateException | KeyStoreException | IOException e) {
                    log.error("Unable to load SMS certificate: {}", e.getMessage());
                }
            } else {
                log.info("Not checking certificate");
                TrustManager tm = new X509TrustManager() {
                    @Override
                    public void checkClientTrusted(X509Certificate[] chain, String authType) throws CertificateException {
                    }

                    @Override
                    public void checkServerTrusted(X509Certificate[] chain, String authType) throws CertificateException {
                    }

                    @Override
                    public X509Certificate[] getAcceptedIssuers() {
                        return null;
                    }
                };
                sslContext.init(null, new TrustManager[]{tm}, null);
            }
            SSLContext.setDefault(sslContext);

        } catch (Exception e) {
            log.error("SSL context initialization failed: {}", e.getMessage());
        }
    }

    private static String MD5(String text) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            md.update(text.getBytes("iso-8859-1"), 0, text.length());
            byte[] md5 = md.digest();
            return convertedToHex(md5);
        } catch (Exception e) {
            log.error("Exception while encrypting: ", e);
            return null;
        }
    }

    private static String convertedToHex(byte[] data) {
        StringBuilder buf = new StringBuilder();

        for (byte b : data) {
            int halfOfByte = (b >>> 4) & 0x0F;
            int twoHalfBytes = 0;

            do {
                if (0 <= halfOfByte && halfOfByte <= 9)
                    buf.append((char) ('0' + halfOfByte));
                else
                    buf.append((char) ('a' + (halfOfByte - 10)));

                halfOfByte = b & 0x0F;

            } while (twoHalfBytes++ < 1);
        }
        return buf.toString();
    }

    @Override
    protected void submitToExternalSmsService(Sms sms) {
        try {
            String finalMessage = encodeMessage(sms.getMessage());
            String url = smsProperties.getUrl();
            String encodedMessage = URLEncoder.encode(finalMessage, "UTF-8");
            String finalUrl = url + "?" + encodedMessage;

            HttpsURLConnection conn = (HttpsURLConnection) new URL(finalUrl).openConnection();
            conn.setSSLSocketFactory(sslContext.getSocketFactory());
            conn.setDoOutput(true);
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.connect();

            try (BufferedReader rd = new BufferedReader(new InputStreamReader(conn.getInputStream()))) {
                StringBuilder responseBuffer = new StringBuilder();
                String line;
                while ((line = rd.readLine()) != null) {
                    responseBuffer.append(line);
                }
                log.info("SMS sent, response: {}", responseBuffer.toString());
            } finally {
                conn.disconnect();
            }

        } catch (Exception e) {
            log.error("Error occurred while sending SMS to: " + sms.getMobileNumber(), e);
        }
    }

    private String encodeMessage(String message) {
        StringBuilder encodedMessage = new StringBuilder();
        for (int i = 0; i < message.length(); i++) {
            char ch = message.charAt(i);
            int j = (int) ch;
            encodedMessage.append("&#").append(j).append(";");
        }
        return encodedMessage.toString();
    }
}
