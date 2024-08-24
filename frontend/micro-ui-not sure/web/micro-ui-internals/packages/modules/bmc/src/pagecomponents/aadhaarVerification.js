import { CardLabel, LabelFieldPair, TextInput,OTPInput } from "@upyog/digit-ui-react-components";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Timeline from "../components/bmcTimeline";

const AadhaarVerification = ({ t, setError: setFormError, clearErrors: clearFormErrors, onBlur }) => {
  const [aadhaar, setAadhaar] = useState(Array(12).fill(""));
  const [error, setError] = useState("");
  const [isAadhaarValid, setIsAadhaarValid] = useState(false);
  const [message, setMessage] = useState("");
  const [buttonText, setButtonText] = useState("Submit");
  const history = useHistory();

  const handleAadhaarChange = (e, index) => {
    const value = e.target.value;
    if (/^\d{0,1}$/.test(value)) {
      const newAadhaar = [...aadhaar];
      if (value === "" && aadhaar[index] !== "") {
        newAadhaar[index] = "";
        setAadhaar(newAadhaar);
        if (index > 0) {
          document.getElementById(`aadhaar-${index - 1}`).focus();
        }
      } else {
        newAadhaar[index] = value;
        setAadhaar(newAadhaar);
        if (newAadhaar.every((digit) => digit !== "")) {
          setError("");
        }
        setIsAadhaarValid(false);
        setMessage("");
        setButtonText("Submit");

        if (e.target.value && value && index < aadhaar.length - 1) {
          document.getElementById(`aadhaar-${index + 1}`).focus();
        }
      }
    } else {
      setError("Aadhaar number should contain only 12 digits");
    }
  };
  const test =(a)=>{
    console.log(a);
  }
  const validateAadhaar = () => {
    if (aadhaar.every((digit) => digit !== "")) {
      setError("");
      setIsAadhaarValid(true);
      setButtonText("Submit");
    } else {
      setError("Aadhaar number should contain only 12 digits");
      setIsAadhaarValid(false);
      setMessage("");
    }
  };

  const handleSubmit = () => {
    validateAadhaar();
    if (isAadhaarValid) {
      history.push({
        pathname: "/digit-ui/citizen/bmc/aadhaarForm",
        state: { aadharRef: aadhaar.join("") },
      });
    }
  };

  return (
    <React.Fragment>
      <div className="bmc-card-full">
        {window.location.href.includes("/citizen") ? <Timeline currentStep={1} /> : null}
        <div className="bmc-row-card-header" style={{ padding: "0" }}>
          <div className="bmc-card-row" style={{ height: "80%" }}>
            <div
              className="bmc-col2-card"
              style={{ height: "55vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "1rem" }}
            >
              <div className="bmc-aadhaarText">
                <div className="bmc-title" style={{ textAlign: "center" }}>
                  Aadhaar Verification
                </div>

                <LabelFieldPair>
                  <CardLabel className="aadhaar-label">{"BMC_AADHAAR_LABEL"}</CardLabel>
                  <div className="aadhaar-container">
                  <OTPInput length={11} onChange={test}/>
                  </div>
                </LabelFieldPair>
                {message && <div style={{ textAlign: "center", color: aadhaar.join("") === aadhaar ? "green" : "red" }}>{message}</div>}
                {error && <div style={{ textAlign: "center", color: "red" }}>{error}</div>}
                <div style={{ textAlign: "center" }}>
                  <button className="bmc-card-button" onClick={handleSubmit} style={{ borderBottom: "3px solid black", textAlign: "center" }}>
                    {buttonText}
                  </button>
                </div>
              </div>
            </div>
            <div className="bmc-col2-card" style={{ padding: "0" }}>
              <div className="bmc-card-aadharimage"></div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AadhaarVerification;
