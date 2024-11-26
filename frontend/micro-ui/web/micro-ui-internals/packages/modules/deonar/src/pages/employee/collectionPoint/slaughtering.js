// import React, { Fragment, useEffect, useMemo, useState } from "react";
// import { useTranslation } from "react-i18next";
// import { useForm } from "react-hook-form";
// import MainFormHeader from "../commonFormFields/formMainHeading";
// import useSubmitForm from "../../../hooks/useSubmitForm";
// import { COLLECTION_POINT_ENDPOINT } from "../../../constants/apiEndpoints";
// import CustomTable from "../commonFormFields/customTable";
// import TableCard from "../commonFormFields/tableCard";
// import { Toast } from "@upyog/digit-ui-react-components";
// import useCollectionPoint from "@upyog/digit-ui-libraries/src/hooks/deonar/useCollectionPoint";

// const Slaughtering = () => {
//   const { t } = useTranslation();

//   const [defaults, setDefaults] = useState({});
//   const [selectedUUID, setSelectedUUID] = useState();
//   const [slaughterList, setSlaughterList] = useState([]);
//   const [slaughterAnimalListData, setSlaughterAnimalListData] = useState([]);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
//   const [toast, setToast] = useState(null);

//   const {
//     control,
//     setValue,
//     handleSubmit,
//     getValues,
//     formState: { errors, isValid },
//   } = useForm({ defaultValues: defaults, mode: "onChange" });

//   const { submitForm, isSubmitting, response, error } = useSubmitForm(COLLECTION_POINT_ENDPOINT);

//   const { fetchSlaughterCollectionList } = useCollectionPoint({});
//   const { data: SlaughterListData } = fetchSlaughterCollectionList({});

//   useEffect(() => {
//     if (SlaughterListData) {
//       setSlaughterList(SlaughterListData.slaughterLists);
//       setTotalRecords();
//     }
//   }, [SlaughterListData]);

//   const handleUUIDClick = (entryUnitId) => {
//     setSelectedUUID(entryUnitId);
//     setIsModalOpen(!isModalOpen);
//   };

//   const fields = [
//     { key: "ddReference", label: "Arrival UUID", isClickable: true },
//     { key: "traderName", label: "Trader Name" },
//     { key: "licenceNumber", label: "License Number" },
//     { key: "vehicleNumber", label: "Vehicle Number" },
//     { key: "dateOfArrival", label: "Arrival Date" },
//     { key: "timeOfArrival", label: "Arrival Time" },
//   ];

//   useEffect(() => {
//     if (toast) {
//       const timer = setTimeout(() => {
//         setToast(null);
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [toast]);

//   const Tablecolumns = [
//     {
//       Header: "ID",
//       accessor: "id",
//       Cell: ({ row }) => row.index + 1,
//       getHeaderProps: (column) => ({
//         style: {
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         },
//       }),
//       isVisible: false,
//     },
//     {
//       Header: "Deonar_DD_Reference",
//       accessor: "ddReference",
//       Cell: ({ row }) => (
//         <span onClick={() => handleUUIDClick(row.original.ddReference)} style={{ cursor: "pointer", color: "blue" }}>
//           {row.original.ddReference}
//         </span>
//       ),
//     },
//     {
//       Header: "Deonar_Arrival_Id",
//       accessor: "arrivalId",
//     },
//     {
//       Header: "DEONAR_SHOPKEEPER_NAME",
//       accessor: "shopkeeperName",
//     },
//     {
//       Header: "DEONAR_LICENSE_NUMBER",
//       accessor: "licenceNumber",
//     },
//   ];

//   const tableColumnsAnimal = [
//     {
//       Header: "Animal",
//       accessor: "animalType",
//       disableSortBy: true,
//     },
//     {
//       Header: "Animal Count",
//       accessor: "count",
//       disableSortBy: true,
//     },
//   ];

