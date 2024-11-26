import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import SearchButtonField from "../commonFormFields/searchBtn";
import MainFormHeader from "../commonFormFields/formMainHeading";
import VehicleNumberField from "../commonFormFields/vehicleNumber";
import SubmitPrintButtonFields from "../commonFormFields/submitPrintBtn";
import { gatePassMockData, meatType } from "../../../constants/dummyData";
import { COLLECTION_POINT_ENDPOINT } from "../../../constants/apiEndpoints";
import useSubmitForm from "../../../hooks/useSubmitForm";
import { Header, Label } from "@upyog/digit-ui-react-components";
import VehicleTypeDropdownField from "../commonFormFields/vehicleTypeDropdown";
import ReceiverField from "../commonFormFields/receiverName";
import ShopkeeperNameField from "../commonFormFields/shopkeeperName";
import HelkariNameField from "../commonFormFields/helkariName";
import useDeonarCommon from "@upyog/digit-ui-libraries/src/hooks/deonar/useCommonDeonar";

const GatePass = () => {
  const { t } = useTranslation();
  const [data, setData] = useState({});
  const [meatTypeOptions, setMeatTypeOptions] = useState([]);

  const { fetchGatePassSearchData, saveGatePassData } = useDeonarCommon();

  const gatePassSearchData = fetchGatePassSearchData();
  const gatePassSaveData = saveGatePassData();

  console.log("meatTypeOptions", data);

  const {
    control,
    setValue,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      vehicleType: "",
      vehicleNumber: "",
      receiverName: "",
      receiverContact: "",
      typeOfMeat: "",
      typeOfAnimal: "",
      weight: 0,
      referenceNumber: 0,
      shopkeeper: "",
      helkari: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    setMeatTypeOptions(meatType);
  }, []);

  const { submitForm, isSubmitting, response, error } = useSubmitForm(COLLECTION_POINT_ENDPOINT);

  // const fetchDataByVehicleNumber = async (vehicleNumber) => {
  //   // Simulate fetching data
  //   return gatePassMockData; // Replace this with actual API call if necessary
  // };

  // const handleSearch = async () => {
  //   const vehicleNumber = getValues("vehicleNumber");
  //   if (vehicleNumber) {
  //     try {
  //       const result = await fetchDataByVehicleNumber(vehicleNumber);
  //       setData(result);
  //       console.log(result);

  //       setValue("shopkeeper", result.shopkeeperName.name || "");
  //       setValue("helkari", result.helkariName.name || "");
  //       setValue("vehicleType", result.vehicleType.name || "");
  //       setValue("receiverName", result.receiverName || "");
  //       setValue("receiverContact", result.receiverContact || "");
  //       setValue("numberOfAnimals", result.numberOfAnimals || 0);
  //       setValue("typeOfAnimal", result.typeOfAnimal.name || "");
  //       setValue("typeOfMeat", result.typeOfMeat.name || "");
  //       setValue("weight", result.weight || 0);
  //       setValue("referenceNumber", result.referenceNumber || 0);
  //     } catch (error) {
  //       console.error("Failed to fetch data", error);
  //     }
  //   }
  // };

  const handleSearch = async () => {
    const payload = {
      criteria: {
        shopkeeper: data?.shopkeeperName?.value,
        helkari: data?.helkariName?.value,
      },
    };
    gatePassSearchData.mutate(payload, {
      onSuccess: (data) => {
        setData(data);
        console.log(data);
      },
      onError: (error) => {
        console.error("Failed to fetch data", error);
      },
    });
    console.log(data);
  };

  const onSubmit = (formData) => {
    const payload = {
      vehicleType: formData?.vehicleType?.value || "",
      vehicleNumber: formData?.vehicleNumber || "",
      receiverName: formData?.receiverName || "",
      receiverContact: formData?.receiverContact || "",
      typeOfAnimal: formData?.typeOfAnimal || "",
      carcasweight: formData?.carcasweight || 0,
      kenaweight: formData?.kenaweight || 0,
      referenceNumber: formData?.referenceNumber || 0,
      shopkeeper: formData?.shopkeeperName?.value || "",
      helkari: formData?.helkariName?.value || "",
    };

    gatePassSaveData.mutate(payload, {
      onSuccess: (data) => {
        console.log(data);
      },
      onError: (error) => {
        console.error("Failed to fetch data", error);
      },
    });

    console.log("Submitting Payload:", payload);
  };

  return (
    <React.Fragment>
      {/* <div className="bmc-card-full">
        <form onSubmit={handleSubmit(onSubmit)}>
          <MainFormHeader title={"DEONAR_GATE_PASS"} />
          <div className="bmc-row-card-header">
            <div className="bmc-card-row">
              <VehicleNumberField control={control} setData={setData} data={data} />
              <SearchButtonField onSearch={handleSearch} />
            </div>
          </div>
          <div className="bmc-row-card-header">
            <div
              style={{
                border: "3px dotted #ccc",
                padding: "20px",
                borderRadius: "10px",
                margin: "20px auto",
                backgroundColor: "#fff",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div style={{ borderBottom: "2px solid #ddd", paddingBottom: "10px", marginBottom: "20px" }}>
                <h2 style={{ textAlign: "center", fontSize: "24px", margin: "0" }}>{t("DEONAR")}</h2>
                <p style={{ textAlign: "center", fontSize: "14px", margin: "10px 0" }}>
                  {t("DEONAR_DATE")}: {new Date().toLocaleDateString()}
                </p>
                <p style={{ textAlign: "center", fontSize: "14px", margin: "0" }}>
                  {t("DEONAR_REFERENCENUMBER")}: {data.referenceNumber || "N/A"}
                </p>
              </div>

              <div className="bmc-card-row" style={{ borderBottom: "2px solid #ddd", paddingBottom: "10px", marginBottom: "20px" }}>
                <div className="">
                  <div className="bmc-col2-card">
                    <Label>
                      {t("DEONAR_SHOPKEEPER")}: {data.shopkeeperName ? data.shopkeeperName.name : "N/A"}
                    </Label>
                    <Label>
                      {t("DEONAR_HELKARI")}: {data.helkariName ? data.helkariName.name : "N/A"}
                    </Label>

                    <Label>
                      {t("DEONAR_TYPEOFANIMAL")}: {data.typeOfAnimal ? data.typeOfAnimal.name : "N/A"}
                    </Label>
                  </div>
                  <div className="bmc-col2-card">
                    <Label>
                      {t("DEONAR_VEHICLENUMBER")}: {data.vehicleNumber || "N/A"}
                    </Label>
                    <Label>
                      {t("DEONAR_VEHICLETYPE")}: {data.vehicleType ? data.vehicleType.name : "N/A"}
                    </Label>
                    <Label>
                      {t("DEONAR_RECEIVERNAME")}: {data.receiverName || "N/A"}
                    </Label>
                    <Label>
                      {t("DEONAR_RECEIVERCONTACT")}: {data.receiverContact || "N/A"}
                    </Label>
                  </div>
                </div>
              </div>

              <table className="bmc-hover-table" style={{ borderBottom: "2px solid #ddd", paddingBottom: "10px", marginBottom: "20px" }}>
                <thead>
                  <tr>
                    <th>{t("DEONAR_TYPEOFMEAT")}</th>
                    <th>{t("DEONAR_WEIGHT")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{t("CARCASS")}</td>
                    <td>{data.weight || 0}</td>
                  </tr>
                  <tr>
                    <td>{t("KENA")}</td>
                    <td>{data.weight || 0}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <SubmitPrintButtonFields />
        </form>
      </div> */}

      <div className="bmc-card-full">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bmc-row-card-header">
            <div className="bmc-card-row">
              <VehicleNumberField control={control} setData={setData} data={data} />
              <VehicleTypeDropdownField control={control} setData={setData} data={data} />
              <ReceiverField control={control} setData={setData} data={data} label={t("DEONAR_RECEIVERNAME")} name={"receiverName"} />
              <ReceiverField control={control} setData={setData} data={data} label={t("DEONAR_RECEIVERCONTACT")} name={"receiverContact"} />
            </div>
            <div className="bmc-card-row">
              <ShopkeeperNameField control={control} setData={setData} data={data} />
              <HelkariNameField control={control} setData={setData} data={data} />
              <SearchButtonField onSearch={handleSearch} />
            </div>
          </div>
          <div className="bmc-row-card-header">
            <div
              style={{
                border: "3px dotted #ccc",
                padding: "20px",
                borderRadius: "10px",
                margin: "20px auto",
                backgroundColor: "#fff",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div style={{ borderBottom: "2px solid #ddd", paddingBottom: "10px", marginBottom: "20px" }}>
                <h2 style={{ textAlign: "center", fontSize: "24px", margin: "0" }}>{t("DEONAR")}</h2>
                <p style={{ textAlign: "center", fontSize: "14px", margin: "10px 0" }}>
                  {t("DEONAR_DATE")}: {new Date().toLocaleDateString()}
                </p>
                <p style={{ textAlign: "center", fontSize: "14px", margin: "0" }}>
                  {t("DEONAR_REFERENCENUMBER")}: {data.referenceNumber || "N/A"}
                </p>
              </div>

              <div className="bmc-card-row" style={{ borderBottom: "2px solid #ddd", paddingBottom: "10px", marginBottom: "20px" }}>
                <div className="">
                  <div className="bmc-col2-card">
                    <Label>
                      {t("DEONAR_SHOPKEEPER")}: {data.shopkeeperName ? data.shopkeeperName.name : "N/A"}
                    </Label>
                    <Label>
                      {t("DEONAR_HELKARI")}: {data.helkariName ? data.helkariName.name : "N/A"}
                    </Label>

                    <Label>
                      {t("DEONAR_TYPEOFANIMAL")}: {data.typeOfAnimal ? data.typeOfAnimal.name : "N/A"}
                    </Label>
                  </div>
                  <div className="bmc-col2-card">
                    <Label>
                      {t("DEONAR_VEHICLENUMBER")}: {data.vehicleNumber || "N/A"}
                    </Label>
                    <Label>
                      {t("DEONAR_VEHICLETYPE")}: {data.vehicleType ? data.vehicleType.name : "N/A"}
                    </Label>
                    <Label>
                      {t("DEONAR_RECEIVERNAME")}: {data.receiverName || "N/A"}
                    </Label>
                    <Label>
                      {t("DEONAR_RECEIVERCONTACT")}: {data.receiverContact || "N/A"}
                    </Label>
                  </div>
                </div>
              </div>

              <table className="bmc-hover-table" style={{ borderBottom: "2px solid #ddd", paddingBottom: "10px", marginBottom: "20px" }}>
                <thead>
                  <tr>
                    <th>{t("DEONAR_TYPEOFMEAT")}</th>
                    <th>{t("DEONAR_WEIGHT")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{t("CARCASS")}</td>
                    <td>{data.weight || 0}</td>
                  </tr>
                  <tr>
                    <td>{t("KENA")}</td>
                    <td>{data.weight || 0}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <SubmitPrintButtonFields />
        </form>
      </div>
    </React.Fragment>
  );
};

export default GatePass;
