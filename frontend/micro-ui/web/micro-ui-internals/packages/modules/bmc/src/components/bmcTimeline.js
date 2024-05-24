import React from "react";
import { useTranslation } from "react-i18next";
import { TickMark } from "@upyog/digit-ui-react-components";

let actions = [];

const getAction = (flow) => {
  switch (flow) {
    case "STAKEHOLDER":
      actions = [];
      break;
    default:
      actions = ["BMC_Aadhaar_Verification", "BMC_Select_Scheme", "BMC_Application_fill", "BMC_Review"];
  }
};
const Timeline = ({ currentStep = 1, flow = "" }) => {
  const { t } = useTranslation();
  const isMobile = window.Digit.Utils.browser.isMobile();
  getAction(flow);
  return (
    <div className="timeline-box" style={isMobile ? {} : { width: "80vw", maxWidth: "none", minWidth: "none" }}>
      {actions.map((action, index, arr) => (
        <div className="timeline-checkpoints" key={index}>
          <div className="timeline-contents">
            <span className={`circles ${index <= currentStep - 1 && "active"}`}>
              {index < currentStep - 1 ? <TickMark /> : <span className="circle"></span>}
            </span>
            <span className="secondary-colors">{t(action)}</span>
          </div>
          {index < arr.length - 1 && <span className={`line ${index < currentStep - 1 && "active"}`}></span>}
        </div>
      ))}
    </div>
  );
};

export default Timeline;
