import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { CardLabel, Dropdown, LabelFieldPair, TextInput, DatePicker } from "@upyog/digit-ui-react-components";
import { Controller, useForm } from "react-hook-form";

const VeterinaryOfficerField = () => {
  const { t } = useTranslation();

  const {
    control,
    setValue,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm({ defaultValues: {}, mode: "onChange" });

  return (
    <div className="bmc-col3-card">
        <LabelFieldPair>
            <CardLabel className="bmc-label">{t("VETERINARY_OFFICER_NAME")}</CardLabel>
            <Controller
                control={control}
                name="veterinaryOfficerName"
                rules={{ required: t("CORE_COMMON_REQUIRED_ERRMSG") }}
                render={({ value, onChange, onBlur }) => (
                    <div>
                    <Dropdown
                        value={value}
                        name="veterinaryOfficerName"
                        selected={value}
                        select={(value) => onChange(value)}
                        onBlur={onBlur}
                        optionKey="value"
                        t={t}
                        placeholder={t("VETERINARY_OFFICER_NAME")}
                    />
                    </div>
                )}
            />
        </LabelFieldPair>
    </div>
  );
};

export default VeterinaryOfficerField;
