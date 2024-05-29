package org.egov.egf.ptscheduler;

import java.io.IOException;

import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestBody;

import okhttp3.FormBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

@Component
public class AuthtokenApi {
	
	public static String getToken() throws IOException {
        OkHttpClient client = new OkHttpClient();

        
        FormBody requestBody = new FormBody.Builder()
                .add("username", "CounterEmployee-doiwala")
                .add("password", "eGov@1234")
                .add("grant_type", "password")
                .add("scope", "read")
                .add("tenantId", "uk.doiwala")
                .add("userType", "EMPLOYEE")
                .build();

       
       Request request = new Request.Builder()
                .url("https://nagarsewa.uk.gov.in/user/oauth/token")
                .post(requestBody)
                .addHeader("Content-Type", "application/x-www-form-urlencoded")
                .addHeader("authorization", "Basic ZWdvdi11c2VyLWNsaWVudDo=")
                .build();

        
        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);

            
            String responseBody = response.body().string();
            return responseBody; 
        }
    }
}
	


