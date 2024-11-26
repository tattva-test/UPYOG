import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import AddressDetailCard from "../components/AddressDetails";
import BankDetails from "../components/BankDetails";
import Timeline from "../components/bmcTimeline";
import DisabilityCard from "../components/DisabilityCard";
import PersonalDetailCard from "../components/PersonalDetails";
import QualificationCard from "../components/QualificationCard";
import Title from "../components/title";
import { Toast } from "@upyog/digit-ui-react-components";
import DocumentCard from "../components/DocumentCard";
import UserOthersDetails from "../components/userOthersDetails";

const AadhaarFullFormPage = () => {
  const tenantId = Digit.SessionStorage.get("CITIZEN.COMMON.HOME.CITY")?.code || Digit.ULBService.getCurrentTenantId();
  const userDetails = Digit.UserService.getUser();
  const { t } = useTranslation();
  const history = useHistory();
  const [userDetail, setUserDetail] = useState({});

  const [updatedPersonalDetails, setupdatedPersonalDetails] = useState({});
  const [updatedQualifications, setupdatedQualifications] = useState([]);
  const [updatedDisability, setupdatedDisability] = useState({});
  const [updatedAddress, setupdatedAddress] = useState({});
  const [updatedBank, setupdatedBank] = useState([]);
  const [toast, setToast] = useState(null);
  const [updatedDocument, setupdatedDocument] = useState([]);
  const [updateOthersDetails, setupdatedOthersDetails] = useState({});

  const userFunction = (data) => {
    if (data && data.UserDetails && data.UserDetails.length > 0) {
      setUserDetail(data.UserDetails[0]);
    }
  };

  const getUserDetails = { UserSearchCriteria: { Option: "full", TenantID: tenantId, UserID: userDetails?.info?.id } };
  Digit.Hooks.bmc.useUsersDetails(getUserDetails, { select: userFunction });

  const showToast = (type, message, duration = 5000) => {
    setToast({ key: type, action: message });
    setTimeout(() => {
      setToast(null);
    }, duration);
  };

  const handleQualificationsUpdate = (updatedQualifications) => {
    setupdatedQualifications(updatedQualifications);
  };

  const handlePersonalDetailUpdate = useCallback((updatedPersonalDetails) => {
    setupdatedPersonalDetails(updatedPersonalDetails);
  }, []);

  const handleDisabilityUpdate = useCallback((updatedDisability) => {
    setupdatedDisability(updatedDisability);
  }, []);

  const handleBankUpdate = useCallback((updatedBank) => {
    setupdatedBank(updatedBank);
  }, []);

  const handleAddressUpdate = useCallback((updatedAddress) => {
    setupdatedAddress(updatedAddress);
  }, []);

  const handleDocumentUpdate = useCallback((updatedDocument) => {
    setupdatedDocument(updatedDocument);
  }, []);

  const handleOtherDetailsUpdate = useCallback((updateOthersDetails) => {
    setupdatedOthersDetails(updateOthersDetails);
  }, []);

  const saveUserDetail = Digit.Hooks.bmc.useSaveUserDetail();

  const goNext = useCallback(() => {
    const data = {
      updatedAddress,
      updatedDisability,
      updatedQualifications,
      updatedPersonalDetails,
      updatedBank,
      updatedDocument,
      updateOthersDetails,
    };

    saveUserDetail.mutate(data, {
      onSuccess: () => {
        showToast("success", t("BMC_USER_SAVED_SUCCESSFULY"));

        setTimeout(() => {
          history.push("/digit-ui/citizen/bmc/selectScheme");
        }, 1000);
      },
      onError: (error) => {
        console.error("Failed to save user details:", error);
        showToast("error", t("BMC_USER_SAVED_ERROR"));
      },
    });
  }, [
    updatedAddress,
    updatedDisability,
    updatedQualifications,
    updatedPersonalDetails,
    updatedBank,
    saveUserDetail,
    updatedDocument,
    updateOthersDetails,
    history,
    t,
  ]);
  return (
    <React.Fragment>
      <div className="bmc-card-full">
        {window.location.href.includes("/citizen") ? <Timeline currentStep={2} /> : null}
        <Title text={t("Applicant Details")} />
        <PersonalDetailCard onUpdate={handlePersonalDetailUpdate} initialRows={userDetail} tenantId={tenantId} AllowEdit={true} />
        <AddressDetailCard onUpdate={handleAddressUpdate} initialRows={userDetail} tenantId={tenantId} AllowEdit={true} />
        <DisabilityCard onUpdate={handleDisabilityUpdate} initialRows={userDetail.divyang} tenantId={tenantId} AllowEdit={true} />
        <DocumentCard onUpdate={handleDocumentUpdate} initialRows={userDetail.documentDetails} tenantId={tenantId} AllowEdit={true}></DocumentCard>
        <UserOthersDetails onUpdate={handleOtherDetailsUpdate} initialRows={userDetail.UserOtherDetails} tenantId={tenantId} AllowEdit={true} />
        <QualificationCard
          onUpdate={handleQualificationsUpdate}
          initialRows={userDetail.UserQualification || []}
          tenantId={tenantId}
          AddOption={true}
          AllowRemove={true}
        />
        <BankDetails initialRows={userDetail.UserBank||[]} tenantId={tenantId} AddOption={true} AllowRemove={true} onUpdate={handleBankUpdate} />
        <div className="bmc-card-row" style={{ textAlign: "end", paddingBottom: "1rem" }}>
          <button className="bmc-card-button" onClick={goNext} style={{ borderBottom: "3px solid black", marginRight: "1rem" }}>
            {t("BMC_Confirm")}
          </button>
          <button
            className="bmc-card-button-cancel"
            onClick={() => history.push("/bmc/dashboard()")}
            style={{ borderBottom: "3px solid black", outline: "none"}}
          >
            {t("BMC_Cancel")}
          </button>
        </div>
      </div>
      {toast && (
        <Toast
          error={toast.key === "error"}
          label={t(toast.key === t("success") ? t("BMC_USER_SAVED_SUCCESSFULLY") : toast.action)}
          onClose={() => setToast(null)}
          style={{ maxWidth: "670px" }}
        />
      )}
    </React.Fragment>
  );
};

export default AadhaarFullFormPage;
