import { AddIcon, RemoveIcon, TextInput } from "@upyog/digit-ui-react-components";
import React, { useEffect, useState, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const BankDetailsForm = ({ tenantId, onUpdate, initialRows = [], AddOption = true, AllowRemove = true }) => {
  const { t } = useTranslation();
  const initialDefaultValues = useMemo(() => {
    return {
      branchId: "",
      name: "",
      branchName: "",
      ifsc: "",
      micr: "",
      accountNumber: "",
    };
  }, []);

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: initialDefaultValues,
  });

  const headerLocale = Digit.Utils.locale.getTransformedLocale(tenantId);
  const [bankData, setBankData] = useState([]);
  const [rows, setRows] = useState([]);
  const ifsc = watch("ifsc");

  const processBankData = (data, headerLocale, array) => {
    if (array) {
      if (data.length === 0) return [];
      return (
        data?.BankDetails?.filter((item) => item.branchId !== 0).map((item) => ({
          branchId: item.branchId,
          name: item.name,
          branchName: item.branchName,
          ifsc: item.ifsc,
          micr: item.micr,
          accountNumber: item.accountNumber,
          i18nKey: `${headerLocale}_ADMIN_${item.name}`,
        })) || []
      );
    } else {
      if (!data) return [];
      return (
        data
          .filter((item) => item.branchId !== 0)
          .map((item) => ({
            branchId: item.branchId,
            name: item.name,
            branchName: item.branchName,
            ifsc: item.ifsc,
            micr: item.micr,
            accountNumber: item.accountNumber,
            i18nKey: `${headerLocale}_ADMIN_${item.name}`,
          })) || []
      );
    }
  };

  const bankFunction = (data) => {
    const BankData = processBankData(data, headerLocale, true);
    setBankData(BankData);
    return { BankData };
  };

  const getBank = { BankSearchCriteria: { IFSC: ifsc } };
  Digit.Hooks.bmc.useCommonGetBank(getBank, { select: bankFunction });

  useEffect(() => {
    if (ifsc && ifsc.length === 11) {
      const details = bankData.find((bank) => bank.ifsc === ifsc) || {};
      setValue("branchId", details.branchId || "");
      setValue("name", details.name || "");
      setValue("branchName", details.branchName || "");
      setValue("micr", details.micr || "");
    } else {
      setValue("branchId", "");
      setValue("name", "");
      setValue("branchName", "");
      setValue("micr", "");
    }
  }, [ifsc, bankData, setValue]);

  useEffect(() => {
    const processedRows = processBankData(initialRows, headerLocale, false);
    setRows(processedRows);
  }, [initialRows, headerLocale]);

  const addRow = () => {
    const formData = getValues();
    const branchId = bankData.find((item) => {
      return item.branchId;
    });
    const updatedRows = [
      ...rows,
      {
        branchId: branchId.branchId,
        name: formData.name,
        branchName: formData.branchName,
        ifsc: formData.ifsc,
        micr: formData.micr,
        accountNumber: formData.accountNumber,
      },
    ];
    setRows(updatedRows);

    reset(initialDefaultValues);
    onUpdate(updatedRows);
  };

  const removeRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
    onUpdate(updatedRows);
  };

  return (
    <React.Fragment>
      <div className="bmc-row-card-header">
        <div className="bmc-card-row">
          <div className="bmc-title">{t("BMC_BANK DETAILS")}</div>
          <div className="bmc-table-container" style={{ padding: ".2rem" }}>
            <form onSubmit={handleSubmit(addRow)}>
              <table className="bmc-hover-table">
                <thead>
                  <tr>
                    <th scope="col">{t("BMC_IFSC Code")}</th>
                    <th scope="col">{t("BMC_MICR Code")}</th>
                    <th scope="col">{t("BMC_Account Number")}</th>
                    <th scope="col">{t("BMC_BANK NAME")}</th>
                    <th scope="col">{t("BMC_BRANCH NAME")}</th>
                    {AllowRemove && <th scope="col"></th>}
                  </tr>
                </thead>
                <tbody>
                  {AddOption && (
                    <tr>
                      <td data-label={t("BMC_IFSC Code")} style={{ textAlign: "left" }}>
                        <Controller
                          control={control}
                          name="ifsc"
                          rules={{
                            required: t("CORE_COMMON_REQUIRED_ERRMSG"),
                            maxLength: { value: 11, message: t("IFSC code must be 11 characters long") },
                            pattern: {
                              value: /^[A-Z]{4}0[A-Z0-9]{6}$/, // Regex pattern for IFSC code
                              message: t("Invalid IFSC code"), // Custom validation message
                            },
                          }}
                          render={(props) => (
                            <div>
                              <TextInput placeholder={t("IFSC CODE")} value={props.value} onChange={props.onChange} onBlur={props.onBlur} t={t} />
                              {errors.ifsc && <sup style={{ color: "red", fontSize: "x-small" }}>{errors.ifsc.message}</sup>}
                            </div>
                          )}
                        />
                      </td>
                      <td data-label={t("BMC_MICR Code")} style={{ textAlign: "left" }}>
                        <Controller
                          control={control}
                          name="micr"
                          render={(props) => (
                            <div>
                              <TextInput {...props} placeholder={t("MICR CODE")} disabled />
                              {errors.micr && <sup style={{ color: "red", fontSize: "x-small" }}>{errors.micr.message}</sup>}
                            </div>
                          )}
                        />
                      </td>
                      <td data-label={t("BMC_Account Number")} style={{ textAlign: "left" }}>
                        <Controller
                          control={control}
                          name="accountNumber"
                          rules={{
                            required: t("CORE_COMMON_REQUIRED_ERRMSG"),
                            minLength: { value: 8, message: t("Account Number must be 8 - 18 characters long") },
                            maxLength: { value: 18, message: t("Account Number must be 8 - 18 characters long") },
                            pattern: {
                              value: /^(?=\S{8,18}$)[A-Za-z0-9]+$/, // Regex pattern for IFSC code
                              message: t("Invalid Account Number"), // Custom validation message
                            },
                          }}
                          render={(props) => (
                            <div>
                              <TextInput {...props} placeholder={t("ACCOUNT NUMBER")} type="Text" value={props.value} onChange={props.onChange} />
                              {errors.accountNumber && <sup style={{ color: "red", fontSize: "x-small" }}>{errors.accountNumber.message}</sup>}
                            </div>
                          )}
                        />
                      </td>
                      <td data-label={t("BMC_BANK NAME")} style={{ textAlign: "left" }}>
                        <Controller
                          control={control}
                          name="name"
                          render={(props) => (
                            <div>
                              <TextInput {...props} placeholder={t("BANK NAME")} disabled />
                            </div>
                          )}
                        />
                      </td>
                      <td data-label={t("BMC_BRANCH NAME")} style={{ textAlign: "left" }}>
                        <Controller
                          control={control}
                          name="branchName"
                          render={(props) => (
                            <div>
                              <TextInput {...props} placeholder={t("BRANCH NAME")} disabled />
                            </div>
                          )}
                        />
                      </td>
                      <td data-label={t("BMC_ADD_ROW")}>
                        <button type="submit">
                          <AddIcon className="bmc-add-icon" />
                        </button>
                      </td>
                    </tr>
                  )}

                  {rows.length !== 0 &&
                    rows.map((row, index) => (
                      <tr key={index}>
                        <td style={{ display: "none" }}>{row.branchId}</td>
                        <td data-label={t("BMC_IFSC Code")}>{row.ifsc}</td>
                        <td data-label={t("BMC_MICR Code")}>{row.micr}</td>
                        <td data-label={t("BMC_Account Number")}>{row.accountNumber}</td>
                        <td data-label={t("BMC_BANK NAME")}>{row.name}</td>
                        <td data-label={t("BMC_BRANCH NAME")}>{row.branchName}</td>
                        {AllowRemove && (
                          <td data-label={t("Remove Row")}>
                            <button type="button" onClick={() => removeRow(index)}>
                              <RemoveIcon className="bmc-remove-icon" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                </tbody>
              </table>
            </form>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default BankDetailsForm;
