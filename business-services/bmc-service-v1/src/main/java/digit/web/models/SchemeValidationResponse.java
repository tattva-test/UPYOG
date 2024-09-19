package digit.web.models;

import java.util.Date;
import java.util.List;

import org.egov.common.contract.response.ResponseInfo;

import com.fasterxml.jackson.annotation.JsonProperty;


import digit.web.models.user.UserDetails;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SchemeValidationResponse {

   @JsonProperty("ResponseInfo")
   private ResponseInfo responseInfo;
   
   @JsonProperty
   private String schemeType;


   private String schemeName;

   private Date benifittedDate;
   
   @JsonProperty("Error")
   private StringBuilder error;

   private Boolean ageEligibility;

   private Boolean disability;

   private Boolean incomeEligibility;

   private Boolean genderEligibility;

   private Boolean educationEligibility;

   private Boolean rationCardEligibility;

   private List<UserDetails> userDetails;



}
