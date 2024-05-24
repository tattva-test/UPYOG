import React, { useEffect } from "react";

import getRootReducer from "./redux/reducers";
import CitizenApp from "./pages/citizen";
import Create from "./pages/citizen/create";
import OwnerDetailFull from "./pagecomponents/ownerDetails";
import AadhaarVerification from "./pagecomponents/aadhaarVerification";
import AadhaarFullForm from "./pagecomponents/aadhaarfullformpge";
import SelectSchemePage from "./pagecomponents/selectScheme";
import EgibilityCheckPage from './pagecomponents/egibilityCheck'
import SelectSchemeDisbilityPage from './pagecomponents/selectSchemedisbility';
import BMCReviewPage from './pagecomponents/bmcReview';


export const BMCReducers = getRootReducer;

const BMCModule = ({ stateCode, userType, tenants }) => {
  const moduleCode = "BMC";
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({ stateCode, moduleCode, language });

 

  Digit.SessionStorage.set("BMC_TENANTS", tenants);

  return <CitizenApp />;
};

const BMCLinks = ({ matchPath }) => {
  const { t } = useTranslation();
  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage(BMC_CITIZEN_CREATE_COMPLAINT, {});

  useEffect(() => {
    clearParams();
  }, []);

  const links = [
    {
      link: `${matchPath}/create`,
      i18nKey: t("CS_CREATE"),
    }
  ];

  return <CitizenHomeCard header={t("CS_COMMON_HOME_COMPLAINTS")} links={links}  />;
};

const componentsToRegister = {
  BMCCreate: Create,
  BMCModule,
  BMCLinks,
  OwnerDetailFull,
  AadhaarVerification,
  AadhaarFullForm,
  SelectSchemePage,
  EgibilityCheckPage,
  SelectSchemeDisbilityPage,
  BMCReviewPage
};

export const initBMCComponents = () => {
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
