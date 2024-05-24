import React, { useState } from "react";
import Timeline from "../components/bmcTimeline";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { useLocation, useHistory } from "react-router-dom";
import dropdownOptions from "./dropdownOptions.json";
import { Controller, useForm } from "react-hook-form";
import { CardLabel, LabelFieldPair, TextInput, RadioButtons, Card } from "@upyog/digit-ui-react-components";

const styles = {
  Parent: {
    display: "flex",
    flexDirection: "row",
  },

  child1: {
    width: "80%",
  },

  child2: {
    width: "20%",
  },
};

const createOwnerDetail = () => ({
  firstName: "Bal",
  middleName: "Krishana",
  lastName: "Yadav",
  motherName: "Ram Krishana Yadav",
  gender: "Male",
  house: "127/14",
  street: "Secotr 3",
  landMark: "Gomati Nagar Extension Bypass Road",
  locality: "Gomati Nagar",
  city: "Lucknow",
  district: "Lucknow",
  state: "Uttar Pradesh",
  pincode: "226022",
  subDistrict: "Lucknow",
  dob: "20/11/1990",
  disability: "",

  key: Date.now(),
});

const AadhaarFullForm = ({ config, onSelect, userType, formData, setError, formState, clearErrors }) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [owners, setOwners] = useState(formData?.owners || [createOwnerDetail()]);
  const [focusIndex, setFocusIndex] = useState({ index: -1, type: "" });

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const commonProps = {
    focusIndex,
    allOwners: owners,
    setFocusIndex,
    formData,
    formState,
    setOwners,
    t,
    setError,
    clearErrors,
    config,
  };

  return (
    <React.Fragment>
      {owners.map((owner, index) => (
        <OwnerDetailForm key={owner.key} index={index} owner={owner} {...commonProps} />
      ))}
    </React.Fragment>
  );
};

