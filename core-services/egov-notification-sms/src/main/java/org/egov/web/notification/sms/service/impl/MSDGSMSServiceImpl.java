package org.egov.web.notification.sms.service.impl;

import lombok.extern.slf4j.Slf4j;
import org.egov.web.notification.sms.config.SMSConstants;
import org.egov.web.notification.sms.config.SMSProperties;
import org.egov.web.notification.sms.models.Sms;
import org.egov.web.notification.sms.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.MultiValueMap;

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
import java.net.URI;
import java.net.URLEncoder;
import java.security.KeyManagementException;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.MessageDigest;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.util.*;

@Service
@Slf4j
@ConditionalOnProperty(value = "sms.provider.class", matchIfMissing = true, havingValue = "MSDG")
public class MSDGSMSServiceImpl extends BaseSMSService {

    @Autowired
    private SMSProperties smsProperties;

    @Autowired
    private SMSBodyBuilder bodyBuilder;

    private SSLContext sslContext;

    @PostConstruct
    private void postConstruct() {
        log.info("postConstruct() start");

        try {
            sslContext = SSLContext.getInstance("TLSv1.2");
            if (smsProperties.isVerifyCertificate()) {
                log.info("checking certificate");

                // Loading the certificate
                try (InputStream is = getClass().getClassLoader().getResourceAsStream("smsgwsmsgovin.cer")) {
                    CertificateFactory certFactory = CertificateFactory.getInstance("X.509");
                    X509Certificate caCert = (X509Certificate) certFactory.generateCertificate(is);

                    // Creating a KeyStore and loading the certificate
                    KeyStore trustStore = KeyStore.getInstance(KeyStore.getDefaultType());
                    trustStore.load(null);
                    trustStore.setCertificateEntry("caCert", caCert);

                    // Initializing TrustManagerFactory with the truststore
                    TrustManagerFactory trustFactory = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
                    trustFactory.init(trustStore);

                    TrustManager[] trustManagers = trustFactory.getTrustManagers();
                    sslContext.init(null, trustManagers, null);
                } catch (KeyManagementException | IllegalStateException | CertificateException | KeyStoreException | IOException e) {
                    log.error("Not able to load SMS certificate from the specified path {}", e.getMessage());
                }
            } else {
                log.info("not checking certificate");
                TrustManager tm = new X509TrustManager() {
                    @Override
                    public void checkClientTrusted(java.security.cert.X509Certificate[] chain, String authType)
                            throws java.security.cert.CertificateException {
                    }

                    @Override
                    public void checkServerTrusted(java.security.cert.X509Certificate[] chain, String authType)
                            throws java.security.cert.CertificateException {
                    }

                    @Override
                    public java.security.cert.X509Certificate[] getAcceptedIssuers() {
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
        MessageDigest md;
        byte[] md5 = new byte[64];
        try {
            md = MessageDigest.getInstance("SHA-1");
            md.update(text.getBytes("iso-8859-1"), 0, text.length());
            md5 = md.digest();
        } catch (Exception e) {
            log.error("Exception while encrypting the pwd: ", e);
        }
        return convertedToHex(md5);
    }

    private static String convertedToHex(byte[] data) {
        StringBuffer buf = new StringBuffer();

        for (int i = 0; i < data.length; i++) {
            int halfOfByte = (data[i] >>> 4) & 0x0F;
            int twoHalfBytes = 0;

            do {
                if (0 <= halfOfByte && halfOfByte <= 9)
                    buf.append((char) ('0' + halfOfByte));
                else
                    buf.append((char) ('a' + (halfOfByte - 10)));

                halfOfByte = data[i] & 0x0F;

            } while (twoHalfBytes++ < 1);
        }
        return buf.toString();
    }

    protected void submitToExternalSmsService(Sms sms) {
        String finalmessage = "";
        for (int i = 0; i < sms.getMessage().length(); i++) {
            char ch = sms.getMessage().charAt(i);
            int j = (int) ch;
            String sss = "&#" + j + ";";
            finalmessage = finalmessage + sss;
        }
        sms.setMessage(finalmessage);

        try {
            String url = smsProperties.getUrl();
            final MultiValueMap<String, String> requestBody = bodyBuilder.getSmsRequestBody(sms);
            postProcessor(requestBody);
            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(requestBody, getHttpHeaders());

            HttpsURLConnection conn = (HttpsURLConnection) new URL(url + "?" + URLEncoder.encode(finalmessage, "UTF-8")).openConnection();
            conn.setSSLSocketFactory(sslContext.getSocketFactory());
            conn.setDoOutput(true);
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.connect();

            BufferedReader rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            StringBuffer responseBuffer = new StringBuffer();
            String line;
            while ((line = rd.readLine()) != null) {
                responseBuffer.append(line);
            }
            log.info("SMS sent, response: {}", responseBuffer.toString());
            rd.close();
            conn.disconnect();

        } catch (Exception e) {
            log.error("Error occurred while sending SMS to : " + sms.getMobileNumber(), e);
        }
    }

    private void postProcessor(MultiValueMap<String, String> requestBody) {
        // ... (existing logic)
    }

    private String hashGenerator(String userName, String senderId, String content, String secureKey) {
        // ... (existing logic)
    }
}
