import React, { useState } from "react";
import Timeline from "../components/bmcTimeline";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import dropdownOptions from "./dropdownOptions.json";
import { useHistory } from "react-router-dom";
import { CardLabel, Dropdown, LabelFieldPair, Modal, Card } from "@upyog/digit-ui-react-components";

const styles = {
  Parent: {
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
    margin: "2rem",
  },

  child1: {
    width: "60%",
    // height: "100vh",
  },

  child2: {
    width: "40%",
    // height: "100vh",
  },
};

const EgibilityCheckPage = () => {
  const { t } = useTranslation();
  const [focusIndex, setFocusIndex] = useState({ index: -1, type: "" });
  const { control, formState: localFormState, watch, setError: setLocalError, clearErrors: clearLocalErrors, setValue, trigger } = useForm();
  const formValue = watch();
  const { errors } = localFormState;
  const history = useHistory();
  const buttonTexts = ["Sewing Machine", "Flour Mill", "Masala Mill"];
  const [visibleButton, setVisibleButton] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();

  const openModal = (text, index) => {
    setFocusIndex({ index, type: buttonTexts[index] });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const errorStyle = { width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" };

  return (
    <React.Fragment>
      {window.location.href.includes("/citizen") ? <Timeline currentStep={3} /> : null}
      <Card style={{ maxWidth: "100vw", marginLeft: "2rem", marginTop: "2rem" }}>
        <div style={styles.Parent}>
          <div style={styles.child1}>
            <LabelFieldPair>
              <CardLabel className="bmc-label" style={{ marginBottom: "1.5rem" }}>
                {t("BMC_Ration_Card_Type")}
              </CardLabel>
              <div className="bmc-citizen-wrapper">
                <Controller
                  control={control}
                  name={"rationcardtype"}
                  rules={{
                    required: t("CORE_COMMON_REQUIRED_ERRMSG"),
                  }}
                  render={(props) => (
                    <Dropdown
                      className="bmc-dropdown"
                      selected={props.value}
                      select={(value) => {
                        props.onChange(value);
                        setVisibleButton(true);
                      }}
                      onBlur={props.onBlur}
                      option={dropdownOptions.rationcardtype}
                      optionKey="value"
                      t={t}
                    />
                  )}
                />
              </div>
            </LabelFieldPair>
          </div>
          <div style={styles.child2}>
            {visibleButton && (
              <React.Fragment>
                <CardLabel className="bmc-label" style={{ marginBottom: "1rem", marginLeft: "8px" }}>
                  {t("BMC_Select_Scheme")}
                </CardLabel>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    // justifyItems: "flex-end",
                    // alignItems: "center",
                    // marginBottom: "0rem",
                    // marginLeft: "-13rem",
                    // marginTop: "2rem",
                  }}
                >
                  {buttonTexts.map((text, index) => (
                    <button
                      key={index}
                      onClick={openModal}
                      style={{
                        backgroundColor: "#0B4B66",
                        color: "white",
                        padding: "10px",
                        margin: "0 10px",
                      }}
                    >
                      {text}
                    </button>
                  ))}
                </div>
              </React.Fragment>
            )}
          </div>
          <div>
            {isModalOpen && (
              <Modal onClose={closeModal} fullScreen>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "80%",
                    margin: "auto",
                    backgroundColor: "white",
                    padding: "2rem",
                    borderRadius: "10px",
                  }}
                >
                  <p style={{ fontSize: "24px", marginBottom: "20px" }}>
                    You have selected {buttonTexts[focusIndex.index]},5% of the total cost of the machine to be paid by the applicant/beneficiary.
                    <br />
                    Are you Agree?
                  </p>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => history.push("/digit-ui/citizen/bmc/create-abc/ownerdetails")}
                      style={{ backgroundColor: "#F47738", color: "white", padding: "10px 20px", fontSize: "16px" }}
                    >
                      Agree
                    </button>
                    <button onClick={closeModal} style={{ backgroundColor: "#B1B4B6", color: "#505A5F", padding: "10px 20px", fontSize: "16px" }}>
                      Disagree
                    </button>
                  </div>
                </div>
              </Modal>
            )}
          </div>
        </div>
      </Card>
    </React.Fragment>
  );
};

export default EgibilityCheckPage;
