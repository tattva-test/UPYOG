import React from "react";

import { useRouteMatch, Switch, useLocation } from "react-router-dom";
import { AppContainer, BackButton, PrivateRoute } from "@upyog/digit-ui-react-components";

import { useTranslation } from "react-i18next";

const App = () => {
  const { t } = useTranslation();
  const { path, url, ...match } = useRouteMatch();
  const location = useLocation();

  const CreateComplaint = Digit?.ComponentRegistryService?.getComponent("BMCCreate");
  const CreareOwnerDetails = Digit?.ComponentRegistryService?.getComponent("OwnerDetailFull");
  const Aadhar = Digit?.ComponentRegistryService?.getComponent("AadhaarVerification");
  const AadhaarFullForm = Digit?.ComponentRegistryService?.getComponent("AadhaarFullForm");
  const SelectSchemePage = Digit?.ComponentRegistryService?.getComponent("SelectSchemePage");
  const EgibilityCheckPage = Digit?.ComponentRegistryService?.getComponent("EgibilityCheckPage");
  const SelectSchemeDisbilityPage = Digit?.ComponentRegistryService?.getComponent("SelectSchemeDisbilityPage");
  const BMCReviewPage = Digit?.ComponentRegistryService?.getComponent("BMCReviewPage");

  return (
    <React.Fragment>
      <div className="bmc-citizen-wrapper">
        {!location.pathname.includes("/response") && <BackButton>{t("CS_COMMON_BACK")}</BackButton>}
        <Switch>
          <AppContainer>
            <PrivateRoute path={`${path}/create-abc/anc`} component={CreateComplaint} />
            <PrivateRoute path={`${path}/create-abc/ownerdetails`} component={CreareOwnerDetails} />
            <PrivateRoute path={`${path}/create-abc/aadhaar`} component={Aadhar} />
            <PrivateRoute path={`${path}/create-abc/aadhaarForm`} component={AadhaarFullForm} />
            <PrivateRoute path={`${path}/create-abc/selectScheme`} component={SelectSchemePage} />
            <PrivateRoute path={`${path}/create-abc/egibilityCheck`} component={EgibilityCheckPage} />
            <PrivateRoute path={`${path}/create-abc/selectSchemeDisbility`} component={SelectSchemeDisbilityPage} />
            <PrivateRoute path={`${path}/create-abc/review`} component={BMCReviewPage} />
          </AppContainer>
        </Switch>
      </div>
    </React.Fragment>
  );
};

export default App;
