import React, { useState } from "react";
import Timeline from "../components/bmcTimeline";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { CardLabelError, LabelFieldPair,Card } from "@upyog/digit-ui-react-components";

const SelectSchemeDisbilityPage = () => {
  const { t } = useTranslation();
  const [focusIndex, setFocusIndex] = useState({ index: -1, type: "" });
  const { control, formState: localFormState, watch, setError, clearErrors, setValue, trigger } = useForm();
  const formValue = watch();
  const { errors } = localFormState;
  const history = useHistory();
  const buttonText = [
    "Women Empowerment",
    "Women Skill Development",
    "Transgender Skill Development",
    "Divyang Empowerment",
    "Divyang Pension Scheme",
    "Divyang Skill Development",
  ];

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();

  const errorStyle = { width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" };

  const handleSchemeNavigation = (scheme) => {
    history.push(`/digit-ui/citizen/bmc/create-abc/egibilityCheck`);
  };

  return (
    <React.Fragment>
      {window.location.href.includes("/citizen") && <Timeline currentStep={2} />}
          <Card style={{ maxWidth:"100vw", marginLeft:"2rem" , marginTop:"2rem"}}>
            <header style={{ fontSize: "30px", fontWeight: "500", margin: "20px", marginLeft: "5rem" }}>
              Select Scheme
            </header>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", marginLeft: "5rem", gap: "0.5rem" }}>
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
                gap: "1rem",
                marginTop: "2rem",
                justifyContent: "center",
              }}
            >
              {buttonText.slice(4).map((text, index) => (
                <LabelFieldPair key={index + 4}>
                  <button
                    style={{ backgroundColor: "#0B4B66", color: "white", padding: "25px", gridColumn: "span 2", width:"-webkit-fill-available" }}
                    onClick={() => handleSchemeNavigation(text)}
                  >
                    {text}
                  </button>
                </LabelFieldPair>
              ))}
            </div>
          </Card>
    </React.Fragment>
  );
};

export default SelectSchemeDisbilityPage;