//   return (
//     <React.Fragment>
//       <div className="bmc-card-full">
//         <form>
//           <MainFormHeader title={"DEONAR_SLAUGHTERING"} />
//           <div className="bmc-card-row">
//             <div className="bmc-row-card-header">
//               {isMobileView &&
//                 slaughterList.map((data, index) => <TableCard data={data} key={index} fields={fields} onUUIDClick={handleUUIDClick} />)}
//               <CustomTable
//                 t={t}
//                 columns={Tablecolumns}
//                 data={slaughterList}
//                 manualPagination={false}
//                 tableClassName={"deonar-scrollable-table"}
//                 totalRecords={totalRecords}
//                 autoSort={false}
//                 // isLoadingRows={isLoading}
//               />
//             </div>
//           </div>
//         </form>
//         {selectedUUID && (
//           <div className="bmc-row-card-header">
//             <div style={{ paddingBottom: "20px", display: "flex", gap: "12px", alignItems: "center" }}>
//               <h3 style={{ fontWeight: "600", fontSize: "20px" }}>{t("ACTIVE_DD_REFERENCENO")}: </h3>
//               <span
//                 style={{
//                   fontWeight: "bold",
//                   backgroundColor: "rgb(204, 204, 204)",
//                   borderRadius: "10px",
//                   padding: "8px",
//                   fontSize: "22px",
//                 }}
//               >
//                 {selectedUUID}
//               </span>
//             </div>
//             <CustomTable
//               t={t}
//               columns={tableColumnsAnimal}
//               data={slaughterAnimalListData}
//               manualPagination={false}
//               tableClassName={"deonar-scrollable-table"}
//             />
//           </div>
//         )}
//       </div>

//       {toast && (
//         <Toast
//           error={toast.key === "error"}
//           label={t(toast.key === "success" ? "SLAUGHTERING_DATA_SAVED_SUCCESSFULLY" : toast.action)}
//           onClose={() => setToast(null)}
//           style={{ maxWidth: "670px" }}
//         />
//       )}
//     </React.Fragment>
//   );
// };

// export default Slaughtering;

// import React, { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import MainFormHeader from "../commonFormFields/formMainHeading";
// import CustomTable from "../commonFormFields/customTable";
// import TableCard from "../commonFormFields/tableCard";
// import { CardLabel, LabelFieldPair, TextInput, Toast, Dropdown } from "@upyog/digit-ui-react-components";
// import { Controller, useForm } from "react-hook-form";
// import useCollectionPoint from "@upyog/digit-ui-libraries/src/hooks/deonar/useCollectionPoint";
// import SubmitButtonField from "../commonFormFields/submitBtn";

// const Slaughtering = () => {
//   const { t } = useTranslation();
//   const [slaughterList, setSlaughterList] = useState([]);
//   const [slaughterAnimalListData, setSlaughterAnimalListData] = useState([]);
//   const [selectedUUID, setSelectedUUID] = useState(null);
//   const [toast, setToast] = useState(null);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
//   const [typeOfPenalty, setTypeOfPenalty] = useState([
//     { code: "1", name: "YES" },
//     { code: "2", name: "NO" },
//     { code: "3", name: "NAN" },
//   ]);
//   const {
//     control,
//     setValue,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       animalType: "",
//       token: "",
//       typeOfPenalty: "",
//     },
//   });
//   const { fetchSlaughterCollectionList } = useCollectionPoint({});
//   const { data: SlaughterListData } = fetchSlaughterCollectionList({});

//   // const handleUUIDClick = (ddReference) => {
//   //   setSelectedUUID(ddReference);
//   //   const selectedSlaughter = slaughterList.find((item) => item.ddReference === ddReference);
//   //   if (selectedSlaughter && selectedSlaughter.animalAssignmentDetailsList) {
//   //     setSlaughterAnimalListData(selectedSlaughter.animalAssignmentDetailsList);
//   //   }
//   // };

