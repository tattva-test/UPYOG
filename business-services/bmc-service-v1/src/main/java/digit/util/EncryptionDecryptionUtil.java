package digit.util;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import digit.web.models.EncReqObject;
import digit.web.models.EncryptionRequest;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class EncryptionDecryptionUtil {

    @Value("${egov.enc.host}")
    private String encServiceHost;

    @Value("${egov.enc.encrypt.endpoint}")
    private String encryptionPath;
    @Value("${egov.enc.decrypt.endpoint}")
    private String decryptionPath;

    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    RestTemplate restTemplate;

    @Autowired
    EncryptionRequest encryptionRequest;

    @Autowired
    EncReqObject reqObject;

    public Object encrypt(String value, String type, String tenantId) {

        try {

            // ObjectNode encryptionRequestNode = objectMapper.createObjectNode();
            // ArrayNode encryptionRequestsArray = encryptionRequestNode.putArray("encryptionRequests");

            // ObjectNode encReqObjectNode = objectMapper.createObjectNode();
            // encReqObjectNode.put("tenantId", tenantId);
            // encReqObjectNode.put("type", "SYM");
            // encReqObjectNode.put("value", value);

            reqObject.setTenantId(tenantId);
            reqObject.setValue(value);
            reqObject.setType("SYM");
            List<EncReqObject> reqList = new ArrayList<>();
            reqList.add(reqObject);
            encryptionRequest.setEncryptionRequests(reqList);

            objectMapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);

            StringBuilder uri = new StringBuilder(encServiceHost);
            uri.append(encryptionPath);
            log.info("URI: " + uri.toString());
            log.info("Request: " + objectMapper.writeValueAsString(encryptionRequest));
            Object response = restTemplate.postForObject(uri.toString(), encryptionRequest, Map.class);

            if (response instanceof Map) {
                Map<String, Object> responseMap = (Map<String, Object>) response;
                return responseMap.get("encryptedValue").toString();
            } else {
                throw new RuntimeException("Unexpected response format");
            }

        } catch (Exception e) {

            e.printStackTrace();
            log.error("Failed to encrypt AadharRef", e);
            throw new RuntimeException("Failed to encrypt AadharRef", e);
        }
    }

}
