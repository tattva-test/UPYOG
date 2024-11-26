import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import MainFormHeader from "../commonFormFields/formMainHeading";
import { Toast, Loader } from "@upyog/digit-ui-react-components";
import CustomTable from "../commonFormFields/customTable";
import CustomModal from "../commonFormFields/customModal";
import useCollectionPoint from "@upyog/digit-ui-libraries/src/hooks/deonar/useCollectionPoint";
import VehicleNumberField from "../commonFormFields/vehicleNumber";
import VehicleTypeDropdownField from "../commonFormFields/vehicleTypeDropdown";

const ParkingFeePage = () => {
  const { t } = useTranslation();
  const [data, setData] = useState();
  const [parkingStatus, setParkingStatus] = useState(false);
  const [toast, setToast] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [disabledRows, setDisabledRows] = useState([]);
  const [responseData, setResponseData] = useState();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      vehicleType: "",
      vehicleNumber: "",
    },
    mode: "onChange",
  });

  const openModal = (vehicleData, status) => {
    setData({
      vehicleNumber: vehicleData.vehicleNumber,
      vehicleType: vehicleData.vehicleType,
    });
    setParkingStatus(status);
    setIsModalOpen(true);
  };
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // const savePrakingData = Digit.Hooks.deonar.useSavePrakingDetail();

  const onSubmit = async (formData) => {
    setIsLoading(true);
    // const vehicleId = options.find((item) => item.name === formData.vehicleType)?.id;
    // console.log("vehicleId", vehicleId);
    const payload = {
      vehicleParking: {
        vehicleNumber: formData.vehicleNumber,
        vehicleType: formData.vehicleType.value,
        IN: true,
        OUT: false,
      },
    };
    saveParkingDetails(payload, {
      onSuccess: (data) => {
        showToast("success", t("DEONAR_PARKING_DATA_UPDATED_SUCCESSFULY"));
        reset();
        setResponseData(data);
        console.log(data, "data2");
        setIsLoading(false);
      },
      onError: () => {
        showToast("error", t("DEONAR_PARKING_DATA_NOT_UPDATED_SUCCESSFULY"));
        setIsLoading(false);
      },
    });

    setIsModalOpen(false);
  };

  console.log("responseData", responseData);

  const handleDeparture = async (formData) => {
    setIsLoading(true);
    let parkingTime;
    if (typeof formData.parkingTime === "string") {
      const [hours, minutes, seconds] = formData.parkingTime.split(":");
      parkingTime = new Date().setHours(hours, minutes, seconds.split(".")[0], seconds.split(".")[1] || 0);
    } else {
      parkingTime = formData.parkingTime;
    }
    const payload = {
      vehicleParking: {
        vehicleNumber: formData.vehicleNumber,
        vehicleType: formData.vehicleType,
        parkingTime: parkingTime,
        IN: false,
        OUT: true,
      },
    };

    console.log("payloadOUT", payload);

    saveParkingDetails(payload, {
      onSuccess: (data) => {
        showToast("success", t("DEONAR_PARKING_DATA_UPDATED_SUCCESSFULY"));
        reset();
        setResponseData(data);
        setDisabledRows((prev) => [...prev, formData.vehicleNumber]);
        setIsLoading(false);
      },
      onError: () => {
        showToast("error", t("DEONAR_PARKING_DATA_NOT_UPDATED_SUCCESSFULY"));
        setIsLoading(false);
      },
    });
  };

  const Tablecolumns = [
    {
      Header: t("Vehicle Number"),
      accessor: "vehicleNumber",
    },
    {
      Header: t("Vehicle Type"),
      accessor: "vehicleType",
    },
    {
      Header: t("Parking Time"),
      accessor: "parkingTime",
    },
    {
      Header: t("Parking Date"),
      accessor: "parkingDate",
    },
    {
      Header: t("Departure Time"),
      accessor: "departureTime",
    },
    {
      Header: t("Departure Date"),
      accessor: "departureDate",
    },
    {
      Header: t("Action"),
      accessor: "action",
      Cell: ({ row }) => {
        const vehicleData = row.original;
        const isDisabled = vehicleData.departureTime !== "N/A" && vehicleData.departureDate !== "N/A";
        return (
          <span>
            <button
              onClick={() => handleDeparture(vehicleData)}
              disabled={isDisabled}
              style={{
                padding: "0.25rem 0.5rem",
                borderRadius: "4px",
                border: "none",
                width: "115px",
                height: "35px",
                backgroundColor: isDisabled ? "#ccc" : "#f47738",
                cursor: isDisabled ? "not-allowed" : "pointer",
                textAlign: "center",
                fontSize: "14px",
              }}
            >
              {isDisabled ? t("DEPARTURE") : t("Deonar_OUT")}
            </button>
          </span>
        );
      },
    },
  ];

  const showToast = (type, message, duration = 5000) => {
    setToast({ key: type, action: message });
    setTimeout(() => {
      setToast(null);
    }, duration);
  };

  const myConfig = {
    elements: [
      {
        type: "p",
        text: "Add Parking Details",
        style: { textDecoration: "underline", cursor: "pointer" },
        onClick: "onAddClickFunction",
      },
    ],
  };

  const { fetchParkingCollectionDetails, saveParkingDetails } = useCollectionPoint({});

  const { data: parkingDetailsData } = fetchParkingCollectionDetails();

  useEffect(() => {
    if (parkingDetailsData && parkingDetailsData.VehicleParkedCheckDetails) {
      const vehicleParkedCheckDetails = parkingDetailsData.VehicleParkedCheckDetails.map((detail) => ({
        vehicleType: detail.vehicleType,
        vehicleNumber: detail.vehicleNumber,
        parkingTime: detail.parkingTime,
        parkingDate: detail.parkingDate,
        departureTime: detail.departureTime,
        departureDate: detail.departureDate,
      }));

      setTableData(vehicleParkedCheckDetails);
      setIsLoading(false);
    }
  }, [parkingDetailsData]);

  return (
    <React.Fragment>
      <div className="bmc-card-full">
        <form onSubmit={handleSubmit(onSubmit)}>
          <MainFormHeader title={"DEONAR_PARKING"} />
          <div className="bmc-row-card-header">
            <div className="bmc-card-row">
              {isLoading ? (
                <Loader />
              ) : (
                <CustomTable
                  t={t}
                  columns={Tablecolumns}
                  data={tableData}
                  disableSort={false}
                  autoSort={false}
                  manualPagination={false}
                  onAddEmployeeClick={openModal}
                  config={myConfig}
                  isLoadingRows={isLoading}
                  getCellProps={(cellInfo) => {
                    return {
                      style: {
                        fontSize: "16px",
                      },
                    };
                  }}
                />
              )}
            </div>
          </div>
          <CustomModal isOpen={isModalOpen} onClose={toggleModal}>
            <div className="bmc-card-row">
              <VehicleTypeDropdownField control={control} data={data} setData={setData} t={t} />
              <VehicleNumberField control={control} setData={setData} data={data} t={t} />
            </div>

            <div style={{ float: "right", paddingBottom: "1rem", textAlign: "end" }}>
              <button
                className="bmc-card-button"
                style={{ borderBottom: "3px solid black", outline: "none" }}
                type="submit"
                onClick={handleSubmit(onSubmit)}
              >
                {t("Submit")}
              </button>
            </div>
          </CustomModal>
        </form>
      </div>
      {toast && (
        <Toast
          error={toast.key === t("error")}
          label={t(toast.key === t("success") ? t("DEONAR_PARKING_DATA_UPDATED_SUCCESSFULY") : toast.action)}
          onClose={() => setToast(null)}
          style={{ maxWidth: "670px" }}
        />
      )}
    </React.Fragment>
  );
};

export default ParkingFeePage;
