import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useHistory } from "react-router-dom";
import Timeline from "../components/bmcTimeline";
import { CardLabel, LabelFieldPair, TextInput } from "@upyog/digit-ui-react-components";
import { Controller, useForm } from "react-hook-form";

const styles = {
  Parent: {
    display: "flex",
    flexDirection: "row",
  },

  child1: {
    width: "80%",
    // height: "100vh",
  },

  child2: {
    width: "20%",
    // height: "100vh",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "10px",
    marginRight: "23rem",
    marginBottom: "1rem",
  },

  button: {
    fontFamily: "sans-serif",
    width: "150px",
    height: "40px",
    color: "white",
    fontSize: "15px",
  },

  submitButton: {
    backgroundColor: "#F47738",
  },

  cancelButton: {
    backgroundColor: "#B1B4B6",
    color: "#505A5F",
  },
};

const createOwnerDetail = () => ({
  applicationNumber: "BMC/2024-25/00001",
  scheme: "Scheme Name",
  machineName: "Sewing Machine",
  name: "Bal Krishana Yadav",
  fatherName: "Ram Krishana Yadav",
  gender: "Male",
  address: "127/14 Secotr 3 Gomati Nagar",
  city: "Lucknow",
  district: "Lucknow",
  state: "Uttar Pradesh",
  pincode: "226022",
  subDistrict: "Lucknow",
  dob: "20/11/1990",
  religion: "Hindu",
  wardName: "A",
  subWardName: "A",
  caste: "Caste Name",
  rationCardType: "BPL",
  bankName: "SBI",
  branchName: "Gomati Nagar",
  ifscCode: "89990",
  accountNumber: "12345678",
  micrCode: "89909",
  profession: "Profession",
  docimile: "Yes",
  income: "Yes",
  voterId: "Yes",
  pan: "Yes",
  bankPassBook: "Yes",
});

const BMCReviewPage = ({ config, onSelect, userType, formData, setError, formState, clearErrors }) => {
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
        <ReviewDetailForm key={owner.key} index={index} owner={owner} {...commonProps} />
      ))}
    </React.Fragment>
  );
};