//   const handleUUIDClick = (ddReference) => {
//     setSelectedUUID(ddReference);
//     const selectedSlaughter = slaughterList.find((item) => item.ddReference === ddReference);
//     if (selectedSlaughter) {
//       setValue("arrivalId", selectedSlaughter.arrivalId);
//       setValue("animalType", selectedSlaughter.animalAssignmentDetailsList?.animalType || "");
//       setValue("token", selectedSlaughter.animalAssignmentDetailsList?.token || "");
//       setValue("typeOfPenalty", selectedSlaughter.animalAssignmentDetailsList?.typeOfPenalty || "");
//       setSlaughterAnimalListData(selectedSlaughter.animalAssignmentDetailsList || []);
//     }
//   };

//   const Tablecolumns = [
//     {
//       Header: "ID",
//       accessor: "id",
//       Cell: ({ row }) => row.index + 1,
//       isVisible: false,
//     },
//     {
//       Header: "Deonar_DD_Reference",
//       accessor: "ddReference",
//       Cell: ({ row }) => (
//         <span onClick={() => handleUUIDClick(row.original.ddReference)} style={{ cursor: "pointer", color: "blue" }}>
//           {row.original.ddReference}
//         </span>
//       ),
//     },
//     {
//       Header: "Deonar_Arrival_Id",
//       accessor: "arrivalId",
//     },
//     {
//       Header: "DEONAR_SHOPKEEPER_NAME",
//       accessor: "shopkeeperName",
//     },
//     {
//       Header: "DEONAR_LICENSE_NUMBER",
//       accessor: "licenceNumber",
//     },
//   ];

//   const tableColumnsAnimal = [
//     {
//       Header: "Animal Type",
//       accessor: "animalType",
//       disableSortBy: true,
//     },
//     {
//       Header: "Token",
//       accessor: "token",
//       disableSortBy: true,
//     },
//   ];

//   useEffect(() => {
//     setTypeOfPenalty(typeOfPenalty.map((item) => ({ name: item.name })));
//   }, []);

//   useEffect(() => {
//     if (SlaughterListData) {
//       setSlaughterList(SlaughterListData.slaughterLists);
//       setTotalRecords(SlaughterListData.slaughterLists.length);
//     }
//   }, [SlaughterListData]);

//   const onSubmit = async () => {};

//   useEffect(() => {
//     if (toast) {
//       const timer = setTimeout(() => setToast(null), 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [toast]);

//   return (
//     <React.Fragment>
//       <div className="bmc-card-full">
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <MainFormHeader title={"DEONAR_SLAUGHTERING"} />
//           <div className="bmc-card-row">
//             <div className="bmc-row-card-header">
//               {isMobileView &&
//                 slaughterList.map((data, index) => (
//                   <TableCard
//                     data={data}
//                     key={index}
//                     fields={[
//                       { key: "ddReference", label: "Arrival UUID", isClickable: true },
//                       { key: "shopkeeperName", label: "Trader Name" },
//                       { key: "licenceNumber", label: "License Number" },
//                       { key: "arrivalId", label: "Arrival Id" },
//                     ]}
//                     onUUIDClick={handleUUIDClick}
//                   />
//                 ))}
//               <CustomTable
//                 t={t}
//                 columns={Tablecolumns}
//                 data={slaughterList}
//                 manualPagination={false}
//                 tableClassName={"deonar-scrollable-table"}
//                 totalRecords={totalRecords}
//                 autoSort={false}
//               />
//             </div>
//           </div>