const OwnerDetailForm = (_props) => {
  const { owner, index, onSelect, focusIndex, allOwners, setFocusIndex, formData, formState, setOwners, t, setError, clearErrors, config } = _props;

  const { control, formState: localFormState, watch, setError: setLocalError, clearErrors: clearLocalErrors, setValue, trigger } = useForm();
  const history = useHistory();
  const [radioValue, setRadioValue] = useState("");

  const onSkip = () => {
    onSelect();
  };

  const goNext = () => {
    if (radioValue.value === "No") {
      history.push("/digit-ui/citizen/bmc/create-abc/selectScheme");
    } else if (radioValue.value === "Yes") {
      history.push("/digit-ui/citizen/bmc/create-abc/selectSchemeDisbility");
    }
  };

  return (
    <React.Fragment>
      {window.location.href.includes("/citizen") ? <Timeline currentStep={1} /> : null}
      <Card style={{ maxWidth:"100vw", marginLeft:"2rem" , marginTop:"2rem", width:"84vw"}}>
        <div style={{ marginTop: "2rem", marginLeft: "1rem" }}>
          <div style={styles.Parent}>
            <div style={styles.child1}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridGap: 20 }}>
                <LabelFieldPair>
                  <CardLabel className="bmc-label">{"BMC_FIRST_NAME"}</CardLabel>
                  <Controller
                    control={control}
                    name={"firstName"}
                    defaultValue={owner?.firstName}
                    render={(props) => (
                      <TextInput
                      readOnly={props.disable}
                      style={{ border: "none" }}
                      disabled
                        value={props.value}
                        autoFocus={focusIndex.index === owner?.key && focusIndex.type === "firstName"}
                        onChange={(e) => {
                          props.onChange(e.target.value);
                          setFocusIndex({ index: owner.key, type: "firstName" });
                        }}
                        onBlur={(e) => {
                          setFocusIndex({ index: -1 });
                          props.onBlur(e);
                        }}
                      />
                    )}
                  />
                </LabelFieldPair>
                <LabelFieldPair>
                  <CardLabel className="bmc-label">{"BMC_MIDDLE_NAME"}</CardLabel>
                  <Controller
                    control={control}
                    name={"middleName"}
                    defaultValue={owner?.middleName}
                    render={(props) => (
                      <TextInput
                      readOnly={props.disable}
                      style={{ border: "none" }}
                      disabled
                        value={props.value}
                        autoFocus={focusIndex.index === owner?.key && focusIndex.type === "middleName"}
                        onChange={(e) => {
                          props.onChange(e.target.value);
                          setFocusIndex({ index: owner.key, type: "middleName" });
                        }}
                        onBlur={(e) => {
                          setFocusIndex({ index: -1 });
                          props.onBlur(e);
                        }}
                      />
                    )}
                  />
                </LabelFieldPair>
                <LabelFieldPair>
                  <CardLabel className="bmc-label">{"BMC_LAST_NAME"}</CardLabel>
                  <Controller
                    control={control}
                    name={"lastName"}
                    defaultValue={owner?.lastName}
                    render={(props) => (
                      <TextInput
                      readOnly={props.disable}
                      style={{ border: "none" }}
                      disabled
                        value={props.value}
                        autoFocus={focusIndex.index === owner?.key && focusIndex.type === "lastName"}
                        onChange={(e) => {
                          props.onChange(e.target.value);
                          setFocusIndex({ index: owner.key, type: "lastName" });
                        }}
                        onBlur={(e) => {
                          setFocusIndex({ index: -1 });
                          props.onBlur(e);
                        }}
                      />
                    )}
                  />
                </LabelFieldPair>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridGap: 20 }}>
                <LabelFieldPair>
                  <CardLabel className="bmc-label">{"BMC_DOB"}</CardLabel>
                  <Controller
                    control={control}
                    name={"dob"}
                    defaultValue={owner?.dob}
                    render={(props) => (
                      <TextInput
                      readOnly={props.disable}
                      style={{ border: "none" }}
                      disabled
                        value={props.value}
                        autoFocus={focusIndex.index === owner?.key && focusIndex.type === "dob"}
                        onChange={(e) => {
                          props.onChange(e.target.value);
                          setFocusIndex({ index: owner.key, type: "dob" });
                        }}
                        onBlur={(e) => {
                          setFocusIndex({ index: -1 });
                          props.onBlur(e);
                        }}
                      />
                    )}
                  />
                </LabelFieldPair>
                <LabelFieldPair>
                  <CardLabel className="bmc-label">{"BMC_GENDER"}</CardLabel>
                  <Controller
                    control={control}
                    name={"gender"}
                    defaultValue={owner?.gender}
                    render={(props) => (
                      <TextInput
                      readOnly={props.disable}
                      style={{ border: "none" }}
                      disabled
                        value={props.value}
                        autoFocus={focusIndex.index === owner?.key && focusIndex.type === "gender"}
                        onChange={(e) => {
                          props.onChange(e.target.value);
                          setFocusIndex({ index: owner.key, type: "gender" });
                        }}
                        onBlur={(e) => {
                          setFocusIndex({ index: -1 });
                          props.onBlur(e);
                        }}
                      />
                    )}
                  />
                </LabelFieldPair>
                <LabelFieldPair>
                  <CardLabel className="bmc-label">{"BMC_MOTHER_NAME"}</CardLabel>
                  <Controller
                    control={control}
                    name={"motherName"}
                    defaultValue={owner?.motherName}
                    render={(props) => (
                      <TextInput
                      readOnly={props.disable}
                      style={{ border: "none" }}
                      disabled
                        value={props.value}
                        autoFocus={focusIndex.index === owner?.key && focusIndex.type === "motherName"}
                        onChange={(e) => {
                          props.onChange(e.target.value);
                          setFocusIndex({ index: owner.key, type: "motherName" });
                        }}
                        onBlur={(e) => {
                          setFocusIndex({ index: -1 });
                          props.onBlur(e);
                        }}
                      />
                    )}
                  />
                </LabelFieldPair>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridGap: 20 }}>
                <LabelFieldPair>
                  <CardLabel className="bmc-label">{"BMC_HOUSE"}</CardLabel>
                  <Controller
                    control={control}
                    name={"house"}
                    defaultValue={owner?.house}
                    render={(props) => (
                      <TextInput
                      readOnly={props.disable}
                      style={{ border: "none" }}
                      disabled
                        value={props.value}
                        autoFocus={focusIndex.index === owner?.key && focusIndex.type === "house"}
                        onChange={(e) => {
                          props.onChange(e.target.value);
                          setFocusIndex({ index: owner.key, type: "house" });
                        }}
                        onBlur={(e) => {
                          setFocusIndex({ index: -1 });
                          props.onBlur(e);
                        }}
                      />
                    )}
                  />
                </LabelFieldPair>
                <LabelFieldPair>
                  <CardLabel className="bmc-label">{"BMC_STREET"}</CardLabel>
                  <Controller
                    control={control}
                    name={"street"}
                    defaultValue={owner?.street}
                    render={(props) => (
                      <TextInput
                      readOnly={props.disable}
                      style={{ border: "none" }}
                      disabled
                        value={props.value}
                        autoFocus={focusIndex.index === owner?.key && focusIndex.type === "street"}
                        onChange={(e) => {
                          props.onChange(e.target.value);
                          setFocusIndex({ index: owner.key, type: "street" });
                        }}
                        onBlur={(e) => {
                          setFocusIndex({ index: -1 });
                          props.onBlur(e);
                        }}
                      />
                    )}
                  />
                </LabelFieldPair>
                <LabelFieldPair>
                  <CardLabel className="bmc-label">{"BMC_LANDMARK"}</CardLabel>
                  <Controller
                    control={control}
                    name={"landMark"}
                    defaultValue={owner?.landMark}
                    render={(props) => (
                      <TextInput
                      readOnly={props.disable}
                      style={{ border: "none" }}
                      disabled
                        value={props.value}
                        autoFocus={focusIndex.index === owner?.key && focusIndex.type === "landMark"}
                        onChange={(e) => {
                          props.onChange(e.target.value);
                          setFocusIndex({ index: owner.key, type: "landMark" });
                        }}
                        onBlur={(e) => {
                          setFocusIndex({ index: -1 });
                          props.onBlur(e);
                        }}
                      />
                    )}
                  />
                </LabelFieldPair>
              </div>
            </div>
            <div style={styles.child2}>
              <img src="" style={{ width: "11rem", height: "11rem", backgroundColor: "#d3d3d3" }} />
            </div>
          </div>
          <div style={styles.Parent}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridGap: "14rem" }}>
              <LabelFieldPair>
                <CardLabel className="bmc-label">{"BMC_LOCALITY"}</CardLabel>
                <Controller
                  control={control}
                  name={"locality"}
                  defaultValue={owner?.locality}
                  render={(props) => (
                    <TextInput
                      readOnly={props.disable}
                      style={{ border: "none" }}
                      disabled
                      value={props.value}
                      autoFocus={focusIndex.index === owner?.key && focusIndex.type === "locality"}
                      onChange={(e) => {
                        props.onChange(e.target.value);
                        setFocusIndex({ index: owner.key, type: "locality" });
                      }}
                      onBlur={(e) => {
                        setFocusIndex({ index: -1 });
                        props.onBlur(e);
                      }}
                    />
                  )}
                />
              </LabelFieldPair>
              <LabelFieldPair>
                <CardLabel className="bmc-label">{"BMC_CITY"}</CardLabel>
                <Controller
                  control={control}
                  name={"city"}
                  defaultValue={owner?.city}
                  render={(props) => (
                    <TextInput
                      readOnly={props.disable}
                      style={{ border: "none" }}
                      disabled
                      value={props.value}
                      autoFocus={focusIndex.index === owner?.key && focusIndex.type === "city"}
                      onChange={(e) => {
                        props.onChange(e.target.value);
                        setFocusIndex({ index: owner.key, type: "city" });
                      }}
                      onBlur={(e) => {
                        setFocusIndex({ index: -1 });
                        props.onBlur(e);
                      }}
                    />
                  )}
                />
              </LabelFieldPair>
              <LabelFieldPair>
                <CardLabel className="bmc-label">{"BMC_SUB_DISTRICT"}</CardLabel>
                <Controller
                  control={control}
                  name={"subDistrict"}
                  defaultValue={owner?.subDistrict}
                  render={(props) => (
                    <TextInput
                      readOnly={props.disable}
                      style={{ border: "none" }}
                      disabled
                      value={props.value}
                      autoFocus={focusIndex.index === owner?.key && focusIndex.type === "subDistrict"}
                      onChange={(e) => {
                        props.onChange(e.target.value);
                        setFocusIndex({ index: owner.key, type: "subDistrict" });
                      }}
                      onBlur={(e) => {
                        setFocusIndex({ index: -1 });
                        props.onBlur(e);
                      }}
                    />
                  )}
                />
              </LabelFieldPair>
              <LabelFieldPair>
                <CardLabel className="bmc-label">{"BMC_DISTRICT"}</CardLabel>
                <Controller
                  control={control}
                  name={"district"}
                  defaultValue={owner?.district}
                  render={(props) => (
                    <TextInput
                      readOnly={props.disable}
                      style={{ border: "none" }}
                      disabled
                      value={props.value}
                      autoFocus={focusIndex.index === owner?.key && focusIndex.type === "district"}
                      onChange={(e) => {
                        props.onChange(e.target.value);
                        setFocusIndex({ index: owner.key, type: "district" });
                      }}
                      onBlur={(e) => {
                        setFocusIndex({ index: -1 });
                        props.onBlur(e);
                      }}
                    />
                  )}
                />
              </LabelFieldPair>
            </div>
          </div>
          <div style={styles.Parent}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridGap: "14rem" }}>
              <LabelFieldPair>
                <CardLabel className="bmc-label">{"BMC_STATE"}</CardLabel>
                <Controller
                  control={control}
                  name={"state"}
                  defaultValue={owner?.state}
                  render={(props) => (
                    <TextInput
                      readOnly={props.disable}
                      style={{ border: "none" }}
                      disabled
                      value={props.value}
                      autoFocus={focusIndex.index === owner?.key && focusIndex.type === "state"}
                      onChange={(e) => {
                        props.onChange(e.target.value);
                        setFocusIndex({ index: owner.key, type: "state" });
                      }}
                      onBlur={(e) => {
                        setFocusIndex({ index: -1 });
                        props.onBlur(e);
                      }}
                    />
                  )}
                />
              </LabelFieldPair>
              <LabelFieldPair>
                <CardLabel className="bmc-label">{"BMC_PINCODE"}</CardLabel>
                <Controller
                  control={control}
                  name={"pincode"}
                  defaultValue={owner?.pincode}
                  render={(props) => (
                    <TextInput
                      readOnly={props.disable}
                      style={{ border: "none" }}
                      disabled
                      value={props.value}
                      autoFocus={focusIndex.index === owner?.key && focusIndex.type === "pincode"}
                      onChange={(e) => {
                        props.onChange(e.target.value);
                        setFocusIndex({ index: owner.key, type: "pincode" });
                      }}
                      onBlur={(e) => {
                        setFocusIndex({ index: -1 });
                        props.onBlur(e);
                      }}
                    />
                  )}
                />
              </LabelFieldPair>
            </div>
          </div>
          <div style={styles.Parent}>
            <div style={styles.child1}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridGap: 20 , alignItems:"baseline"}}>
                <LabelFieldPair>
                  <CardLabel className="bmc-label">{"BMC_ANY_DISABILITY"}</CardLabel>
                </LabelFieldPair>
                <LabelFieldPair>
                  <RadioButtons t={t} optionsKey="value" options={dropdownOptions.radio} selectedOption={radioValue} onSelect={setRadioValue}  style={{display:"flex",flexDirection:"row",alignItems:"center",gap:"20px"}}/>
                </LabelFieldPair>
              </div>
            </div>
            <div style={styles.child2}>
              <button
                type="button"
                onClick={goNext}
                style={{
                  fontFamily: "sans-serif",
                  width: "150px",
                  height: "40px",
                  color: "white",
                  fontSize: "15px",
                  marginTop: "10px",
                  alignSelf: "flex-end",
                  backgroundColor: "#F47738",
                }}
              >
                {t("BMC_CONFIRM")}
              </button>
            </div>
          </div>
        </div>
      </Card>
    </React.Fragment>
  );
};

export default AadhaarFullForm;
