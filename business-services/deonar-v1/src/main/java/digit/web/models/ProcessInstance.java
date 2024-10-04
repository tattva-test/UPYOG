package digit.web.models;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.models.Document;
import org.egov.common.contract.request.User;
import org.egov.common.contract.workflow.State;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class ProcessInstance {

	 @Size(max = 64)
	    @JsonProperty("id")
	    private String id;

	    @NotNull
	    @Size(max = 128)
	    @JsonProperty("tenantId")
	    private String tenantId;

	    @NotNull
	    @Size(max = 128)
	    @JsonProperty("businessService")
	    private String businessService;

	    @NotNull
	    @Size(max = 128)
	    @JsonProperty("businessId")
	    private String businessId;

	    @NotNull
	    @Size(max = 128)
	    @JsonProperty("action")
	    private String action;

	    @NotNull
	    @Size(max = 64)
	    @JsonProperty("moduleName")
	    private String moduleName;

	    @JsonProperty("state")
	    private State state;

	    @JsonProperty("comment")
	    private String comment;

	    @JsonProperty("documents")
	    @Valid
	    private List<Document> documents;

	    @JsonProperty("assignes")
	    private List<User> assignes;

	    public ProcessInstance addDocumentsItem(Document documentsItem) {
	        if (this.documents == null) {
	            this.documents = new ArrayList<>();
	        }
	        if (!this.documents.contains(documentsItem))
	            this.documents.add(documentsItem);

	        return this;
	    }

}
