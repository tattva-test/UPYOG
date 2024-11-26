// import React, { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import { CardLabel, LabelFieldPair, TextInput } from "@upyog/digit-ui-react-components";
// import { Controller } from "react-hook-form";

// const VehicleNumberField = ({ control, data, setData, style }) => {
//   const { t } = useTranslation();
//   const [error, setError] = useState("");

//   const validateVehicleNumber = (value) => {
//     const regex = /^[A-Z]{2}\s\d{2}\s\d{4}$/; // Format: UP 70 1234
//     if (!regex.test(value)) {
//       return t("CORE_COMMON_REQUIRED_ERRMSG"); // Return custom error message if format is invalid
//     }
//     return true; // Return true if validation is successful
//   };

//   useEffect(() => {
//     if (!data.vehicleNumber) {
//       setError(t("CORE_COMMON_REQUIRED_ERRMSG"));
//     }
//   }, [data]);

//   return (
//     <div className="bmc-col3-card" style={style}>
//       <LabelFieldPair>
//         <CardLabel className="bmc-label">
//           {t("DEONAR_VEHICLE_NUMBER")}&nbsp;{error && <sup style={{ color: "red", fontSize: "x-small" }}>{error}</sup>}
//         </CardLabel>
//         <Controller
//           control={control}
//           name="vehicleNumber"
//           rules={{ required: t("CORE_COMMON_REQUIRED_ERRMSG") }} // Required field validation
//           render={(props) => (
//             <div>
//               <TextInput
//                 value={props.value}
//                 onChange={props.onChange}
//                 onBlur={props.onBlur}
//                 optionKey="i18nKey"
//                 t={t}
//                 placeholder={t("MH_70_1234")}
//               />
//             </div>
//           )}
//         />
//       </LabelFieldPair>
//     </div>
//   );
// };

// export default VehicleNumberField;
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CardLabel, LabelFieldPair, TextInput } from "@upyog/digit-ui-react-components";
import { Controller } from "react-hook-form";

const VehicleNumberField = ({ control, data, setData, style }) => {
  const { t } = useTranslation();
  const [error, setError] = useState("");

  const validateVehicleNumber = (value) => {
    const regex = /^[A-Z]{2}-\d{2}-[A-Z]{2}-\d{4}$/; // Format: MH-01-AB-1111
    if (!regex.test(value)) {
      return t("CORE_COMMON_REQUIRED_ERRMSG"); // Custom error message if format is invalid
    }
    return true; // Return true if validation is successful
  };

  useEffect(() => {
    if (!data.vehicleNumber) {
      setError(t("CORE_COMMON_REQUIRED_ERRMSG"));
    } else {
      const validationResult = validateVehicleNumber(data.vehicleNumber);
      setError(validationResult === true ? "" : validationResult);
    }
  }, [data, t]);

  const formatVehicleNumber = (value) => {
    const cleanValue = value.replace(/[^A-Z0-9]/gi, "").toUpperCase();
    const parts = [];

    if (cleanValue.length > 0) parts.push(cleanValue.slice(0, 2)); // State Code
    if (cleanValue.length > 2) parts.push(cleanValue.slice(2, 4)); // District Code
    if (cleanValue.length > 4) parts.push(cleanValue.slice(4, 6)); // Series
    if (cleanValue.length > 6) parts.push(cleanValue.slice(6, 10)); // Number

    return parts.join("-");
  };

  return (
    <div className="bmc-col2-card" style={style}>
      <LabelFieldPair>
        <CardLabel className="bmc-label">
          {t("DEONAR_VEHICLE_NUMBER")}&nbsp;{error && <sup style={{ color: "red", fontSize: "x-small" }}>{error}</sup>}
        </CardLabel>
        <Controller
          control={control}
          name="vehicleNumber"
          rules={{
            required: t("CORE_COMMON_REQUIRED_ERRMSG"),
            validate: validateVehicleNumber,
          }}
          render={(props) => (
            <div>
              <TextInput
                value={formatVehicleNumber(props.value)}
                onChange={(e) => props.onChange(formatVehicleNumber(e.target.value))}
                onBlur={props.onBlur}
                optionKey="i18nKey"
                t={t}
                placeholder={t("MH-01-AB-1111")}
              />
            </div>
          )}
        />
      </LabelFieldPair>
    </div>
  );
};

export default VehicleNumberField;