//           {selectedUUID && (
//             <div className="bmc-row-card-header">
//               <div style={{ paddingBottom: "20px", display: "flex", gap: "12px", alignItems: "center" }}>
//                 <h3 style={{ fontWeight: "600", fontSize: "20px" }}>{t("ACTIVE_DD_REFERENCENO")}: </h3>
//                 <span
//                   style={{
//                     fontWeight: "bold",
//                     backgroundColor: "rgb(204, 204, 204)",
//                     borderRadius: "10px",
//                     padding: "8px",
//                     fontSize: "22px",
//                   }}
//                 >
//                   {selectedUUID}
//                 </span>
//               </div>
//               <div className="bmc-row-card">
//                 <div className="bmc-col3-card">
//                   <LabelFieldPair>
//                     <CardLabel className="bmc-label">{t("DEONAR_ANIMAL_TYPE")}</CardLabel>
//                     <Controller
//                       control={control}
//                       name="animalType"
//                       rules={{ required: t("CORE_COMMON_REQUIRED_ERRMSG") }}
//                       render={(props) => (
//                         <div>
//                           <TextInput
//                             onChange={(e) => {
//                               props.onChange(e.target.value);
//                             }}
//                             onBlur={props.onBlur}
//                             optionKey="name"
//                             t={t}
//                             defaultValue={slaughterAnimalListData?.[0]?.animalType || ""}
//                             placeholder={t("DEONAR_ANIMAL_TYPE")}
//                           />
//                         </div>
//                       )}
//                     />
//                   </LabelFieldPair>
//                 </div>
//                 <div className="bmc-col3-card">
//                   <LabelFieldPair>
//                     <CardLabel className="bmc-label">{t("DEONAR_Token")}</CardLabel>
//                     <Controller
//                       control={control}
//                       name="token"
//                       rules={{ required: t("CORE_COMMON_REQUIRED_ERRMSG") }}
//                       render={(props) => (
//                         <div>
//                           <TextInput
//                             onChange={(e) => {
//                               props.onChange(e.target.value);
//                             }}
//                             onBlur={props.onBlur}
//                             optionKey="name"
//                             t={t}
//                             defaultValue={slaughterAnimalListData?.[0]?.token || ""}
//                             placeholder={t("DEONAR_Token")}
//                           />
//                         </div>
//                       )}
//                     />
//                   </LabelFieldPair>
//                 </div>
//                 <div className="bmc-col3-card">
//                   <LabelFieldPair>
//                     <CardLabel className="bmc-label">{t("DEONAR_Slaughter")}</CardLabel>
//                     <Controller
//                       control={control}
//                       name="slaughter"
//                       render={(props) => (
//                         <Dropdown
//                           value={props.value}
//                           selected={props.value}
//                           select={(value) => {
//                             props.onChange(value);
//                           }}
//                           onBlur={props.onBlur}
//                           optionKey="name"
//                           option={typeOfPenalty}
//                           placeholder={t("DEONAR_Slaughter")}
//                           t={t}
//                         />
//                       )}
//                     />
//                   </LabelFieldPair>
//                 </div>
//                 <SubmitButtonField control={control} />
//               </div>
//               <div className="bmc-card-row">
//                 <CustomTable
//                   t={t}
//                   columns={tableColumnsAnimal}
//                   data={slaughterAnimalListData}
//                   manualPagination={false}
//                   tableClassName={"deonar-scrollable-table"}
//                 />
//               </div>
//             </div>
//           )}
//         </form>
//       </div>

//       {toast && (
//         <Toast
//           error={toast.key === "error"}
//           label={t(toast.key === "success" ? "SLAUGHTERING_DATA_SAVED_SUCCESSFULLY" : toast.action)}
//           onClose={() => setToast(null)}
//           style={{ maxWidth: "670px" }}
//         />
//       )}
//     </React.Fragment>
//   );
// };

// export default Slaughtering;

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import MainFormHeader from "../commonFormFields/formMainHeading";
import CustomTable from "../commonFormFields/customTable";
import TableCard from "../commonFormFields/tableCard";
import { CardLabel, LabelFieldPair, TextInput, Toast, Dropdown } from "@upyog/digit-ui-react-components";
import { Controller, useForm } from "react-hook-form";
import useCollectionPoint from "@upyog/digit-ui-libraries/src/hooks/deonar/useCollectionPoint";
import SubmitButtonField from "../commonFormFields/submitBtn";
import HealthStatDropdownField from "../commonFormFields/healthStatDropdown";
import { slaughterType, slaughterUnit } from "../../../constants/dummyData";

