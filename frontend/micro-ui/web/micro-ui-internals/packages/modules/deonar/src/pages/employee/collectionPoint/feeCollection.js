import React, { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import MainFormHeader from "../commonFormFields/formMainHeading";
import useSubmitForm from "../../../hooks/useSubmitForm";
import { COLLECTION_POINT_ENDPOINT } from "../../../constants/apiEndpoints";
import { collectionDynamicColumns, columns, feeConfigs, createDynamicColumns, toastMessages } from "./utils";
import CustomTable from "../commonFormFields/customTable";
import TableCard from "../commonFormFields/tableCard";
import { Loader, RadioButtons, TextInput, Toast } from "@upyog/digit-ui-react-components";
import CollectionFeeCard from "../commonFormFields/collectionFeeCard";
import SubmitButtonField from "../commonFormFields/submitBtn";
import FeeConfirmationPage from "../commonFormFields/feeConfirmationPage";
import useDeonarCommon from "@upyog/digit-ui-libraries/src/hooks/deonar/useCommonDeonar";
import useCollectionPoint from "@upyog/digit-ui-libraries/src/hooks/deonar/useCollectionPoint";

const radioOptions = [
  { label: "Entry Collection Fee", value: "arrival", feeType: 1 },
  { label: "Stabling Fee", value: "stabling", feeType: 2 },
  { label: "Trading Fee", value: "trading", feeType: 9 },
  { label: "Removal Collection Fee", value: "removal", feeType: 3 },
  { label: "Slaughter Recovery Fee", value: "slaughter", feeType: 4 },
  { label: "Vehicle Washing Fee", value: "washing", feeType: 6 },
  { label: "Parking Fee", value: "parking", feeType: 7 },
  { label: "Weighing Charge", value: "weighing", feeType: 5 },
  { label: "Penalty Charge", value: "penalty", feeType: 8 },
];

const FeeCollection = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({});
  const [toast, setToast] = useState(null);
  const [defaults, setDefaults] = useState({});
  const [selectedUUID, setSelectedUUID] = useState(null);
  const [animalCount, setAnimalCount] = useState([]);
  const [stablingListData, setStablingListData] = useState([]);
  const [tradingListData, setTradingListData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [selectedRadioValue, setSelectedRadioValue] = useState(radioOptions[0].value);
  const [isConfirmationPage, setIsConfirmationPage] = useState(false);
  const [submittedData, setSubmittedData] = useState({});
  const [tableData, setTableData] = useState([]);
  const [parkingDetails, setParkingDetails] = useState([]);
  const [slaughterList, setSlaughterList] = useState([]);
  const [tableColumns, setTableColumns] = useState(collectionDynamicColumns[selectedRadioValue]);
  const [customTableColumns, setCustomTableColumns] = useState(createDynamicColumns(() => {}, selectedRadioValue));
  const [removalListData, setRemovalListData] = useState([]);
  const [penaltyListData, setPenaltyListData] = useState([]);
  const [weighingListData, setWeighingListData] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [feeCollectionResponse, setFeeCollectionResponse] = useState(null);
  const {
    control,
    setValue,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isValid },
    register,
  } = useForm({
    defaultValues: {
      paidby: "",
      // paymentMethod: "",
      transactionId: "",
      amount: "",
      slaughtertype: "",
      slaughterunit: "",
    },
    mode: "onChange",
  });

  const { submitForm, isSubmitting, response, error } = useSubmitForm(COLLECTION_POINT_ENDPOINT);

  const collectionFeeCardRef = useRef(null);

  const { fetchEntryFeeDetailsbyUUID, fetchStablingList, fetchTradingList } = useDeonarCommon();
  const {
    fetchEntryCollectionFee,
    fetchStablingCollectionFee,
    fetchWashingCollectionFee,
    fetchParkingCollectionFee,
    fetchSlaughterCollectionFee,
    fetchParkingCollectionDetails,
    saveCollectionEntryFee,
    fetchSlaughterCollectionList,
    fetchRemovalCollectionFee,
    fetchRemovalList,
    fetchTradingCollectionFee,
    fetchPenaltiesList,
    fetchweighingList,
  } = useCollectionPoint({ value: selectedRadioValue });
  // const { fetchEntryCollectionFee, fetchStablingCollectionFee } = useCollectionPoint({});
  const { data: entryData } = fetchEntryCollectionFee({ Search: { Search: selectedUUID } });
  const { data: fetchedData, isLoading } = fetchEntryFeeDetailsbyUUID({ forCollection: true });
  const { data: fetchedStablingData } = fetchStablingList({ forCollection: true });
  const { data: stablingData } = fetchStablingCollectionFee({ Search: { Search: selectedUUID } });
  const { data: parkingDetailsData } = fetchParkingCollectionDetails(
    {},
    {}, // Additional config if needed
    selectedRadioValue === "parking" // Pass the enabled condition here
  );
  const { data: SlaughterListData } = fetchSlaughterCollectionList({ forCollection: true });
  const { data: ParkingData } = fetchParkingCollectionFee({
    vehicleParking: {
      vehicleType: selectedVehicleId,
      vehicleNumber: selectedUUID,
    },
  });
  const { data: vehicleData } = fetchWashingCollectionFee({
    vehicleParking: {
      vehicleType: selectedVehicleId,
      vehicleNumber: selectedUUID,
    },
    selectedRadioValue,
  });
  const { data: slaughterData } = fetchSlaughterCollectionFee({ Search: { Search: selectedUUID } });
  const { data: removalFeeData } = fetchRemovalCollectionFee({ Search: { Search: selectedUUID } });
  const { data: RemovalListData } = fetchRemovalList({});
  const savePrakingData = Digit.Hooks.deonar.useSavePrakingDetail();
  const { data: fetchedTradingData } = fetchTradingList({ forCollection: true });
  const { data: tradingFeeData } = fetchTradingCollectionFee({ Search: { Search: selectedUUID } });
  const { data: PenaltiesData } = fetchPenaltiesList({});
  const { data: weighingData } = fetchweighingList({});

  useEffect(() => {
    setTableColumns(collectionDynamicColumns[radioOptions[0].value]);
    setCustomTableColumns(createDynamicColumns(handleUUIDClick, radioOptions[0].value));
  }, []);

  useEffect(() => {
    if (fetchedData) {
      setAnimalCount(fetchedData.SecurityCheckDetails || []);
      setTotalRecords();
    }
  }, [fetchedData]);

  useEffect(() => {
    if (fetchedStablingData) {
      setStablingListData(fetchedStablingData.SecurityCheckDetails || []);
      setTotalRecords();
    }
  }, [fetchedStablingData]);

  useEffect(() => {
    if (fetchedTradingData) {
      setTradingListData(fetchedTradingData.SecurityCheckDetails || []);
      setTotalRecords();
    }
  }, [fetchedTradingData]);

  useEffect(() => {
    if (parkingDetailsData) {
      setParkingDetails(parkingDetailsData.VehicleParkedCheckDetails || []);
      setTotalRecords();
    }
  }, [parkingDetailsData]);

  useEffect(() => {
    if (SlaughterListData) {
      setSlaughterList(SlaughterListData.slaughterLists || []);
      setTotalRecords();
    }
  }, [SlaughterListData]);

  useEffect(() => {
    if (RemovalListData) {
      setRemovalListData(RemovalListData.SecurityCheckDetails || []);
      setTotalRecords();
    }
  }, [RemovalListData]);

  useEffect(() => {
    if (PenaltiesData) {
      setPenaltyListData(PenaltiesData.PenaltyLists || []);
      setTotalRecords();
    }
  }, [PenaltiesData]);

  useEffect(() => {
    if (weighingData) {
      setWeighingListData(weighingData.slaughterLists || []);
      setTotalRecords();
    }
  }, [weighingData]);

  useEffect(() => {
    switch (selectedRadioValue) {
      case "arrival":
        setAnimalCount(animalCount);
        break;
      case "stabling":
        setStablingListData(stablingListData);
        break;
      case "trading":
        setTradingListData(tradingListData);
        break;
      case "parking":
        setParkingDetails(parkingDetails);
        break;
      case "washing":
        setParkingDetails(parkingDetails);
        break;
      case "slaughter":
        setSlaughterList(slaughterList);
        break;
      case "removal":
        return removalListData;
      case "penalty":
        return penaltyListData;
      case "weighing":
        return weighingListData;
      default:
        setAnimalCount(animalCount);
        setStablingListData(stablingListData);
        setParkingDetails(parkingDetails);
        setSlaughterList(slaughterList);
        setRemovalListData(removalListData);
        setPenaltyListData(penaltyListData);
        setWeighingListData(weighingListData);
        break;
    }
  }, [
    selectedRadioValue,
    animalCount,
    parkingDetails,
    slaughterList,
    stablingListData,
    removalListData,
    tradingListData,
    penaltyListData,
    weighingListData,
  ]);

  const getTableData = () => {
    switch (selectedRadioValue) {
      case "arrival":
        return animalCount;
      case "stabling":
        return stablingListData;
      case "trading":
        return tradingListData;
      case "parking":
        return parkingDetails;
      case "washing":
        return parkingDetails;
      case "slaughter":
        return slaughterList;
      case "removal":
        return removalListData;
      case "penalty":
        return penaltyListData;
      case "weighing":
        return weighingListData;
      default:
        return [];
    }
  };

  const handleUUIDClick = (entryUnitId, vehicleId, tableType) => {
    if (tableType === "parking" || tableType === "washing") {
      setSelectedVehicleId(vehicleId);
    } else {
      console.log("VehicleId is not available for this option.");
      setSelectedVehicleId(null);
    }
    setSelectedUUID(entryUnitId);
    setIsModalOpen(!isModalOpen);

    const updatedData = getTableData();
    setTableData(updatedData);

    if (tableType === "parking") {
      const payload = {
        vehicleParking: {
          vehicleType: vehicleId,
          vehicleNumber: entryUnitId,
          In: false,
          Out: true,
        },
      };

      savePrakingData.mutate(payload, {
        onsuccess: (data) => {
          console.log("data", data);
        },
      });
    }
  };

  useEffect(() => {
    if (selectedUUID) {
      const scrollAttempts = [100, 300, 500];
      scrollAttempts.forEach((delay) => {
        setTimeout(() => {
          const element = document.getElementById("collection-fee-section");
          if (element) {
            try {
              const yOffset = -10;
              const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

              window.scrollTo({
                top: y,
                behavior: "smooth",
              });

              console.log(`Scroll successful after ${delay}ms`);
            } catch (error) {
              console.error(`Scroll attempt failed after ${delay}ms:`, error);
            }
          } else {
            console.log(`Element not found after ${delay}ms`);
          }
        }, delay);
      });
    }
  }, [selectedUUID]);

  const fields = [
    { type: "input", label: "Amount Received", name: "amount", required: true },
    // { type: "dropdown", label: "Payment Method", name: "paymentMethod", required: true },
    {
      type: "input",
      label: "Reference Number",
      name: "transactionId",
      required: false,
    },
  ];

  const handleRadioChange = (value) => {
    setSelectedRadioValue(value);
    setIsConfirmationPage(false);
    setTableColumns(collectionDynamicColumns[value]);
    setCustomTableColumns(createDynamicColumns(handleUUIDClick, value));
    setTableData([]);
    setSelectedUUID("");
  };

  const generatePayload = (formData, selectedRadioValue, selectedUUID, tableData) => {
    const feeType = radioOptions.find((option) => option.value === selectedRadioValue)?.feeType;
    const basePayload = {
      FeeDetail: {
        uuid: selectedUUID,
        feetype: feeType,
        paidby: selectedUUID,
        method: formData.paymentMethod?.value || "Card",
        referenceno: formData.transactionId || selectedUUID,
        slaughtertype: formData.slaughterType?.value,
        slaughterunit: formData.slaughterUnit?.value,
        feevalue: tableData.length > 0 ? tableData[0].total : 0,
      },
    };

    // Add type-specific fields based on the selected radio value
    switch (selectedRadioValue) {
      case "arrival":
      case "stabling":
      case "trading":
      case "removal":
      case "slaughter":
        const matchingItems = animalCount.filter((item) => item.entryUnitId === selectedUUID);
        return {
          ...basePayload,
          FeeDetail: {
            ...basePayload.FeeDetail,
            paidby: matchingItems.length > 0 ? matchingItems[0].selectedUUID : null,
            details: tableData.map((item) => ({
              animal: item.animalType,
              count: item.animalCount,
              fee: item.animalFee,
              totalFee: item.totalFee,
            })),
          },
        };

      case "parking":
      case "washing":
        return {
          ...basePayload,
          FeeDetail: {
            ...basePayload.FeeDetail,
            vehicleParking: {
              vehicleType: selectedVehicleId,
              vehicleNumber: selectedUUID,
              parkingDate: tableData[0]?.parkingdate,
              parkingTime: tableData[0]?.parkingtime,
              departureDate: tableData[0]?.departuredate,
              departureTime: tableData[0]?.departuretime,
              totalHours: tableData[0]?.totalhours,
            },
          },
        };

      default:
        return basePayload;
    }
  };

  const onSubmit = async () => {
    if (!selectedUUID) {
      setToast({ key: "error", message: "No UUID selected" });
      return;
    }

    try {
      const payload = generatePayload(formData, selectedRadioValue, selectedUUID, tableData);
      const response = await saveCollectionEntryFee(payload);
      if (response && response?.Details && response?.ResponseInfo && response?.ResponseInfo?.status === "successful") {
        setFeeCollectionResponse(response?.Details);
        setToast({ key: "success", message: "Entry fee saved successfully!" });
        setSubmittedData(formData);
        setIsConfirmationPage(false);
        reset();
      } else {
        setToast({ key: "error", message: "An unexpected response was received." });
      }
    } catch (error) {
      console.error(`Error saving ${selectedRadioValue} fee collection:`, error);
      setToast({ key: "error", message: "An error occurred while saving the fee." });
    }
  };

  const handleFieldChange = (fieldName, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const fields1 = feeConfigs[selectedRadioValue]?.fields || [];
  const options = feeConfigs[selectedRadioValue]?.options || {};

  useEffect(() => {
    let formattedData = [];

    const formatDataBasedOnType = () => {
      if (!selectedUUID) return [];

      switch (selectedRadioValue) {
        case "arrival":
          if (entryData?.Details) {
            return entryData.Details.flatMap((item) =>
              item.details.map((detail) => ({
                animalType: detail.animal,
                animalCount: detail.count,
                animalFee: detail.fee,
                totalFee: detail.totalFee,
                total: item.total,
              }))
            );
          }
          break;

        case "stabling":
          if (stablingData?.Details) {
            return stablingData.Details.flatMap((item) =>
              item.details.map((detail) => ({
                animalType: detail.animal,
                animalCount: detail.count,
                animalFee: detail.fee,
                totalFee: detail.totalFee,
                total: item.total,
              }))
            );
          }
          break;
        case "washing":
          if (vehicleData) {
            const washingData = vehicleData?.VehicleVehicleWashingFeesResponse;
            if (washingData && typeof washingData === "object") {
              return [
                {
                  vehiclenumber: washingData.vehicleNumber,
                  vehicletype: washingData.vehicleType,
                  total: washingData.washingFee,
                },
              ];
            }
          }
          break;

        case "parking":
          if (ParkingData) {
            return ParkingData.vehicleParkingFeeResponseDetails.map((data) => {
              const matchingParkingDetail = parkingDetails.find((detail) => detail.vehicleNumber === data.vehicleNumber);
              const now = new Date();
              const currentDate = now.toISOString().split("T")[0];
              const currentTime = now.toTimeString().split(" ")[0];
              const calculateHours = (parkingDate, parkingTime, departureDate, departureTime) => {
                if (!parkingDate || !parkingTime) return 0;
                const parkingDateTime = new Date(`${parkingDate}T${parkingTime}`);
                const departureDateTime = new Date(`${departureDate}T${departureTime}`);
                const diffMs = departureDateTime - parkingDateTime;
                const hours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
                return hours > 0 ? hours : 0;
              };
              const totalHours = calculateHours(matchingParkingDetail?.parkingDate, matchingParkingDetail?.parkingTime, currentDate, currentTime);
              return {
                vehiclenumber: data.vehicleNumber,
                vehicletype: data.vehicleType,
                parkingdate: matchingParkingDetail?.parkingDate || data.parkingdate,
                parkingtime: matchingParkingDetail?.parkingTime || data.parkingtime,
                departuredate: currentDate,
                departuretime: currentTime,
                totalhours: totalHours || data.totalhours,
                total: data.parkingFee,
              };
            });
          }
          break;

        case "slaughter":
          if (slaughterData?.Details) {
            return slaughterData?.Details?.flatMap((item) =>
              item?.details?.map((detail) => ({
                animalType: detail?.animal,
                animalCount: detail?.count,
                animalFee: detail?.fee,
                totalFee: detail?.totalFee,
                total: item?.total,
              }))
            );
          }
          break;

        case "removal":
          if (removalFeeData?.Details) {
            return removalFeeData?.Details.flatMap((item) =>
              item?.details?.map((detail) => ({
                animalType: detail?.animal,
                animalCount: detail?.count,
                animalFee: detail?.fee,
                totalFee: detail?.totalFee,
                total: item?.total,
              }))
            );
          }
          break;

        case "trading":
          if (tradingFeeData?.Details) {
            return tradingFeeData?.Details.flatMap((item) =>
              item?.details?.map((detail) => ({
                animalType: detail?.animal,
                animalCount: detail?.count,
                animalFee: detail?.fee,
                totalFee: detail?.totalFee,
                total: item?.total,
              }))
            );
          }
          break;

        case "penalty":
          if (PenaltiesData?.PenaltyLists) {
            const selectedPenalty = selectedUUID;
            const selectedPenalties = PenaltiesData?.PenaltyLists?.filter((item) => item.penaltyReference === selectedPenalty).map((value) => ({
              total: value.total,
              unit: value.unit === null ? 1 : value.unit,
            }));
            return selectedPenalties;
          }
          break;

        default:
          return [];
      }
      return [];
    };
    formattedData = formatDataBasedOnType();
    setTableData(formattedData);
  }, [
    entryData,
    vehicleData,
    ParkingData,
    selectedRadioValue,
    slaughterData,
    selectedUUID,
    stablingData,
    removalFeeData,
    tradingFeeData,
    PenaltiesData,
  ]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <React.Fragment>
      <div className="bmc-card-full">
        <form onSubmit={handleSubmit(onSubmit)}>
          <MainFormHeader title={"FEE_COLLECTION"} />
          <div className="bmc-card-row">
            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{ display: "flex", gap: "10px", padding: "0 1px", flexDirection: "column", width: "30%" }}>
                <div className="bmc-col-small-header" style={{ width: "100%" }}>
                  <div
                    id="collection-fee-section"
                    className="bmc-row-card-header"
                    ref={collectionFeeCardRef}
                    // Add scroll-margin-top to account for fixed headers
                    style={{
                      scrollMarginTop: "100px",
                      position: "relative", // Ensure proper positioning
                    }}
                  >
                    <div className="bmc-card-row">
                      <h3 className="bmc-title">Collection Point</h3>
                      <RadioButtons
                        t={t}
                        label="Collection Point"
                        options={radioOptions.map((type) => type.label)}
                        selectedOption={radioOptions.find((option) => option.value === selectedRadioValue)?.label}
                        onSelect={(label) => handleRadioChange(radioOptions.find((option) => option.label === label)?.value)}
                        style={{ display: "flex", marginTop: "10px", flexDirection: "column" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bmc-row-card-header" style={{ width: "70%" }}>
                {isMobileView &&
                  animalCount.map((data, index) => <TableCard data={data} key={index} fields={fields} onUUIDClick={handleUUIDClick} />)}
                <CustomTable
                  t={t}
                  columns={customTableColumns}
                  data={getTableData()}
                  tableClassName={"ebe-custom-scroll"}
                  manualPagination={false}
                  totalRecords={totalRecords}
                  sortBy={["entryUnitId:asc"]}
                  autoSort={false}
                  isLoadingRows={isLoading}
                />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", float: "inline-end", width: "100%" }}>
            <div className="bmc-col-large-header" style={{ width: "100%" }}>
              <div className="bmc-row-card-header">
                {selectedUUID ? (
                  <>
                    <div style={{ paddingBottom: "20px", display: "flex", gap: "12px", alignItems: "center" }}>
                      <h3 style={{ fontWeight: "600", fontSize: "20px" }}>Active Arrival UUID: </h3>
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
                    {fields1.length > 0 && (
                      <>
                        <CollectionFeeCard
                          label={`${radioOptions.find((option) => option.value === selectedRadioValue)?.label} Details`}
                          fields={feeConfigs[selectedRadioValue].fields}
                          options={feeConfigs[selectedRadioValue].options}
                          control={control}
                          allowEdit={true}
                          Tablecolumns={tableColumns}
                          isLoading={isLoading}
                          showTable={true}
                          tableData={tableData}
                          onFieldChange={handleFieldChange}
                        />
                        <div style={{ paddingBottom: "20px", display: "flex", gap: "12px", alignItems: "center", padding: "0 16px" }}>
                          <div></div>
                          <h3 style={{ fontWeight: "600", fontSize: "20px" }}>Total Amount Payable : </h3>
                          <span
                            style={{
                              fontWeight: "bold",
                              backgroundColor: "rgb(204, 204, 204)",
                              borderRadius: "10px",
                              padding: "8px",
                              display: "flex",
                              gap: "10px",
                              fontSize: "22px",
                            }}
                          >
                            <div>₹</div>
                            <div>{tableData.length > 0 ? tableData[0].total : 0}</div>
                          </span>
                          {selectedUUID && <SubmitButtonField control={control} />}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="no-uuid-message">
                    <p style={{ fontSize: "20px" }}>{t("Please select an Deonar arrival ID for payment purpose")}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="bmc-col-large-header" style={{ width: "100%" }}>
              <div className="bmc-row-card-header">
                {selectedUUID ? (
                  !isConfirmationPage && (
                    <div style={{ flex: 1, paddingLeft: "20px" }}>
                      <FeeConfirmationPage
                        label={`${radioOptions.find((option) => option.value === selectedRadioValue)?.label} Confirmation`}
                        // fields={fields}
                        values={submittedData}
                        options={options}
                        Tablecolumns={tableColumns}
                        isLoading={isLoading}
                        showTable={true}
                        tableData={tableData}
                        feeCollectionResponse={feeCollectionResponse}
                      />
                    </div>
                  )
                ) : (
                  <div className="no-uuid-message">
                    <p style={{ fontSize: "20px" }}>{t("Please select an Deonar arrival ID to view fee confirmation")}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
      {toast && <Toast error={toast.key === "error"} label={t(toast.message)} onClose={() => setToast(null)} style={{ maxWidth: "670px" }} />}
    </React.Fragment>
  );
};

export default FeeCollection;
