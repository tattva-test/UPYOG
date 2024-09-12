package org.egov.web.notification.sms.service.impl;

import lombok.extern.slf4j.Slf4j;
import org.egov.web.notification.sms.config.SMSProperties;
import org.egov.web.notification.sms.models.Sms;
import org.egov.web.notification.sms.service.BaseSMSService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;

import javax.annotation.PostConstruct;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.TrustManagerFactory;
import javax.net.ssl.X509TrustManager;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.KeyManagementException;
import java.security.KeyStore;
import java.security.MessageDigest;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.util.List;

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
                } catch (KeyManagementException | IllegalStateException | Exception e) {
                    log.error("Not able to load SMS certificate from the specified path {}", e.getMessage());
                }
            } else {
                log.info("not checking certificate");
                TrustManager tm = new X509TrustManager() {
                    @Override
                    public void checkClientTrusted(java.security.cert.X509Certificate[] chain, String authType) {
                    }

                    @Override
                    public void checkServerTrusted(java.security.cert.X509Certificate[] chain, String authType) {
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
        // Example logic to modify requestBody before sending it, if needed
        if (!requestBody.containsKey("extraKey")) {
            requestBody.add("extraKey", "extraValue");
        }
    }

    private String hashGenerator(String userName, String senderId, String content, String secureKey) {
        try {
            String data = userName + senderId + content + secureKey;

            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hashInBytes = md.digest(data.getBytes(StandardCharsets.UTF_8));

            // Convert byte array into signum representation
            StringBuilder sb = new StringBuilder();
            for (byte b : hashInBytes) {
                sb.append(String.format("%02x", b));
            }

            return sb.toString();  // Return the hashed value
        } catch (Exception e) {
            log.error("Error generating hash: ", e);
        }

        return null;  // Return null or a default value in case of an error
    }
}
