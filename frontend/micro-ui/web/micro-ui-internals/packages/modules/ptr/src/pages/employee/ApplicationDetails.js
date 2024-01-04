import { Header, MultiLink } from "@egovernments/digit-ui-react-components";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import ApplicationDetailsTemplate from "../../../../templates/ApplicationDetails";
import getPTAcknowledgementData from "../../getPTAcknowledgementData";


const ApplicationDetails = () => {
  const { t } = useTranslation();
  const { data: storeData } = Digit.Hooks.useStore.getInitData();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { tenants } = storeData || {};
  const { id: applicationNumber } = useParams();
  const [showToast, setShowToast] = useState(null);
  const [appDetailsToShow, setAppDetailsToShow] = useState({});
  const [showOptions, setShowOptions] = useState(false);
  const [enableAudit, setEnableAudit] = useState(false);
  const [businessService, setBusinessService] = useState("ptr");



  sessionStorage.setItem("applicationNoinAppDetails", applicationNumber);







  const { isLoading, isError, data: applicationDetails, error } = Digit.Hooks.ptr.usePtrApplicationDetail(t, tenantId, applicationNumber);
  console.log("appppppdetailtosho",applicationDetails)





  const {
    isLoading: updatingApplication,
    isError: updateApplicationError,
    data: updateResponse,
    error: updateError,
    mutate,
  } = Digit.Hooks.ptr.usePTRApplicationAction(tenantId);





  let workflowDetails = Digit.Hooks.useWorkflowDetails({
    tenantId: applicationDetails?.applicationData?.tenantId || tenantId,
    id: applicationDetails?.applicationData?.applicationData?.applicationNumber,
    moduleCode: businessService,
    role: "PT_CEMP",
  });







  const { isLoading: auditDataLoading, isError: isAuditError, data: auditData } = Digit.Hooks.ptr.usePTRSearch(
    {
      tenantId,
      filters: { applicationNumber: applicationNumber, audit: true },
    },
    // { enabled: enableAudit, select: (data) => data.PetRegistrationApplications?.filter((e) => e.status === "ACTIVE") }
  );



  const closeToast = () => {
    setShowToast(null);
  };

  useEffect(() => {
    if (applicationDetails) {
      setAppDetailsToShow(_.cloneDeep(applicationDetails));
      // if (applicationDetails?.applicationData?.status !== "ACTIVE" && applicationDetails?.applicationData?.creationReason === "MUTATION") {
      // setEnableAudit(true);
      // }
    }
  }, [applicationDetails]);



  useEffect(() => {

    if (workflowDetails?.data?.applicationBusinessService && !(workflowDetails?.data?.applicationBusinessService === "ptr" && businessService === "ptr")) {
      setBusinessService(workflowDetails?.data?.applicationBusinessService);



    }
  }, [workflowDetails.data]);




  const PT_CEMP = Digit.UserService.hasAccess(["PT_CEMP"]) || false;



  if (
    PT_CEMP &&
    workflowDetails?.data?.applicationBusinessService === "ptr" &&
    workflowDetails?.data?.actionState?.nextActions?.find((act) => act.action === "PAY")
  ) {
    workflowDetails.data.actionState.nextActions = workflowDetails?.data?.actionState?.nextActions.map((act) => {
      if (act.action === "PAY") {
        return {
          action: "PAY",
          forcedName: "WF_PAY_APPLICATION",
          redirectionUrl: { pathname: `/digit-ui/employee/payment/collect/pet-services/${appDetailsToShow?.applicationData?.applicationData?.applicationNumber}` },
        };
      }
      return act;
    });
  }



  const handleDownloadPdf = async () => {
    const PetRegistrationApplications = appDetailsToShow?.applicationData;
    const tenantInfo = tenants.find((tenant) => tenant.code === PetRegistrationApplications.tenantId);
    const data = await getPTAcknowledgementData(PetRegistrationApplications.applicationData, tenantInfo, t);
    Digit.Utils.pdf.generate(data);
  };

  const petDetailsPDF = {
    order: 1,
    label: t("PTR_APPLICATION"),
    onClick: () => handleDownloadPdf(),
  };
  let dowloadOptions = [petDetailsPDF];



  return (
    <div>
      <div className={"employee-application-details"} style={{ marginBottom: "15px" }}>
        <Header styles={{ marginLeft: "0px", paddingTop: "10px", fontSize: "32px" }}>{t("PTR_PET_APPLICATION_DETAILS")}</Header>
        {dowloadOptions && dowloadOptions.length > 0 && (
          <MultiLink
            className="multilinkWrapper employee-mulitlink-main-div"
            onHeadClick={() => setShowOptions(!showOptions)}
            displayOptions={showOptions}
            options={dowloadOptions}
            downloadBtnClassName={"employee-download-btn-className"}
            optionsClassName={"employee-options-btn-className"}
          // ref={menuRef}
          />
        )}
      </div>




      <ApplicationDetailsTemplate
        applicationDetails={appDetailsToShow}
        isLoading={isLoading}
        isDataLoading={isLoading}
        applicationData={appDetailsToShow?.applicationData}
        mutate={mutate}
        workflowDetails={workflowDetails}
        businessService={businessService}
        moduleCode="pet-services"
        showToast={showToast}
        setShowToast={setShowToast}
        closeToast={closeToast}
        timelineStatusPrefix={"PTR_COMMON_STATUS_"}
        forcedActionPrefix={"EMPLOYEE_PTR"}
        statusAttribute={"state"}
        MenuStyle={{ color: "#FFFFFF", fontSize: "18px" }}
      />

    </div>
  );
};

export default React.memo(ApplicationDetails);