import { CardLabel, LabelFieldPair, TextInput, CardLabelError, Card } from "@upyog/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import Timeline from "../components/bmcTimeline";

const styles = {
  Parent: {
    display: "flex",
    flexDirection: "row",
  },

  child1: {
    width: "50%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  child2: {
    width: "50%",
  },
};

const AadhaarVerification = ({
  t,
  config,
  onSelect,
  value,
  userType,
  formData,
  setError: setFormError,
  clearErrors: clearFormErrors,
  formState,
  onBlur,
}) => {
  let index = window.location.href.split("/").pop();
  let validation = {};
  const onSkip = () => onSelect();
  let aadhaar;
  let setAadhaar;
  let otp;
  let setOtp;

  if (!isNaN(index)) {
    [aadhaar, setAadhaar] = useState(formData?.originalData?.additionalDetails?.aadhaar || "");
    [otp, setOtp] = useState(formData?.originalData?.additionalDetails?.otp || "");
  } else {
    [aadhaar, setAadhaar] = useState(formData?.originalData?.additionalDetails?.aadhaar || "");
    [otp, setOtp] = useState(formData?.originalData?.additionalDetails?.otp || "");
  }
  const [error, setError] = useState(null);
  const { pathname } = useLocation();
  const presentInModifyApplication = pathname.includes("modify");
  const [isAadhaarFilled, setIsAadhaarFilled] = useState(false);
  const history = useHistory();

  useEffect(() => {
    validateAadhaar();
  }, [aadhaar]);

  const onChange = (e) => {
    setAadhaar(e.target.value);
    validateAadhaar();
  };

  const goNext = () => {
    sessionStorage.setItem("aadhaar", aadhaar.i18nKey);
    // onSelect("aadhaar", { aadhaar });
  };

  useEffect(() => {
    if (userType === "employee") {
      console.log("configkeyEEE", config.key);
      if (aadhaar !== "undefined" && aadhaar?.length === 0) setFormError(config.key, { type: "required", message: t("CORE_COMMON_REQUIRED_ERRMSG") });
      else if ((aadhaar !== "undefined" && aadhaar?.length < 12) || aadhaar?.length > 12 || !Number(aadhaar))
        setFormError(config.key, { type: "invalid", message: t("ERR_DEFAULT_INPUT_FIELD_MSG") });
      else clearFormErrors(config.key);

      onSelect(config.key, aadhaar);
    }
  }, [aadhaar]);

  useEffect(() => {
    if (presentInModifyApplication && userType === "employee") {
      setAadhaar(formData?.originalData?.additionalDetails?.aadhaar);
    }
  }, []);

  const inputs = [
    {
      label: "PT_AADHAAR_LABEL",
      type: "text",
      name: "aadhaar",
      isMandatory: true,
      validation: {
        requried: true,
        minLength: 12,
        maxLength: 12,
      },
    },
    {
      label: "PT_OTP_LABEL",
      type: "text",
      name: "otp",
      isMandatory: true,
      validation: {
        requried: true,
        minLength: 6,
        maxLength: 6,
      },
    },
  ];
  const handleOtpChange = (e) => {
    const value = e.target.value;
    if (new RegExp(/^\d{0,6}$/).test(value) || value === "") {
      setOtp(value);
      validateOtp();
    } else {
      setError("OTP should contain only 6 digits");
    }
  };
  const validateOtp = () => {
    if (new RegExp(/^\d{6}$/).test(otp) || otp === "") {
      setError("");
    }
  };
  const validateAadhaar = () => {
    if (new RegExp(/^\d{12}$/).test(aadhaar) || aadhaar === "") {
      setError("");
    }
  };
  const handleAadhaarChange = (e) => {
    const value = e.target.value;
    if (new RegExp(/^\d{0,12}$/).test(value) || value === "") {
      onChange(e);
      validateAadhaar();
      setIsAadhaarFilled(value.length === 12);
    } else {
      setError("Aadhaar number should contain only 12 digits");
    }
  };

  if (userType === "employee") {
    return inputs?.map((input, index) => {
      return (
        <React.Fragment>
          <LabelFieldPair>
            <CardLabel className="aadhaar-label">{t("PT_AADHAAR_LABEL")}</CardLabel>
            <TextInput
              key={input.name}
              id={input.name}
              value={aadhaar}
              onChange={handleAadhaarChange}
              onSelect={goNext}
              placeholder={"Enter Aadhaar number"}
              {...input.validation}
              onBlur={onBlur}
            />
          </LabelFieldPair>
          {formState.touched[config.key] ? (
            <CardLabelError style={{ width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" }}>
              {formState.errors?.[config.key]?.message}
            </CardLabelError>
          ) : null}
        </React.Fragment>
      );
    });
  }

  return (
    <React.Fragment>
      {window.location.href.includes("/citizen") ? <Timeline currentStep={1} /> : null}
      <Card style={{ maxWidth: "100vw" }}>
        <div style={styles.Parent}>
          <div style={styles.child1}>
            <header style={{ fontSize: "20px", marginLeft: "30px", color: "black", fontWeight: "bold" }}>Aadhar Verification</header>
            <div>
              <CardLabel className="aadhaar-label">{`${"PT_AADHAAR_LABEL"}`}</CardLabel>
              <TextInput
                style={{ width: "350px" }}
                t={t}
                type={"number"}
                isMandatory={false}
                optionKey="i18nKey"
                name="aadhaar"
                value={aadhaar || formData?.additionalDetails?.aadhaar}
                onChange={handleAadhaarChange}
                onBlur={onBlur}
                placeholder={"Enter a valid 12-digit aadhaar number"}
                {...(validation = {
                  required: true,
                  minLength: 12,
                  maxLength: 12,
                })}
              />
              {error && <CardLabelError>{error}</CardLabelError>}
              <CardLabel className="aadhaar-label">{"PT_OTP_LABEL"}</CardLabel>
              <TextInput
                style={{ width: "350px" }}
                t={t}
                type={"number"}
                isMandatory={false}
                optionKey="i18nKey"
                name="otp"
                value={otp || formData?.additionalDetails?.otp}
                onChange={handleOtpChange}
                onBlur={onBlur}
                placeholder={"Enter a valid 6-digit otp number"}
                {...(validation = {
                  required: true,
                  minLength: 6,
                  maxLength: 6,
                })}
              />
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                  style={{ backgroundColor: "#F47738", width: "147px", height: "48px", color: "white", marginTop: "1.5rem", alignSelf: "flex-end" }}
                  disabled={!isAadhaarFilled}
                >
                  Verify
                </button>
              </div>
            </div>
          </div>
          <div style={styles.child2}>
            <img src="" alt="aadhaar" style={{ width: "100%", height: "100%" }} />
          </div>
        </div>
      </Card>
    </React.Fragment>
  );
};

export default AadhaarVerification;
