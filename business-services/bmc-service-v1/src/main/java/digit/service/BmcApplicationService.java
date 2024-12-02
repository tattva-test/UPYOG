package digit.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.egov.common.contract.models.Workflow;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;

import com.google.gson.Gson;

import digit.bmc.model.Schemes;
import digit.bmc.model.UserOtherDetails;
import digit.bmc.model.UserSchemeApplication;
import digit.enrichment.SchemeApplicationEnrichment;
import digit.kafka.Producer;
import digit.repository.SchemeApplicationRepository;

import digit.repository.UserSchemeCitizenRepository;

import digit.validators.SchemeApplicationValidator;
import digit.web.models.ApplicationSnapshot;
import digit.web.models.ApplicationSnapshotWraper;
import digit.web.models.SchemeApplication;
import digit.web.models.SchemeApplicationRequest;
import digit.web.models.SchemeApplicationSearchCriteria;
import digit.web.models.SchemeApplicationStatus;
import digit.web.models.SchemeValidationResponse;
import digit.web.models.UserSchemeApplicationRequest;
import digit.web.models.employee.ApplicationCountRequest;
import digit.web.models.user.Board;
import digit.web.models.user.DocumentDetails;
import digit.web.models.user.Qualification;
import digit.web.models.user.QualificationDetails;
import digit.web.models.user.QualificationSave;
import digit.web.models.user.UpdatedDocument;
import digit.web.models.user.UserDetails;
import digit.web.models.user.UserSubSchemeMapping;
import digit.web.models.user.YearOfPassing;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class BmcApplicationService {

    private static final Logger log = LoggerFactory.getLogger(BmcApplicationService.class);
    private final UserSchemeCitizenRepository userschemecitizenRepository;

    private final UserSchemeApplicationService userSchemeApplicationService;
    private final SchemeService schemeService;
    @Autowired
    private SchemeApplicationValidator validator;
    @Autowired
    private SchemeApplicationEnrichment enrichmentUtil;
    @Autowired
    private UserService userService;
    @Autowired
    private WorkflowService workflowService;
    @Autowired
    private SchemeApplicationRepository schemeApplicationRepository;
    @Autowired
    private Producer producer;

    @Autowired
	private ApplicationSnapshot snapshot;

	@Autowired
	private ApplicationSnapshotWraper snapshotWraper;

    @Autowired
    public BmcApplicationService(UserSchemeApplicationService userSchemeApplicationService, SchemeService schemeService,
            UserSchemeCitizenRepository userschemecitizenRepository) {
        this.userSchemeApplicationService = userSchemeApplicationService;
        this.schemeService = schemeService;
        this.userschemecitizenRepository = userschemecitizenRepository;
    }

    public List<SchemeApplication> searchSchemeApplications(RequestInfo requestInfo,
            SchemeApplicationSearchCriteria schemeApplicationSearchCriteria) {
        // Fetch applications from database according to the given search criteria
        List<SchemeApplication> applications = schemeApplicationRepository
                .getApplications(schemeApplicationSearchCriteria);

        // If no applications are found matching the given criteria, return an empty
        // list
        if (CollectionUtils.isEmpty(applications))
            return new ArrayList<>();

        // Enrich user details of applicant objects
        applications.forEach(enrichmentUtil::enrichUserDetailsOnSearch);

        // Otherwise return the found applications
        return applications;
    }

    public List<UserSchemeApplication> rendomizeCitizens(SchemeApplicationRequest schemeApplicationRequest) {
        List<UserSchemeApplication> citizens = userSchemeApplicationService
                .getfirstApprovalCitizen(schemeApplicationRequest);
        log.info("Value returned by getFirstApprovalCitizen: {}", citizens);

        Random random = new Random();
        Collections.shuffle(citizens, random);
        log.info("Shuffled citizens: {}", citizens);

        Long numberOfMachines = schemeApplicationRequest.getSchemeApplications().get(0).getNumberOfMachines();
        log.info("Number of machines: {}", numberOfMachines);
        int numberOfCitizens = Math.min(citizens.size(), numberOfMachines.intValue());
        log.info("Number of citizens to select: {}", numberOfCitizens);

        List<UserSchemeApplication> selectedCitizens = new ArrayList<>();
        List<Long> selectedCitizenIds = new ArrayList<>();
        for (int i = 0; i < numberOfCitizens; i++) {
            UserSchemeApplication citizen = citizens.get(i);
            citizen.setRandomSelection(true);
            selectedCitizens.add(citizen);
            selectedCitizenIds.add(citizen.getId());
        }
        log.info("Selected citizens: {}", selectedCitizens);

        userschemecitizenRepository.updateRandomSelection(selectedCitizenIds);

        return selectedCitizens;
    }

    public UserSchemeApplication saveApplicationDetails(UserSchemeApplicationRequest schemeApplicationRequest)
            throws Exception {

        Long userId = schemeApplicationRequest.getRequestInfo().getUserInfo().getId();
        String tenantId = schemeApplicationRequest.getRequestInfo().getUserInfo().getTenantId();
        Long time = System.currentTimeMillis();
        String applicationTenantId = schemeApplicationRequest.getSchemeApplication().getTenantId();

        SchemeApplicationRequest request = new SchemeApplicationRequest();
        request.setRequestInfo(schemeApplicationRequest.getRequestInfo());
        request.setSchemeId(schemeApplicationRequest.getSchemeApplication().getSchemes().getId());
        SchemeValidationResponse response = validator.criteriaCheck(request);

       if (!ObjectUtils.isEmpty(response.getError()) || response.getError() != null) {

        if(response.getError().length() != 0){
           throw new CustomException("Not eligible for this Scheme",
                   response.getError().toString());
        }       
       }
        List<SchemeApplication> schemeApplicationList = new ArrayList<>();
        schemeApplicationList.add(schemeApplicationRequest.getSchemeApplication());
        schemeApplicationRequest.setSchemeApplicationList(schemeApplicationList);
        Schemes scheme = schemeApplicationList.get(0).getSchemes();
        if (ObjectUtils.isEmpty(scheme.getId())) {
            throw new Exception("Scheme id must not be null or empty");
        }

        Workflow workflow = new Workflow();
        workflow.setAction("APPLY");
        schemeApplicationRequest.getSchemeApplicationList().get(0).setWorkflow(workflow);
        schemeApplicationRequest.getRequestInfo().getUserInfo().setTenantId(applicationTenantId);
        enrichmentUtil.enrichSchemeApplication(schemeApplicationRequest);
        schemeApplicationRequest.getSchemeApplicationList().get(0).setTenantId(applicationTenantId);
        workflowService.updateWorkflowStatus(schemeApplicationRequest);
        schemeApplicationRequest.getRequestInfo().getUserInfo().setTenantId(tenantId);
       
        UserSchemeApplication userSchemeApplication = new UserSchemeApplication();
        for (SchemeApplication application : schemeApplicationRequest.getSchemeApplicationList()) {

            userSchemeApplication.setApplicationNumber(application.getApplicationNumber());
            userSchemeApplication.setUserId(userId);
            userSchemeApplication.setTenantId(tenantId);
            userSchemeApplication.setOptedId(application.getSchemes().getId());
            userSchemeApplication.setCreatedBy("system");
            userSchemeApplication.setModifiedBy("system");
            userSchemeApplication.setModifiedOn(time);
            userSchemeApplication.setApplicationStatus(true);
            userSchemeApplication.setFinalApproval(false);
            userSchemeApplication.setFirstApprovalStatus(false);
            userSchemeApplication.setRandomSelection(false);
            userSchemeApplication.setSubmitted(false);
            userSchemeApplication.setVerificationStatus(false);
            userSchemeApplication.setAgreeToPay(application.getUpdateSchemeData().isAgreeToPay());
            userSchemeApplication.setStatement(application.getUpdateSchemeData().isStatement());
            schemeApplicationRequest.setUserSchemeApplication(userSchemeApplication);

        }
        producer.push("save-user-scheme-application", schemeApplicationRequest);
        
        UserSubSchemeMapping userSubSchemeMapping = new UserSubSchemeMapping();
        userSubSchemeMapping.setApplicationNumber(userSchemeApplication.getApplicationNumber());
        userSubSchemeMapping.setCreatedBy("System");
        userSubSchemeMapping.setCreatedOn(time);
        userSubSchemeMapping.setUserId(userId);
        userSubSchemeMapping.setTenantId("mh.mumbai");
        if (!ObjectUtils.isEmpty(schemeApplicationRequest.getSchemeApplication().getSchemeType().getId())) {
            String type = schemeApplicationRequest.getSchemeApplication().getSchemeType().getType().toLowerCase();
            Long schemeTypeId = schemeApplicationRequest.getSchemeApplication().getSchemeType().getId();
            switch (type) {
                case "machine":
                    userSubSchemeMapping.setMachineId(schemeTypeId);
                    break;
                case "course":
                    userSubSchemeMapping.setCourseId(schemeTypeId);
                    break;
            }
        }
        schemeApplicationRequest.setUserSubSchemeMapping(userSubSchemeMapping);
        producer.push("upsert-usersubschememapping", schemeApplicationRequest);
        
        UserDetails userDetails = response.getUserDetails().get(0);
        saveApplicationSnapshot(userDetails,userSchemeApplication,userSubSchemeMapping);

        return userSchemeApplication;
    }


    public Map<String, Long> countSchemeApplications(ApplicationCountRequest request){
        Map<String, Long> countMap = new HashMap<String,Long>();
        String tenantId = request.getRequestInfo().getUserInfo().getTenantId();
        String uuid = request.getRequestInfo().getUserInfo().getUuid();
        boolean forVerify = request.getForVerify() == null || request.getForVerify() == false ? false : request.getForVerify();

        if (request.getAction() == null ) {
        List<String> actionList = schemeApplicationRepository.getDistinctActionsByTenant(tenantId);
        countMap = schemeApplicationRepository.getApplicationCountss(forVerify, uuid, actionList);
    } else {
        List<String> actions = Collections.singletonList(request.getAction().toUpperCase());
        countMap = schemeApplicationRepository.getApplicationCountss(forVerify, uuid, actions);
    }
        return countMap;
    }

    public List<SchemeApplicationStatus> getAllSchemeApplicationsOfUser(RequestInfo request) {

        return schemeApplicationRepository.getSchemeApplicationByUserIdAndTenantId(request.getUserInfo().getId(),
                request.getUserInfo().getTenantId());

    }

    public void saveApplicationSnapshot(UserDetails userDetails,UserSchemeApplication schemeApplication,UserSubSchemeMapping mapping){

        List<QualificationSave> qlist = new ArrayList<>();
        for(QualificationDetails details : userDetails.getQualificationDetails()){
            QualificationSave save = new QualificationSave();
            save.setQualificationDetails(new Qualification(details.getQualificationId(),details.getQualification()));
            save.setBoardValue(new Board(details.getBoard(),details.getBoard()));
            save.setYearOfPassingValue(new YearOfPassing(null,details.getYearOfPassing()));
            save.setPercentage(details.getPercentage());
            qlist.add(save);
        }
        List<UpdatedDocument> dlist = new ArrayList<>();
        for(DocumentDetails details : userDetails.getDocumentDetails()){
            UpdatedDocument doc = new UpdatedDocument();
            doc.setDocumentDetails(details);
            doc.setDocumentNumber(details.getDocumentNo());
            dlist.add(doc);
        }
        UserOtherDetails uod = userDetails.getUserOtherDetails();
        uod.setDivyang(userDetails.getDivyang().getDivyangtype());
        uod.setDivyangPercent(userDetails.getDivyang().getDivyangpercent());
        uod.setDivyangCardId(userDetails.getDivyang().getDivyangcardid());
        Gson gson = new Gson();
        String userDocumentsJson = gson.toJson(dlist);
        String userBanksJson = gson.toJson(userDetails.getBankDetail());
        String userQualificationsJson = gson.toJson(qlist);  
        snapshot.setAadharUser(userDetails.getAadharUser());
        snapshot.getAadharUser().setAadharName(userDetails.getTitle()+". "+snapshot.getAadharUser().getAadharName());
        snapshot.setUserOtherDetails(uod);
        snapshot.setUserAddressDetails(userDetails.getAddress());
        snapshot.setBankDetailsList(userBanksJson);
        snapshot.setUpdatedDocuments(userDocumentsJson);
        snapshot.setQualificationDetailsList(userQualificationsJson);
        snapshot.setUserSchemeApplication(schemeApplication);
        snapshot.setUserSubSchemeMapping(mapping);
        snapshotWraper.setSnapshot(snapshot);
        producer.push("upsert-application-snapshot", snapshotWraper);

    }


}