const Slaughtering = () => {
  const { t } = useTranslation();
  const [slaughterList, setSlaughterList] = useState([]);
  const [slaughterAnimalListData, setSlaughterAnimalListData] = useState([]);
  const [selectedUUID, setSelectedUUID] = useState(null);
  const [toast, setToast] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [slaughtering, setSlaughtering] = useState([
    { code: "1", name: "YES" },
    { code: "2", name: "NO" },
  ]);
  const [data, setData] = useState({});
  const [slaughterTypeOptions, setSlaughterTypeOptions] = useState([]);
  const [slaughterUnitOptions, setSlaughterUnitOptions] = useState([]);

  const {
    control,
    setValue,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      slaughter: "",
      slaughterType: {},
      slaughterUnit: {},
    },
  });

  const { fetchSlaughterCollectionList } = useCollectionPoint({});
  const { data: SlaughterListData } = fetchSlaughterCollectionList({});

  const handleUUIDClick = (ddReference) => {
    setSelectedUUID(ddReference);
    const selectedSlaughter = slaughterList.find((item) => item.ddReference === ddReference);
    if (selectedSlaughter) {
      setValue("arrivalId", selectedSlaughter.arrivalId);
      setValue("animalType", selectedSlaughter.animalAssignmentDetailsList?.animalType || "");
      setValue("token", selectedSlaughter.animalAssignmentDetailsList?.token || "");
      setValue("slaughter", selectedSlaughter.animalAssignmentDetailsList?.slaughtering || "");
      setSlaughterAnimalListData(selectedSlaughter.animalAssignmentDetailsList || []);
    }
  };

  useEffect(() => {
    setSlaughterTypeOptions(slaughterType.map((item) => ({ name: item.name })));
    setSlaughterUnitOptions(slaughterUnit.map((item) => ({ name: item.name })));
  }, []);

  const onSubmit = async (formData) => {
    console.log("Slaughter Animal List Data:", slaughterAnimalListData);
    const payload = {
      animalType: slaughterAnimalListData?.[0]?.animalType,
      token: slaughterAnimalListData?.[0]?.token,
      slaughtering: formData?.slaughtering.name,
      slaughterUnit: formData?.slaughterUnit.name,
      slaughterType: formData?.slaughterType.name,
    };
    console.log("Payload for save:", payload);
  };

  useEffect(() => {
    if (SlaughterListData) {
      setSlaughterList(SlaughterListData.slaughterLists);
      setTotalRecords(SlaughterListData.slaughterLists.length);
    }
  }, [SlaughterListData]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const Tablecolumns = [
    {
      Header: "ID",
      accessor: "id",
      Cell: ({ row }) => row.index + 1,
      isVisible: false,
    },
    {
      Header: "Deonar_DD_Reference",
      accessor: "ddReference",
      Cell: ({ row }) => (
        <span onClick={() => handleUUIDClick(row.original.ddReference)} style={{ cursor: "pointer", color: "blue" }}>
          {row.original.ddReference}
        </span>
      ),
    },
    {
      Header: "Deonar_Arrival_Id",
      accessor: "arrivalId",
    },
    {
      Header: "DEONAR_SHOPKEEPER_NAME",
      accessor: "shopkeeperName",
    },
    {
      Header: "DEONAR_LICENSE_NUMBER",
      accessor: "licenceNumber",
    },
  ];

  const tableColumnsAnimal = [
    {
      Header: "Animal Type",
      accessor: "animalType",
      disableSortBy: true,
    },
    {
      Header: "Token",
      accessor: "token",
      disableSortBy: true,
    },
  ];

  return (
    <React.Fragment>
      <div className="bmc-card-full">
        <form onSubmit={handleSubmit(onSubmit)}>
          <MainFormHeader title={"DEONAR_SLAUGHTERING"} />
          <div className="bmc-card-row">
            <div className="bmc-row-card-header">
              {isMobileView &&
                slaughterList.map((data, index) => (
                  <TableCard
                    data={data}
                    key={index}
                    fields={[
                      { key: "ddReference", label: "Arrival UUID", isClickable: true },
                      { key: "shopkeeperName", label: "Trader Name" },
                      { key: "licenceNumber", label: "License Number" },
                      { key: "arrivalId", label: "Arrival Id" },
                    ]}
                    onUUIDClick={handleUUIDClick}
                  />
                ))}
              <CustomTable
                t={t}
                columns={Tablecolumns}
                data={slaughterList}
                manualPagination={false}
                tableClassName={"deonar-scrollable-table"}
                totalRecords={totalRecords}
                autoSort={false}
              />
            </div>
          </div>

          {selectedUUID && (
            <div className="bmc-row-card-header">
              <div style={{ paddingBottom: "20px", display: "flex", gap: "12px", alignItems: "center" }}>
                <h3 style={{ fontWeight: "600", fontSize: "20px" }}>{t("ACTIVE_DD_REFERENCENO")}: </h3>
                <span
                  style={{
                    fontWeight: "bold",
                    backgroundColor: "rgb(204, 204, 204)",
                    borderRadius: "10px",
                    padding: "8px",
                    fontSize: "22px",
                  }}
                >
                  {selectedUUID}
                </span>
              </div>
              <div className="bmc-card-row">
                <CustomTable
                  t={t}
                  columns={tableColumnsAnimal}
                  data={slaughterAnimalListData}
                  manualPagination={false}
                  tableClassName={"deonar-scrollable-table"}
                />
              </div>
              <div className="bmc-row-card">
                {/* <div className="bmc-col3-card">
                  <LabelFieldPair>
                    <CardLabel className="bmc-label">{t("DEONAR_ANIMAL_TYPE")}</CardLabel>
                    <Controller
                      control={control}
                      name="animalType"
                      rules={{ required: t("CORE_COMMON_REQUIRED_ERRMSG") }}
                      render={(props) => (
                        <div>
                          <TextInput
                            onChange={(e) => {
                              props.onChange(e.target.value);
                            }}
                            onBlur={props.onBlur}
                            optionKey="name"
                            t={t}
                            defaultValue={slaughterAnimalListData?.[0]?.animalType || ""}
                            placeholder={t("DEONAR_ANIMAL_TYPE")}
                          />
                        </div>
                      )}
                    />
                  </LabelFieldPair>
                </div>
                <div className="bmc-col3-card">
                  <LabelFieldPair>
                    <CardLabel className="bmc-label">{t("DEONAR_Token")}</CardLabel>
                    <Controller
                      control={control}
                      name="token"
                      rules={{ required: t("CORE_COMMON_REQUIRED_ERRMSG") }}
                      render={(props) => (
                        <div>
                          <TextInput
                            onChange={(e) => {
                              props.onChange(e.target.value);
                            }}
                            onBlur={props.onBlur}
                            optionKey="name"
                            t={t}
                            defaultValue={slaughterAnimalListData?.[0]?.token || ""}
                            placeholder={t("DEONAR_Token")}
                          />
                        </div>
                      )}
                    />
                  </LabelFieldPair>
                </div> */}
                <HealthStatDropdownField
                  name="slaughterType"
                  label="DEONAR_SLAUGHTER_TYPE"
                  control={control}
                  data={data}
                  setData={setData}
                  options={slaughterTypeOptions}
                />
                <HealthStatDropdownField
                  name="slaughterUnit"
                  label="DEONAR_SLAUGHTER_UNIT"
                  control={control}
                  data={data}
                  setData={setData}
                  options={slaughterUnitOptions}
                />
                <div className="bmc-col3-card">
                  <LabelFieldPair>
                    <CardLabel className="bmc-label">{t("DEONAR_Slaughter")}</CardLabel>
                    <Controller
                      control={control}
                      name="slaughtering"
                      render={(props) => (
                        <Dropdown
                          value={props.value}
                          selected={props.value}
                          select={(value) => {
                            props.onChange(value);
                          }}
                          onBlur={props.onBlur}
                          optionKey="name"
                          option={slaughtering}
                          placeholder={t("DEONAR_Slaughter")}
                          t={t}
                        />
                      )}
                    />
                  </LabelFieldPair>
                </div>
                <SubmitButtonField control={control} />
              </div>
            </div>
          )}
        </form>
      </div>
    </React.Fragment>
  );
};

export default Slaughtering;
