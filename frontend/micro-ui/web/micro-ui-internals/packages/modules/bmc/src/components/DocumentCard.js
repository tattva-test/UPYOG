import { AddIcon, Dropdown, RemoveIcon, TextInput } from "@upyog/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

const DocumentCard = ({ tenantId, onUpdate, initialRows = [], AddOption = true, AllowRemove = true }) => {

  const { t } = useTranslation();
  const [documents, setDocuments] = useState([]);
  const headerLocale = Digit.Utils.locale.getTransformedLocale(tenantId);
  const initialDefaultValues = useMemo(() => {
    return {
        document: null,
        documentNo: "",
    };
  }, []);

  const processDocumentData = (items, headerLocale) => {
    if (items.length === 0) return [];
    return items
      .map((item) => {
        if (typeof item === "object" && item.id && item.name) {
          return {
            document: {
              id: item.id,
              document: item.name,
              i18nKey: `${headerLocale}_ADMIN_${item.name}`,
            },
            documentNo: item.documentNo,
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

  
  
  const documentFunction = (data) => {
    const documentsData = processCommonData(data, headerLocale);
    setDocuments(documentsData);
    return { documentsData };
  };

  const getDocuments = { CommonSearchCriteria: { Option: "document" } };
  Digit.Hooks.bmc.useCommonGet(getDocuments, { select: documentFunction });

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
    const processedRows = processDocumentData(initialRows, headerLocale);
    if (!processedRows || processedRows.length === 0) {
      //setRows([initialDefaultValues]); // Ensure at least one row is available
    } else {
      setRows(processedRows);
    }
  }, [initialRows, headerLocale, initialDefaultValues]);

  // Object
  const addRow = () => {
    const formData = getValues();
    const newRow = {
        document: formData.document || "",
        documentNo: formData.documentNo||"",
    };
    // Check if the qualification already exists in rows
    const isDuplicate = rows.some((row) => row.document.document === newRow.document.name);

    if (isDuplicate) {
      alert("Duplicate document detected, not adding.");
      return; // Stop the function execution to avoid adding a duplicate qualification
    }

    // If not a duplicate, proceed to add the row
    const updatedRows = [...rows, newRow];
    setRows(updatedRows);
    reset(initialDefaultValues);
    onUpdate(updatedRows); // Call the callback function to update the parent component
  };

  const removeRow = (index) => {
    const updatedRows = rows.filter((row, i) => i !== index);
    setRows(updatedRows);
    onUpdate(updatedRows); // Call the callback function to update the parent component
  };

  return (
    <React.Fragment>
      <div className="bmc-row-card-header">
        <div className="bmc-card-row">
          <div className="bmc-title">{t("BMC_DOCUMENT_DETAILS")}</div>
          <div className="bmc-table-container" style={{ padding: ".2rem" }}>
            <form onSubmit={handleSubmit(addRow)}>
              <table className="bmc-hover-table">
                <thead>
                  <tr>
                    <th scope="col">{t("BMC_DOCUMENTS")}</th>
                    <th scope="col">{t("BMC_DOCUMENTNO")}</th>
                    {AllowRemove && <th scope="col"></th>}
                  </tr>
                </thead>
                <tbody>
                  {AddOption && (
                    <tr>
                      <td data-label={t("BMC_DOCUMENT")} style={{ textAlign: "left" }} className="bmc-qualification-td">
                        <Controller
                          control={control}
                          name="document"
                          rules={{ required: t("CORE_COMMON_REQUIRED_ERRMSG") }}
                          render={(props) => (
                            <div>
                              <Dropdown
                                placeholder={t("SELECT THE DOCUMENT")}
                                selected={props.value}
                                select={(document) => props.onChange(document)}
                                option={documents}
                                optionKey="i18nKey"
                                t={t}
                                className="employee-select-wrap bmc-form-field"
                              />
                              {errors.document && <sup style={{ color: "red", fontSize: "x-small" }}>{errors.document.message}</sup>}
                            </div>
                          )}
                        />
                      </td>
                      <td data-label={t("BMC_DOCUMENTNO")} style={{ textAlign: "left" }} className="bmc-qualification-td">
                        <Controller
                          control={control}
                          name="documentNo"
                          rules={{
                            required: t("CORE_COMMON_REQUIRED_ERRMSG"),
                          }}
                          render={(props) => (
                            <div>
                              <TextInput
                                placeholder={t("Document Number")}
                                value={props.value}
                                onChange={props.onChange}
                                onBlur={props.onBlur}
                                t={t}
                              />
                              {errors.documentNo && <sup style={{ color: "red", fontSize: "x-small" }}>{errors.documentNo.message}</sup>}
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
                    <tr key={index}>
                      <td data-label={t("BMC_DOCUMENT")}>{t(row.document.i18nKey)}</td>
                      <td data-label={t("BMC_DOCUMENTNO")}>{t(row.documentNo)}</td>
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

export default DocumentCard;
