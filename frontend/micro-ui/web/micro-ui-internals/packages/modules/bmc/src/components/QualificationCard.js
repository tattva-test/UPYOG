import { AddIcon, Dropdown, RemoveIcon, TextInput } from "@upyog/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import dropdownOptions from "../pagecomponents/dropdownOptions.json";
import { useMemo } from "react";

const QualificationCard = ({ tenantId, onUpdate, initialRows = [], AddOption = true, AllowRemove = true }) => {
  const { t } = useTranslation();

  const initialDefaultValues = useMemo(() => {
    return {
      qualification: null,
      yearOfPassing: null,
      percentage: 0,
      board: null,
    };
  }, []);

  const processQualificationData = (items, headerLocale) => {
    if (items.length === 0) return [];
    return items
      .map((item) => {
        if (typeof item === "object" && item.qualificationId && item.qualification) {
          return {
            qualification: {
              id: item.qualificationId,
              qualification: item.qualification,
              i18nKey: `${headerLocale}_ADMIN_${item.qualification}`,
            },
            percentage: item.percentage,
            yearOfPassing: { label: item.yearOfPassing, value: item.yearOfPassing },
            board: { label: item.board, value: item.board },
          };
        }
        return null; // Handle cases where item is neither a string nor an object with id and name
      })
      .filter((item) => item !== null); // Filter out null values in case of invalid items
  };

  const processCommonData = (data, headerLocale) => {
    return (
      data?.CommonDetails?.map((item) => ({
        id: item.id,
        name: item.name,
        i18nKey: `${headerLocale}_ADMIN_${item.name}`,
      })) || []
    );
  };

  const headerLocale = Digit.Utils.locale.getTransformedLocale(tenantId);
  const [qualifications, setQualifications] = useState([]);

  const qualificationFunction = (data) => {
    const qualificationData = processCommonData(data, headerLocale);
    setQualifications(qualificationData);
    return { qualificationData };
  };

  const getQualification = { CommonSearchCriteria: { Option: "qualification" } };
  Digit.Hooks.bmc.useCommonGet(getQualification, { select: qualificationFunction });

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: initialDefaultValues,
  });

  const [rows, setRows] = useState([]);

  useEffect(() => {
    const processedRows = processQualificationData(initialRows, headerLocale);
    if (!processedRows || processedRows.length === 0) {
      //setRows([initialDefaultValues]); // Ensure at least one row is available
    } else {
      setRows(processedRows);
    }
  }, [initialRows, headerLocale, initialDefaultValues]);

  //TODO: this should be as per DOB
  const dynamicStartYear = new Date().getFullYear() - 49;
  const currentYear = new Date().getFullYear();

  const years = Array.from({ length: currentYear - dynamicStartYear + 1 }, (v, k) => ({
    label: `${dynamicStartYear + k}`,
    value: dynamicStartYear + k,
  }));
  // Object
  const addRow = () => {
    const formData = getValues();

    const newRow = {
      qualification: formData.qualification || "",
      yearOfPassing: formData.yearOfPassing || "",
      percentage: formData.percentage,
      board: formData.board,
    };

    // Check if the qualification already exists in rows
    const isDuplicate = rows.some((row) => row.qualification === newRow.qualification);

    if (isDuplicate) {
      alert("Duplicate qualification detected, not adding.");
      return; // Stop the function execution to avoid adding a duplicate qualification
    }

    // If not a duplicate, proceed to add the row
    const updatedRows = [...rows, newRow].sort((a, b) => {
      if (a.qualification || a.yearOfPassing < b.qualification || b.yearOfPassing) return -1;
      if (a.qualification || a.yearOfPassing > b.qualification || b.yearOfPassing) return 1;
      return 0;
    });
    setRows(updatedRows);
    reset(initialDefaultValues);
    onUpdate(updatedRows); // Call the callback function to update the parent component
  };

  const removeRow = (index) => {
    const updatedRows = rows.filter((row, i) => i !== index).sort((a, b) => {
      if (a.qualification || a.yearOfPassing < b.qualification || b.yearOfPassing) return -1;
      if (a.qualification || a.yearOfPassing > b.qualification || b.yearOfPassing) return 1;
      return 0;
    });
    setRows(updatedRows);
    onUpdate(updatedRows); // Call the callback function to update the parent component
  };

  return (
    <React.Fragment>
      <div className="bmc-row-card-header">
        <div className="bmc-card-row">
          <div className="bmc-title">{t("BMC_QUALIFICATION_DETAILS")}</div>
          <div className="bmc-table-container" style={{ padding: ".2rem" }}>
            <form onSubmit={handleSubmit(addRow)}>
              <table className="bmc-hover-table">
                <thead>
                  <tr>
                    <th scope="col">{t("BMC_QUALIFICATION")}</th>
                    <th scope="col">{t("BMC_YEAR_OF_PASSING")}</th>
                    <th scope="col">{t("BMC_BOARD")}</th>
                    <th scope="col">{t("BMC_PERCENTAGE")}</th>
                    {AllowRemove && <th scope="col"></th>}
                  </tr>
                </thead>
                <tbody>
                  {AddOption && (
                    <tr>
                      <td data-label={t("BMC_QUALIFICATION")} style={{ textAlign: "left" }}>
                        <Controller
                          control={control}
                          name="qualification"
                          rules={{ required: t("CORE_COMMON_REQUIRED_ERRMSG") }}
                          render={(props) => (
                            <div>
                              <Dropdown
                                placeholder={t("SELECT THE EDUCATION QUALIFICATION")}
                                selected={props.value}
                                select={(qualification) => props.onChange(qualification)}
                                option={qualifications}
                                optionKey="i18nKey"
                                t={t}
                                className="employee-select-wrap bmc-form-field"
                              />
                              {errors.qualification && <sup style={{ color: "red", fontSize: "x-small" }}>{errors.qualification.message}</sup>}
                            </div>
                          )}
                        />
                      </td>
                      <td data-label={t("BMC_YEAR_OF_PASSING")} style={{ textAlign: "left" }}>
                        <Controller
                          control={control}
                          name="yearOfPassing"
                          rules={{ required: t("CORE_COMMON_REQUIRED_ERRMSG") }}
                          render={(props) => (
                            <div>
                              <Dropdown
                                placeholder={t("SELECT YEAR OF PASSING")}
                                selected={props.value}
                                select={(year) => props.onChange(year)}
                                option={years}
                                optionKey="value"
                                t={t}
                                className="employee-select-wrap bmc-form-field"
                              />
                              {errors.yearOfPassing && <sup style={{ color: "red", fontSize: "x-small" }}>{errors.yearOfPassing.message}</sup>}
                            </div>
                          )}
                        />
                      </td>
                      <td data-label={t("BMC_BOARD")} style={{ textAlign: "left" }}>
                        <Controller
                          control={control}
                          name="board"
                          rules={{ required: t("CORE_COMMON_REQUIRED_ERRMSG") }}
                          render={(props) => (
                            <div>
                              <Dropdown
                                placeholder={t("SELECT BOARD")}
                                selected={props.value}
                                select={(board) => props.onChange(board)}
                                option={dropdownOptions.board}
                                optionKey="value"
                                t={t}
                                className="employee-select-wrap bmc-form-field"
                              />
                              {errors.board && <sup style={{ color: "red", fontSize: "x-small" }}>{errors.board.message}</sup>}
                            </div>
                          )}
                        />
                      </td>
                      <td data-label={t("BMC_PERCENTAGE")} style={{ textAlign: "left" }}>
                        <Controller
                          control={control}
                          name="percentage"
                          rules={{
                            required: t("CORE_COMMON_REQUIRED_ERRMSG"),
                            min: {
                              value: 0,
                              message: t("PERCENTAGE MUST BE AT LEAST 0"),
                            },
                            max: {
                              value: 100,
                              message: t("PERCENTAGE MUST BE AT MOST 100"),
                            },
                          }}
                          render={(props) => (
                            <div>
                              <TextInput
                                placeholder={t("Percentage")}
                                value={props.value}
                                onChange={props.onChange}
                                type={"number"}
                                onBlur={props.onBlur}
                                t={t}
                              />
                              {errors.percentage && <sup style={{ color: "red", fontSize: "x-small" }}>{errors.percentage.message}</sup>}
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

                  {rows.map((row, index) => (
                    <tr key={index} className="bmc-table-row">
                      <td data-label={t("BMC_QUALIFICATION")}>{t(row.qualification.i18nKey)}</td>
                      <td data-label={t("BMC_YEAR_OF_PASSING")}>{t(row.yearOfPassing.value)}</td>
                      <td data-label={t("BMC_BOARD")}>{t(row.board ? row.board.label : "-")}</td>
                      <td data-label={t("BMC_PERCENTAGE")}>{t(row.percentage) + "%"}</td>
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

export default QualificationCard;
