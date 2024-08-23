import React, { useEffect } from "react";

import getRootReducer from "./redux/reducers";
import CitizenApp from "./pages/citizen";
import Create from "./pages/citizen/create";
import BMCHome from "./pages/citizen/home";



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
  BMCCreate:Create,
  BMCHome,
  BMCModule,
  BMCLinks,
};

export const initBMCComponents = () => {
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