const ReviewDetailForm = (_props) => {
  const { owner, index, onSelect, focusIndex, allOwners, setFocusIndex, formData, formState, setOwners, t, setError, clearErrors, config } = _props;

  const { control, formState: localFormState, watch, setError: setLocalError, clearErrors: clearLocalErrors, setValue, trigger } = useForm();
  const history = useHistory();
  const [radioValue, setRadioValue] = useState("");

  return (
    <React.Fragment>
      {window.location.href.includes("/citizen") ? <Timeline currentStep={5} /> : null}
      <div className="card" style={{ height: "100%", maxWidth: "75%", margin: "3rem" }}>
        <div style={styles.Parent}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ display: "flex", flexDirection: "row", marginRight: "1rem", alignItems: "baseline" }}>
              <CardLabel>{"BMC_APPLICATION_NUMBER:"}</CardLabel>
              <Controller
                control={control}
                name={"applicationNumber"}
                defaultValue={owner?.applicationNumber}
                render={(props) => (
                  <TextInput
                    readOnly={props.disable}
                    style={{ border: "none" }}
                    disabled
                    value={props.value}
                    autoFocus={focusIndex.index === owner?.key && focusIndex.type === "applicationNumber"}
                    onChange={(e) => {
                      props.onChange(e.target.value);
                      setFocusIndex({ index: owner.key, type: "applicationNumber" });
                    }}
                    onBlur={(e) => {
                      setFocusIndex({ index: -1 });
                      props.onBlur(e);
                    }}
                  />
                )}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "row", marginRight: "1rem", alignItems: "baseline" }}>
              <CardLabel>{"BMC_SCHEME:"}</CardLabel>
              <Controller
                control={control}
                name={"scheme"}
                defaultValue={owner?.scheme}
                render={(props) => (
                  <TextInput
                    readOnly={props.disable}
                    style={{ border: "none" }}
                    disabled
                    value={props.value}
                    autoFocus={focusIndex.index === owner?.key && focusIndex.type === "scheme"}
                    onChange={(e) => {
                      props.onChange(e.target.value);
                      setFocusIndex({ index: owner.key, type: "scheme" });
                    }}
                    onBlur={(e) => {
                      setFocusIndex({ index: -1 });
                      props.onBlur(e);
                    }}
                  />
                )}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "baseline" }}>
              <CardLabel>{"BMC_MACHINE_NAME:"}</CardLabel>
              <Controller
                control={control}
                name={"machineName"}
                defaultValue={owner?.machineName}
                render={(props) => (
                  <TextInput
                    readOnly={props.disable}
                    style={{ border: "none" }}
                    disabled
                    value={props.value}
                    autoFocus={focusIndex.index === owner?.key && focusIndex.type === "machineName"}
                    onChange={(e) => {
                      props.onChange(e.target.value);
                      setFocusIndex({ index: owner.key, type: "machineName" });
                    }}
                    onBlur={(e) => {
                      setFocusIndex({ index: -1 });
                      props.onBlur(e);
                    }}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="card" style={{ height: "100%", maxWidth: "75%", margin: "3rem" }}>
        <div style={styles.Parent}>
          <div style={styles.child1}>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ display: "flex", flexDirection: "row", marginRight: "1rem", alignItems: "baseline" }}>
                <CardLabel>{"BMC_NAME:"}</CardLabel>
                <Controller
                  control={control}
                  name={"name"}
                  defaultValue={owner?.name}
                  render={(props) => (
                    <TextInput
                      readOnly={props.disable}
                      style={{ border: "none" }}
                      disabled
                      value={props.value}
                      autoFocus={focusIndex.index === owner?.key && focusIndex.type === "name"}
                      onChange={(e) => {
                        props.onChange(e.target.value);
                        setFocusIndex({ index: owner.key, type: "name" });
                      }}
                      onBlur={(e) => {
                        setFocusIndex({ index: -1 });
                        props.onBlur(e);
                      }}
                    />
                  )}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "row", marginRight: "1rem", alignItems: "baseline" }}>
                <CardLabel>{"BMC_FATHER_NAME:"}</CardLabel>
                <Controller
                  control={control}
                  name={"fatherName"}
                  defaultValue={owner?.fatherName}
                  render={(props) => (
                    <TextInput
                      readOnly={props.disable}
                      style={{ border: "none" }}
                      disabled
                      value={props.value}
                      autoFocus={focusIndex.index === owner?.key && focusIndex.type === "fatherName"}
                      onChange={(e) => {
                        props.onChange(e.target.value);
                        setFocusIndex({ index: owner.key, type: "fatherName" });
                      }}
                      onBlur={(e) => {
                        setFocusIndex({ index: -1 });
                        props.onBlur(e);
                      }}
                    />
                  )}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "row", marginRight: "1rem", alignItems: "baseline" }}>
                <CardLabel>{"BMC_GENDER:"}</CardLabel>
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
              </div>
            </div>
            <div style={styles.Parent}>
              <div style={{ display: "flex", flexDirection: "row", marginRight: "1rem", alignItems: "baseline" }}>
                <CardLabel>{"BMC_DOB:"}</CardLabel>
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
              </div>
              <div style={{ display: "flex", flexDirection: "row", marginRight: "1rem", alignItems: "baseline" }}>
                <CardLabel>{"BMC_ADDRESS:"}</CardLabel>
                <Controller
                  control={control}
                  name={"address"}
                  defaultValue={owner?.address}
                  render={(props) => (
                    <TextInput
                      readOnly={props.disable}
                      style={{ border: "none" }}
                      disabled
                      value={props.value}
                      autoFocus={focusIndex.index === owner?.key && focusIndex.type === "address"}
                      onChange={(e) => {
                        props.onChange(e.target.value);
                        setFocusIndex({ index: owner.key, type: "address" });
                      }}
                      onBlur={(e) => {
                        setFocusIndex({ index: -1 });
                        props.onBlur(e);
                      }}
                    />
                  )}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "row", marginRight: "1rem", alignItems: "baseline" }}>
                <CardLabel>{"BMC_PINCODE:"}</CardLabel>
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
              </div>
            </div>
            <div style={styles.Parent}>
              <div style={{ display: "flex", flexDirection: "row", marginRight: "1rem", alignItems: "baseline" }}>
                <CardLabel>{"BMC_DISTRICT:"}</CardLabel>
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
              </div>
              <div style={{ display: "flex", flexDirection: "row", marginRight: "1rem", alignItems: "baseline" }}>
                <CardLabel>{"BMC_STATE:"}</CardLabel>
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
              </div>
              <div style={{ display: "flex", flexDirection: "row", marginRight: "1rem", alignItems: "baseline" }}>
                <CardLabel>{"BMC_RELIGION:"}</CardLabel>
                <Controller
                  control={control}
                  name={"religion"}
                  defaultValue={owner?.religion}
                  render={(props) => (
                    <TextInput
                      readOnly={props.disable}
                      style={{ border: "none" }}
                      disabled
                      value={props.value}
                      autoFocus={focusIndex.index === owner?.key && focusIndex.type === "religion"}
                      onChange={(e) => {
                        props.onChange(e.target.value);
                        setFocusIndex({ index: owner.key, type: "religion" });
                      }}
                      onBlur={(e) => {
                        setFocusIndex({ index: -1 });
                        props.onBlur(e);
                      }}
                    />
                  )}
                />
              </div>
            </div>
            <div style={styles.Parent}>
              <div style={{ display: "flex", flexDirection: "row", marginRight: "1rem", alignItems: "baseline" }}>
                <CardLabel>{"BMC_CASTE:"}</CardLabel>
                <Controller
                  control={control}
                  name={"caste"}
                  defaultValue={owner?.caste}
                  render={(props) => (
                    <TextInput
                      readOnly={props.disable}
                      style={{ border: "none" }}
                      disabled
                      value={props.value}
                      autoFocus={focusIndex.index === owner?.key && focusIndex.type === "caste"}
                      onChange={(e) => {
                        props.onChange(e.target.value);
                        setFocusIndex({ index: owner.key, type: "caste" });
                      }}
                      onBlur={(e) => {
                        setFocusIndex({ index: -1 });
                        props.onBlur(e);
                      }}
                    />
                  )}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "row", marginRight: "1rem", alignItems: "baseline" }}>
                <CardLabel>{"BMC_WARD:"}</CardLabel>
                <Controller
                  control={control}
                  name={"wardName"}
                  defaultValue={owner?.wardName}
                  render={(props) => (
                    <TextInput
                      readOnly={props.disable}
                      style={{ border: "none" }}
                      disabled
                      value={props.value}
                      autoFocus={focusIndex.index === owner?.key && focusIndex.type === "wardName"}
                      onChange={(e) => {
                        props.onChange(e.target.value);
                        setFocusIndex({ index: owner.key, type: "wardName" });
                      }}
                      onBlur={(e) => {
                        setFocusIndex({ index: -1 });
                        props.onBlur(e);
                      }}
                    />
                  )}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "row", marginRight: "1rem", alignItems: "baseline" }}>
                <CardLabel>{"BMC_SUB_WARD:"}</CardLabel>
                <Controller
                  control={control}
                  name={"subWardName"}
                  defaultValue={owner?.subWardName}
                  render={(props) => (
                    <TextInput
                      readOnly={props.disable}
                      style={{ border: "none" }}
                      disabled
                      value={props.value}
                      autoFocus={focusIndex.index === owner?.key && focusIndex.type === "subWardName"}
                      onChange={(e) => {
                        props.onChange(e.target.value);
                        setFocusIndex({ index: owner.key, type: "subWardName" });
                      }}
                      onBlur={(e) => {
                        setFocusIndex({ index: -1 });
                        props.onBlur(e);
                      }}
                    />
                  )}
                />
              </div>
            </div>
            <div style={styles.Parent}>
              <div style={{ display: "flex", flexDirection: "row", marginRight: "1rem", alignItems: "baseline" }}>
                <CardLabel>{"BMC_RATION_CARD:"}</CardLabel>
                <Controller
                  control={control}
                  name={"rationCardType"}
                  defaultValue={owner?.rationCardType}
                  render={(props) => (
                    <TextInput
                      readOnly={props.disable}
                      style={{ border: "none" }}
                      disabled
                      value={props.value}
                      autoFocus={focusIndex.index === owner?.key && focusIndex.type === "rationCardType"}
                      onChange={(e) => {
                        props.onChange(e.target.value);
                        setFocusIndex({ index: owner.key, type: "rationCardType" });
                      }}
                      onBlur={(e) => {
                        setFocusIndex({ index: -1 });
                        props.onBlur(e);
                      }}
                    />
                  )}
                />
              </div>
            </div>
          </div>
          <div style={styles.child2}>
            <img src="" style={{ width: "11rem", height: "11rem", backgroundColor: "#d3d3d3" }} />
          </div>
        </div>
      </div>
      <div className="card" style={{ height: "100%", maxWidth: "75%", margin: "3rem" }}>
        <header style={{ fontSize: "20px", marginBottom: "15px", fontWeight: "bold" }}>BANK DETAILS</header>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ display: "flex", flexDirection: "row", marginRight: "1rem", alignItems: "baseline" }}>
            <CardLabel>{"BMC_BANK_NAME:"}</CardLabel>
            <Controller
              control={control}
              name={"bankName"}
              defaultValue={owner?.bankName}
              render={(props) => (
                <TextInput
                  readOnly={props.disable}
                  style={{ border: "none" }}
                  disabled
                  value={props.value}
                  autoFocus={focusIndex.index === owner?.key && focusIndex.type === "bankName"}
                  onChange={(e) => {
                    props.onChange(e.target.value);
                    setFocusIndex({ index: owner.key, type: "bankName" });
                  }}
                  onBlur={(e) => {
                    setFocusIndex({ index: -1 });
                    props.onBlur(e);
                  }}
                />
              )}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "row", marginRight: "1rem", alignItems: "baseline" }}>
            <CardLabel>{"BMC_BRANCH_NAME:"}</CardLabel>
            <Controller
              control={control}
              name={"branchName"}
              defaultValue={owner?.branchName}
              render={(props) => (
                <TextInput
                  readOnly={props.disable}
                  style={{ border: "none" }}
                  disabled
                  value={props.value}
                  autoFocus={focusIndex.index === owner?.key && focusIndex.type === "branchName"}
                  onChange={(e) => {
                    props.onChange(e.target.value);
                    setFocusIndex({ index: owner.key, type: "branchName" });
                  }}
                  onBlur={(e) => {
                    setFocusIndex({ index: -1 });
                    props.onBlur(e);
                  }}
                />
              )}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "row", marginRight: "1rem", alignItems: "baseline" }}>
            <CardLabel>{"BMC_ACCOUNT_NUMBER:"}</CardLabel>
            <Controller
              control={control}
              name={"accountNumber"}
              defaultValue={owner?.accountNumber}
              render={(props) => (
                <TextInput
                  readOnly={props.disable}
                  style={{ border: "none" }}
                  disabled
                  value={props.value}
                  autoFocus={focusIndex.index === owner?.key && focusIndex.type === "accountNumber"}
                  onChange={(e) => {
                    props.onChange(e.target.value);
                    setFocusIndex({ index: owner.key, type: "accountNumber" });
                  }}
                  onBlur={(e) => {
                    setFocusIndex({ index: -1 });
                    props.onBlur(e);
                  }}
                />
              )}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "row", marginRight: "1rem", alignItems: "baseline" }}>
            <CardLabel>{"BMC_IFSC:"}</CardLabel>
            <Controller
              control={control}
              name={"ifscCode"}
              defaultValue={owner?.ifscCode}
              render={(props) => (
                <TextInput
                  readOnly={props.disable}
                  style={{ border: "none" }}
                  disabled
                  value={props.value}
                  autoFocus={focusIndex.index === owner?.key && focusIndex.type === "ifscCode"}
                  onChange={(e) => {
                    props.onChange(e.target.value);
                    setFocusIndex({ index: owner.key, type: "ifscCode" });
                  }}
                  onBlur={(e) => {
                    setFocusIndex({ index: -1 });
                    props.onBlur(e);
                  }}
                />
              )}
            />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "row", marginRight: "1rem", alignItems: "baseline" }}>
          <CardLabel>{"BMC_MICR:"}</CardLabel>
          <Controller
            control={control}
            name={"micrCode"}
            defaultValue={owner?.micrCode}
            render={(props) => (
              <TextInput
                readOnly={props.disable}
                style={{ border: "none" }}
                disabled
                value={props.value}
                autoFocus={focusIndex.index === owner?.key && focusIndex.type === "micrCode"}
                onChange={(e) => {
                  props.onChange(e.target.value);
                  setFocusIndex({ index: owner.key, type: "micrCode" });
                }}
                onBlur={(e) => {
                  setFocusIndex({ index: -1 });
                  props.onBlur(e);
                }}
              />
            )}
          />
        </div>
      </div>
      <div className="card" style={{ height: "100%", maxWidth: "75%", margin: "3rem" }}>
        <header style={{ fontSize: "20px", marginBottom: "15px", fontWeight: "bold" }}>PROFESSIONAL DETAILS</header>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ display: "flex", flexDirection: "row", marginRight: "1rem", alignItems: "baseline" }}>
            <CardLabel>{"BMC_PROFESSION:"}</CardLabel>
            <Controller
              control={control}
              name={"profession"}
              defaultValue={owner?.profession}
              render={(props) => (
                <TextInput
                  readOnly={props.disable}
                  style={{ border: "none" }}
                  disabled
                  value={props.value}
                  autoFocus={focusIndex.index === owner?.key && focusIndex.type === "profession"}
                  onChange={(e) => {
                    props.onChange(e.target.value);
                    setFocusIndex({ index: owner.key, type: "profession" });
                  }}
                  onBlur={(e) => {
                    setFocusIndex({ index: -1 });
                    props.onBlur(e);
                  }}
                />
              )}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "row", marginRight: "1rem", alignItems: "baseline" }}>
            <CardLabel>{"BMC_DOMICILE:"}</CardLabel>
            <Controller
              control={control}
              name={"docimile"}
              defaultValue={owner?.docimile}
              render={(props) => (
                <TextInput
                  readOnly={props.disable}
                  style={{ border: "none" }}
                  disabled
                  value={props.value}
                  autoFocus={focusIndex.index === owner?.key && focusIndex.type === "docimile"}
                  onChange={(e) => {
                    props.onChange(e.target.value);
                    setFocusIndex({ index: owner.key, type: "docimile" });
                  }}
                  onBlur={(e) => {
                    setFocusIndex({ index: -1 });
                    props.onBlur(e);
                  }}
                />
              )}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "row", marginRight: "1rem", alignItems: "baseline" }}>
            <CardLabel>{"BMC_INCOME:"}</CardLabel>
            <Controller
              control={control}
              name={"income"}
              defaultValue={owner?.income}
              render={(props) => (
                <TextInput
                  readOnly={props.disable}
                  style={{ border: "none" }}
                  disabled
                  value={props.value}
                  autoFocus={focusIndex.index === owner?.key && focusIndex.type === "income"}
                  onChange={(e) => {
                    props.onChange(e.target.value);
                    setFocusIndex({ index: owner.key, type: "income" });
                  }}
                  onBlur={(e) => {
                    setFocusIndex({ index: -1 });
                    props.onBlur(e);
                  }}
                />
              )}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "row", marginRight: "1rem", alignItems: "baseline" }}>
            <CardLabel>{"BMC_VOTER_ID:"}</CardLabel>
            <Controller
              control={control}
              name={"voterId"}
              defaultValue={owner?.voterId}
              render={(props) => (
                <TextInput
                  readOnly={props.disable}
                  style={{ border: "none" }}
                  disabled
                  value={props.value}
                  autoFocus={focusIndex.index === owner?.key && focusIndex.type === "voterId"}
                  onChange={(e) => {
                    props.onChange(e.target.value);
                    setFocusIndex({ index: owner.key, type: "voterId" });
                  }}
                  onBlur={(e) => {
                    setFocusIndex({ index: -1 });
                    props.onBlur(e);
                  }}
                />
              )}
            />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "row", marginRight: "1rem", alignItems: "baseline" }}>
          <CardLabel>{"BMC_PAN_CARD:"}</CardLabel>
          <Controller
            control={control}
            name={"pan"}
            defaultValue={owner?.pan}
            render={(props) => (
              <TextInput
                readOnly={props.disable}
                style={{ border: "none" }}
                disabled
                value={props.value}
                autoFocus={focusIndex.index === owner?.key && focusIndex.type === "pan"}
                onChange={(e) => {
                  props.onChange(e.target.value);
                  setFocusIndex({ index: owner.key, type: "pan" });
                }}
                onBlur={(e) => {
                  setFocusIndex({ index: -1 });
                  props.onBlur(e);
                }}
              />
            )}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "row", marginRight: "1rem", alignItems: "baseline" }}>
          <CardLabel>{"BMC_BANK_PASSBOOK:"}</CardLabel>
          <Controller
            control={control}
            name={"bankPassBook"}
            defaultValue={owner?.bankPassBook}
            render={(props) => (
              <TextInput
                readOnly={props.disable}
                style={{ border: "none" }}
                disabled
                value={props.value}
                autoFocus={focusIndex.index === owner?.key && focusIndex.type === "bankPassBook"}
                onChange={(e) => {
                  props.onChange(e.target.value);
                  setFocusIndex({ index: owner.key, type: "bankPassBook" });
                }}
                onBlur={(e) => {
                  setFocusIndex({ index: -1 });
                  props.onBlur(e);
                }}
              />
            )}
          />
        </div>
      </div>

      <div style={styles.buttonContainer}>
        <button type="submit" style={{ ...styles.button, ...styles.submitButton }}>
          {t("BMC_SUBMIT")}
        </button>
        <button type="button" style={{ ...styles.button, ...styles.cancelButton }} onClick={() => history.goBack()}>
          {t("BMC_CANCEL")}
        </button>
      </div>
    </React.Fragment>
  );
};

export default BMCReviewPage;
