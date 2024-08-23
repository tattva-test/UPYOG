import React from "react";

import { useRouteMatch, Switch, useLocation } from "react-router-dom";
import { AppContainer, BackButton, PrivateRoute } from "@upyog/digit-ui-react-components";

import { useTranslation } from "react-i18next";

const App = () => {
  const { t } = useTranslation();
  const { path, url, ...match } = useRouteMatch();
  const location = useLocation();

  const  CreateApplication = Digit?.ComponentRegistryService?.getComponent("BMCCreate");
  const BMCHome = Digit?.ComponentRegistryService?.getComponent("BMCHome");

  return (
    <React.Fragment>
      <div className="bmc-citizen-wrapper">
        {!location.pathname.includes("/response") && <BackButton>{t("CS_COMMON_BACK")}</BackButton>}
        <Switch>
          {/* <AppContainer> */}
          <PrivateRoute path={`${path}/home/application/create`} component={CreateApplication} />
          <PrivateRoute path={`${path}/home`} component={BMCHome} />

          {/* </AppContainer> */}
        </Switch>
      </div>
    </React.Fragment>
  );
};

export default App;
