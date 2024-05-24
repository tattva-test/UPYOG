import React, { useState } from "react";
import Timeline from "../components/bmcTimeline";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { CardLabelError, LabelFieldPair, Card } from "@upyog/digit-ui-react-components";

const SelectSchemePage = () => {
  const { t } = useTranslation();
  const [focusIndex, setFocusIndex] = useState({ index: -1, type: "" });
  const { control, formState: localFormState, watch, setError, clearErrors, setValue, trigger } = useForm();
  const formValue = watch();
  const { errors } = localFormState;
  const history = useHistory();
  const buttonText = ["Women Empowerment Scheme", "Women Skill Development", "Transgender Skill Development"];

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();

  const errorStyle = { width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" };

  const handleSchemeNavigation = (scheme) => {
    history.push(`/digit-ui/citizen/bmc/create-abc/egibilityCheck`);
  };

  return (
    <React.Fragment>
      {window.location.href.includes("/citizen") && <Timeline currentStep={2} />}
      <Card style={{ maxWidth: "100vw", marginLeft: "2rem", marginTop: "2rem" }}>
        <header style={{ fontSize: "30px", fontWeight: "500", margin: "20px", marginLeft: "5rem" }}>Select Scheme</header>
        {/* <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${buttonText.length}, 1fr)`,
            marginLeft: "5rem",
          }}
        >
          {buttonText.map((text, index) => (
            <React.Fragment>
              <LabelFieldPair>
                <button style={{ backgroundColor: "#0B4B66", color: "white", padding: "20px" }} onClick={() => handleSchemeNavigation(text)}>
                  {text}
                </button>
              </LabelFieldPair>
            </React.Fragment>
          ))}
        </div> */}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", marginLeft: "5rem", gap: "2rem" }}>
          {buttonText.slice(0, 4).map((text, index) => (
            <LabelFieldPair key={index}>
              <button
                style={{ backgroundColor: "#0B4B66", color: "white", padding: "25px", width: "100%" }}
                onClick={() => handleSchemeNavigation(text)}
              >
                {text}
              </button>
            </LabelFieldPair>
          ))}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            marginLeft: "5rem",
            gap: "1.5rem",
            marginTop: "2rem",
            justifyContent: "center",
          }}
        >
          {buttonText.slice(4).map((text, index) => (
            <LabelFieldPair key={index + 4}>
              <button
                style={{ backgroundColor: "#0B4B66", color: "white", padding: "25px", gridColumn: "span 2", width: "-webkit-fill-available" }}
                onClick={() => handleSchemeNavigation(text)}
              >
                {text}
              </button>
            </LabelFieldPair>
          ))}
        </div>
        <CardLabelError style={errorStyle}>{localFormState.touched.firstName ? errors?.firstName?.message : ""}</CardLabelError>
      </Card>
    </React.Fragment>
  );
};

export default SelectSchemePage;
