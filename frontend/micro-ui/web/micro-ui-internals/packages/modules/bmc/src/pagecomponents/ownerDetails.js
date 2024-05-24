import React, { useState, useEffect } from "react";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { useLocation, useHistory } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { CardLabel, CardLabelError, Dropdown, LabelFieldPair, TextInput, RadioButtons, TextArea, Card } from "@upyog/digit-ui-react-components";
import dropdownOptions from "./dropdownOptions.json";
import Timeline from "../components/bmcTimeline";

const createOwnerDetail = () => ({
  wardName: "",
  subWardName: "",
  religion: "",
  casteCategory: "",
  accountNumber: "",
  ifscCode: "",
  bankName: "",
  branchName: "",
  micrCode: "",
  profession: "",
  selfDeclarationMessage: "",

  key: Date.now(),
});

const styles = {
  Parent: {
    display: "flex",
    flexDirection: "row",
    marginTop: "1rem",
  },

  child1: {
    width: "100%",
    // height: "100vh",
  },
};

const OwnerDetailFull = ({ config, onSelect, userType, formData, setError, formState, clearErrors }) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [owners, setOwners] = useState(formData?.owners || [createOwnerDetail()]);
  const [focusIndex, setFocusIndex] = useState({ index: -1, type: "" });

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();

  // useEffect(() => {
  //   onSelect(config?.key, owners);

  // }, [owners]);

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
  const { owner, index, focusIndex, allOwners, onSelect, setFocusIndex, formData, formState, setOwners, t, setError, clearErrors, config } = _props;

  const { control, formState: localFormState, watch, setError: setLocalError, clearErrors: clearLocalErrors, setValue, trigger } = useForm();
  const formValue = watch();
  const { errors } = localFormState;
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const history = useHistory();

  useEffect(() => {
    trigger();
  }, []);

  const [part, setPart] = useState({});
  const [domicile, setDomicile] = useState("");
  const [incomeCer, setIncomeCer] = useState("");
  const [voterId, setVoterId] = useState("");
  const [pan, setPan] = useState("");
  const [bankPassBook, setBankPassBook] = useState("");

  const onSkip = () => {
    onSelect();
  };

  function goNext() {
    sessionStorage.setItem("aadhaar", domicile.i18nKey);
    onSelect(config.key, domicile);
    sessionStorage.setItem("aadhaar", incomeCer.i18nKey);
    onSelect(config.key, incomeCer);
    sessionStorage.setItem("aadhaar", voterId.i18nKey);
    onSelect(config.key, voterId);
    sessionStorage.setItem("aadhaar", pan.i18nKey);
    onSelect(config.key, pan);
    sessionStorage.setItem("aadhaar", bankPassBook.i18nKey);
    onSelect(config.key, bankPassBook);
  }

  useEffect(() => {
    if (!_.isEqual(part, formValue)) {
      setPart({ ...formValue });

      setOwners((prev) => prev.map((o) => (o.key && o.key === owner.key ? { ...o, ...formValue } : { ...o })));
      trigger();
    }
  }, [formValue]);

  // useEffect(() => {
  //   if (Object.keys(errors).length && !_.isEqual(formState.errors[config.key]?.type || {}, errors)) setError(config.key, { type: errors });
  //   else if (!Object.keys(errors).length && formState.errors[config.key]) clearErrors(config.key);
  // }, [errors]);

  const errorStyle = { width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" };
  return (
    <React.Fragment>
      {window.location.href.includes("/citizen") ? <Timeline currentStep={4} /> : null}
      {allOwners?.length > 2 ? <div style={{ marginBottom: "16px", padding: "5px", cursor: "pointer", textAlign: "right" }}>X</div> : null}
      <Card style={{ maxWidth: "100vw", marginLeft: "2rem", marginTop: "2rem" }}>
        <div style={{ margin: "1rem" }}>
          <div style={styles.Parent}>
            <div style={styles.child1}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridGap: 20 }}>
                <LabelFieldPair>
                  <CardLabel className="bmc-label">{t("BMC_WARD_NAME")}</CardLabel>
                  <Controller
                    control={control}
                    name={"wardName"}
                    defaultValue={owner?.wardName}
                    render={(props) => (
                      <TextInput
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
                        placeholder={" Enter the Ward Name"}
                      />
                    )}
                  />
                </LabelFieldPair>
                {/* <CardLabelError style={errorStyle}>{localFormState.touched.wardName ? errors?.wardName?.message : ""}</CardLabelError> */}
                <LabelFieldPair>
                  <CardLabel className="bmc-label">{t("BMC_SUB_WARD_NAME")}</CardLabel>
                  <Controller
                    control={control}
                    name={"subWardName"}
                    defaultValue={owner?.subWardName}
                    render={(props) => (
                      <TextInput
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
                        placeholder={" Enter the Sub Ward Name"}
                      />
                    )}
                  />
                </LabelFieldPair>
                {/* <CardLabelError style={errorStyle}>{localFormState.touched.subWardName ? errors?.subWardName?.message : ""}</CardLabelError> */}
                <LabelFieldPair>
                  <CardLabel className="bmc-label">{t("BMC_Religion")}</CardLabel>
                  <Controller
                    control={control}
                    name={"religion"}
                    defaultValue={owner?.religion}
                    render={(props) => (
                      <TextInput
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
                        placeholder={" Enter the Religion"}
                      />
                    )}
                  />
                </LabelFieldPair>
                {/* <CardLabelError style={errorStyle}>{localFormState.touched.religion ? errors?.religion?.message : ""}</CardLabelError> */}
                <LabelFieldPair>
                  <CardLabel className="bmc-label">{t("BMC_casteCategory")}</CardLabel>
                  <Controller
                    control={control}
                    name="casteCategory"
                    defaultValue={owner?.casteCategory}
                    render={(props) => (
                      <TextInput
                        value={props.value}
                        autoFocus={focusIndex.index === owner?.key && focusIndex.type === "casteCategory"}
                        onChange={(e) => {
                          props.onChange(e.target.value);
                          setFocusIndex({ index: owner.key, type: "casteCategory" });
                        }}
                        onBlur={(e) => {
                          setFocusIndex({ index: -1 });
                          props.onBlur(e);
                        }}
                        placeholder={" Enter the Caste Category"}
                      />
                    )}
                  />
                </LabelFieldPair>
                {/* <CardLabelError style={errorStyle}>{localFormState.touched.casteCategory ? errors?.casteCategory?.message : ""}</CardLabelError> */}
              </div>
            </div>
          </div>
          <span style={{ fontSize: "20px", fontWeight: "800", marginBottom: "5px" }}>{t("BMC_BANK_DETAILS")}</span>
          <div style={styles.Parent}>
            <div style={styles.child1}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridGap: 20 }}>
                <LabelFieldPair>
                  <CardLabel className="bmc-label">{t("BMC_BANK_NAME")}</CardLabel>

                  <Controller
                    control={control}
                    name={"bankName"}
                    defaultValue={owner?.bankName}
                    rules={{
                      required: t("CORE_COMMON_REQUIRED_ERRMSG"),
                    }}
                    render={(props) => (
                      <Dropdown
                        className="bmc-dropdown"
                        placeholder={" Enter the Bank Name"}
                        selected={props.value}
                        select={props.onChange}
                        onBlur={props.onBlur}
                        option={dropdownOptions.bankName}
                        optionKey="value"
                        t={t}
                      />
                    )}
                  />
                </LabelFieldPair>
                <LabelFieldPair>
                  <CardLabel className="bmc-label">{t("BMC_BRANCH_NAME")}</CardLabel>

                  <Controller
                    control={control}
                    name={"branchName"}
                    defaultValue={owner?.branchName}
                    rules={{
                      required: t("CORE_COMMON_REQUIRED_ERRMSG"),
                    }}
                    render={(props) => (
                      <Dropdown
                        className="bmc-dropdown"
                        placeholder={" Enter the Branch Name"}
                        selected={props.value}
                        select={props.onChange}
                        onBlur={props.onBlur}
                        option={dropdownOptions.bankBranch}
                        optionKey="value"
                        t={t}
                      />
                    )}
                  />
                </LabelFieldPair>
                <LabelFieldPair>
                  <CardLabel className="bmc-label">{t("BMC_accountNumber")}</CardLabel>

                  <Controller
                    control={control}
                    name="accountNumber"
                    defaultValue={owner?.accountNumber}
                    render={(props) => (
                      <TextInput
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
                        placeholder={" Enter the Account Number"}
                      />
                    )}
                  />
                </LabelFieldPair>
                <LabelFieldPair>
                  <CardLabel className="bmc-label">{t("BMC_IFSC_CODE")}</CardLabel>

                  <Controller
                    control={control}
                    name="ifscCode"
                    defaultValue={owner?.ifscCode}
                    render={(props) => (
                      <TextInput
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
                        placeholder={" Enter the IFSC Code"}
                      />
                    )}
                  />
                </LabelFieldPair>
              </div>
            </div>
          </div>
          <div style={styles.Parent}>
            <div style={styles.child1}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridGap: 20 }}>
                <LabelFieldPair>
                  <CardLabel className="bmc-label">{t("BMC_MICR_CODE")}</CardLabel>
                  <Controller
                    control={control}
                    name="micrCode"
                    defaultValue={owner?.micrCode}
                    render={(props) => (
                      <TextInput
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
                        placeholder={" Enter the MICR Code"}
                      />
                    )}
                  />
                </LabelFieldPair>
              </div>
            </div>
          </div>
          <span style={{ fontSize: "20px", fontWeight: "800", marginBottom: "5px" }}>{t("BMC_PROFESSIONAL_DETAILS")}</span>
          <div style={styles.Parent}>
            <div style={styles.child1}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridGap: 20 }}>
                <LabelFieldPair>
                  <CardLabel className="bmc-label">{t("BMC_PROFESSION")}</CardLabel>
                  <Controller
                    control={control}
                    name={"profession"}
                    defaultValue={owner?.profession}
                    rules={{
                      required: t("CORE_COMMON_REQUIRED_ERRMSG"),
                    }}
                    render={(props) => (
                      <Dropdown
                        className="bmc-dropdown"
                        placeholder={" Enter the Profession"}
                        selected={props.value}
                        select={props.onChange}
                        onBlur={props.onBlur}
                        option={dropdownOptions.profession}
                        optionKey="value"
                        t={t}
                      />
                    )}
                  />
                </LabelFieldPair>
                <LabelFieldPair t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!domicile} isMultipleAllow={true}>
                  <CardLabel className="bmc-label">{t("BMC_DOMICILE_CERTIFICATE_OF_MUMBAI")}</CardLabel>
                  <RadioButtons
                    style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "20px" }}
                    t={t}
                    optionsKey="value"
                    options={dropdownOptions.radio}
                    selectedOption={domicile}
                    onSelect={setDomicile}
                  />
                </LabelFieldPair>
                <LabelFieldPair t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!incomeCer} isMultipleAllow={true}>
                  <CardLabel className="bmc-label">{t("BMC_INCOME_CERTIFICATE")}</CardLabel>
                  <RadioButtons
                    style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "20px" }}
                    t={t}
                    optionsKey="value"
                    options={dropdownOptions.radio}
                    selectedOption={incomeCer}
                    onSelect={setIncomeCer}
                  />
                </LabelFieldPair>
                <LabelFieldPair t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!voterId} isMultipleAllow={true}>
                  <CardLabel className="bmc-label">{t("BMC_VOTER_ID_CARD")}</CardLabel>
                  <RadioButtons
                    style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "20px" }}
                    t={t}
                    optionsKey="value"
                    options={dropdownOptions.radio}
                    selectedOption={voterId}
                    onSelect={setVoterId}
                  />
                </LabelFieldPair>
              </div>
            </div>
          </div>
          <div style={styles.Parent}>
            <div style={styles.child1}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridGap: 20 }}>
                <LabelFieldPair t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!pan} isMultipleAllow={true}>
                  <CardLabel className="bmc-label">{t("BMC_PAN_CARD")}</CardLabel>
                  <RadioButtons
                    style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "20px" }}
                    t={t}
                    optionsKey="value"
                    options={dropdownOptions.radio}
                    selectedOption={pan}
                    onSelect={setPan}
                  />
                </LabelFieldPair>
                <LabelFieldPair t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!bankPassBook} isMultipleAllow={true}>
                  <CardLabel className="bmc-label">{t("BMC_BANK_PASSBOOK")}</CardLabel>
                  <RadioButtons
                    style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "20px" }}
                    t={t}
                    optionsKey="value"
                    options={dropdownOptions.radio}
                    selectedOption={bankPassBook}
                    onSelect={setBankPassBook}
                  />
                </LabelFieldPair>
                <LabelFieldPair>
                  <Controller
                    control={control}
                    name={"selfDeclarationMessage"}
                    defaultValue={owner?.selfDeclarationMessage}
                    render={(props) => (
                      <TextArea
                        value={props.value}
                        autoFocus={focusIndex.index === owner?.key && focusIndex.type === "selfDeclarationMessage"}
                        onChange={(e) => {
                          props.onChange(e.target.value);
                          setFocusIndex({ index: owner.key, type: "selfDeclarationMessage" });
                        }}
                        onBlur={(e) => {
                          setFocusIndex({ index: -1 });
                          props.onBlur(e);
                        }}
                        placeholder={" Enter the message"}
                      />
                    )}
                  />
                </LabelFieldPair>
              </div>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => history.push("/digit-ui/citizen/bmc/create-abc/review")}
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
          {t("BMC_NEXT")}
        </button>
      </Card>
    </React.Fragment>
  );
};

export default OwnerDetailFull;
