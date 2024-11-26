import React, { useEffect, useState } from "react";
import MainFormHeader from "../commonFormFields/formMainHeading";
import { useTranslation } from "react-i18next";
import { RadioButtons, Header, Toast, Loader, EditIcon } from "@upyog/digit-ui-react-components";
import CustomTable from "../commonFormFields/customTable";
import useDeonarCommon from "../../../../../../libraries/src/hooks/deonar/useCommonDeonar";
import { columns, useDebounce } from "../collectionPoint/utils";
import { useForm } from "react-hook-form";
import { abdominalCavity, pelvicCavity, specimenCollection, thoracicCavity, visibleMucusMembrane } from "../../../constants/dummyData";
import InspectionTableHeader from "./tableHeader";
import { generateTokenNumber } from "../collectionPoint/utils";
import { AnimalInspectionModal, BeforeSlauhterInspectionModal, PostMortemInspectionModal } from "./inspectionModal";

const inspectionTypes = [
  { label: "Ante-Mortem Inspection", value: 1 },
  { label: "Re-Ante Mortem Inspection", value: 2 },
  { label: "Before Slaughter Inspection", value: 3 },
  { label: "Post-Mortem Inspection", value: 4 },
];

const AnteMortemInspectionPage = () => {
  const { t } = useTranslation();
  const [data, setData] = useState({});
  const [selectedUUID, setSelectedUUID] = useState("");
  const [arrivalDataCount, setArrivalDataCount] = useState([]);
  const [radioValueCheck, setRadioValueCheck] = useState(inspectionTypes[0].label);
  const [searchTerm, setSearchTerm] = useState("");
  const [speciesOptions, setSpeciesOptions] = useState([]);
  const [breedOptions, setBreedOptions] = useState([]);
  const [sexOptions, setSexOptions] = useState([]);
  const [bodyColorOptions, setBodyColorOptions] = useState([]);
  const [pregnancyOptions, setPregnancyOptions] = useState([]);
  const [gaitOptions, setGaitOptions] = useState([]);
  const [postureOptions, setPostureOptions] = useState([]);
  const [pulseOptions, setPulseOptions] = useState([]);
  const [bodyTempOptions, setBodyTempOptions] = useState([]);
  const [appetiteOptions, setAppetiteOptions] = useState([]);
  const [eyesOptions, setEyesOptions] = useState([]);
  const [nostrilOptions, setNostrilOptions] = useState([]);
  const [muzzleOptions, setMuzzleOptions] = useState([]);
  const [opinionOptions, setOpinionOptions] = useState([]);
  const [postMertemOpinion, setPostMertemOpinion] = useState([]);
  const [approxAgeOptions, setApproxAgeOptions] = useState([]);
  const [visibleMucusMembraneOptions, setVisibleMucusMembraneOptions] = useState([]);
  const [thoracicCavityOptions, setThoracicCavityOptions] = useState([]);
  const [abdominalCavityOptions, setAbdominalCavityOptions] = useState([]);
  const [pelvicCavityOptions, setPelvicCavityOptions] = useState([]);
  const [specimenCollectionOptions, setSpecimenCollectionOptions] = useState([]);
  const [specialObservationOptions, setSpecialObservationOptions] = useState([
    { code: "1", name: "YES" },
    { code: "2", name: "NO" },
    { code: "3", name: "NAN" },
  ]);
  const [inspectionType, setInspectionType] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inspectionTableData, setInspectionTableData] = useState([]);
  const [modalInspectionType, setModalInspectionType] = useState(null);
  const [toast, setToast] = useState(null);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [isLoader, setIsLoader] = useState(false);
  const [inspectionId, setInspectionId] = useState(1);
  const [animalQuarters, setAnimalQuarters] = useState([{ name: "1" }, { name: "2" }, { name: "3" }, { name: "4" }]);

  const {
    control,
    setValue,
    reset,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      arrivalUuid: "",
      slaughterReceiptNumber: "",
      animalTokenNumber: "",
      species: "",
      breed: "",
      sex: "",
      bodyColor: "",
      pregnancy: "",
      gait: "",
      posture: "",
      pulseRate: "",
      bodyTemp: "",
      appetite: "",
      eyes: "",
      nostrils: "",
      muzzle: "",
      opinion: "",
      approxAge: "",
      visibleMucusMembrane: "",
      thoracicCavity: "",
      abdominalCavity: "",
      pelvicCavity: "",
      specimenCollection: "",
      specialObservation: "",
      animalQuarters: "",
      other: "",
      remark: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (inspectionTableData && inspectionTableData.length > 0) {
      setValue("animalTokenNumber", inspectionTableData[0]?.animalTokenNumber || "");
      setValue("species", inspectionTableData[0]?.species || "Caprine/Ovine");
      setValue("breed", inspectionTableData[0]?.breed || "Non descripteur (ND)");
      setValue("sex", inspectionTableData[0]?.sex || "Male/Female (mIf)");
      setValue("bodyColor", inspectionTableData[0]?.["bodyColor"] || "Mixed");
      setValue("pregnancy", inspectionTableData[0]?.pregnancy || "Yes");
      setValue("gait", inspectionTableData[0]?.gait || "Staggering gait");
      setValue("posture", inspectionTableData[0]?.posture || "Downer");
      setValue("pulseRate", inspectionTableData[0]?.["pulseRate"] || "Other");
      setValue("bodyTemp", inspectionTableData[0]?.["bodyTemp"] || "No Abnormality Detected (NAD)");
      setValue("appetite", inspectionTableData[0]?.appetite || "Reduced appetite");
      setValue("eyes", inspectionTableData[0]?.eyes || "Swollen");
      setValue("nostrils", inspectionTableData[0]?.nostrils || "Other");
      setValue("muzzle", inspectionTableData[0]?.muzzle || "Scabs");
      setValue("opinion", inspectionTableData[0]?.opinion || "Fit for slaughter");
      setValue("approxAge", inspectionTableData[0]?.["approxAge"] || ">3m");
      setValue("visibleMucusMembrane", inspectionTableData[0]?.["visibleMucusMembrane"] || "Yes");
      setValue("thoracicCavity", inspectionTableData[0]?.["thoracicCavity"] || "Yes");
      setValue("abdominalCavity", inspectionTableData[0]?.["abdominalCavity"] || "Yes");
      setValue("pelvicCavity", inspectionTableData[0]?.["pelvicCavity"] || "Yes");
      setValue("specimenCollection", inspectionTableData[0]?.["specimenCollection"] || "Yes");
      setValue("specialObservation", inspectionTableData[0]?.["specialObservation"] || "No");
      setValue("other", inspectionTableData[0]?.other || "ok");
      setValue("remark", inspectionTableData[0]?.remark || "ok");
      setValue("slaughterReceiptNumber", inspectionTableData[0]?.slaughterReceiptNumber || "ok");
      setValue("animalQuarters", inspectionTableData[0]?.animalQuarters);
    }
  }, [inspectionTableData, setValue]);

  const { data: data2, isLoading } = Digit.Hooks.useCustomMDMS("mh.mumbai", "deonar", [
    { name: "sex" },
    { name: "bodyColor" },
    { name: "eyes" },
    { name: "species" },
    { name: "breed" },
    { name: "pregnancy" },
    { name: "approxAge" },
    { name: "gait" },
    { name: "posture" },
    { name: "bodyTemp" },
    { name: "pulseRate" },
    { name: "appetite" },
    { name: "nostrils" },
    { name: "muzzle" },
    { name: "AnteMortemInspectionOpinion" },
    { name: "PostmortemInspectionOpinion" },
  ]);

  useEffect(() => {
    if (data2 && !isLoading) {
      setSexOptions(data2?.deonar?.sex?.map((option) => option.name) || []);
      setBodyColorOptions(data2?.deonar?.bodyColor?.map((option) => option.name) || []);
      setEyesOptions(data2?.deonar?.eyes?.map((option) => option.name) || []);
      setSpeciesOptions(data2?.deonar?.species?.map((option) => option.name) || []);
      setBreedOptions(data2?.deonar?.breed?.map((option) => option.name) || []);
      setPregnancyOptions(data2?.deonar?.pregnancy?.map((option) => option.name) || []);
      setGaitOptions(data2?.deonar?.gait?.map((option) => option.name) || []);
      setPostureOptions(data2?.deonar?.posture?.map((option) => option.name) || []);
      setPulseOptions(data2?.deonar?.pulseRate?.map((option) => option.name) || []);
      setBodyTempOptions(data2?.deonar?.bodyTemp?.map((option) => option.name) || []);
      setAppetiteOptions(data2?.deonar?.appetite?.map((option) => option.name) || []);
      setNostrilOptions(data2?.deonar?.nostrils?.map((option) => option.name) || []);
      setMuzzleOptions(data2?.deonar?.muzzle?.map((option) => option.name) || []);
      setOpinionOptions(data2?.deonar?.AnteMortemInspectionOpinion?.map((option) => option.name) || []);
      setPostMertemOpinion(data2?.deonar?.PostmortemInspectionOpinion?.map((option) => option.name) || []);
      setApproxAgeOptions(data2?.deonar?.approxAge?.map((option) => option.name) || []);
    }
  }, [data2, isLoading]);

  useEffect(() => {
    setVisibleMucusMembraneOptions(visibleMucusMembrane.map((option) => option.name));
    setThoracicCavityOptions(thoracicCavity.map((option) => option.name));
    setAbdominalCavityOptions(abdominalCavity.map((option) => option.name));
    setPelvicCavityOptions(pelvicCavity.map((option) => option.name));
    setSpecimenCollectionOptions(specimenCollection.map((option) => option.name));
    setSpecialObservationOptions(specialObservationOptions.map((option) => option.name));
    setAnimalQuarters(animalQuarters.map((option) => option.name));
  }, []);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { fetchEntryFeeDetailsbyUUID } = useDeonarCommon();
  const { data: fetchedData } = fetchEntryFeeDetailsbyUUID({ inspectionid: inspectionId });

  useEffect(() => {
    const selectedInspectionId = inspectionTypes.find((item) => item.label === radioValueCheck)?.value;
    if (selectedInspectionId && fetchedData && fetchedData.SecurityCheckDetails) {
      setInspectionId(selectedInspectionId);
      setArrivalDataCount(fetchedData.SecurityCheckDetails);
    }
  }, [radioValueCheck, fetchedData, inspectionId]);

  const getTableData = Digit.Hooks.deonar.useGetInspectionPointData();

  const handleUUIDClick = (entryUnitId) => {
    setSelectedUUID(entryUnitId);
    setIsLoader(true);

    const selectedInspectionType = inspectionTypes.find((item) => item.label === radioValueCheck);
    const inspectionTypeValue = selectedInspectionType ? selectedInspectionType.value : inspectionTypes[0].value;

    getTableData.mutate(
      {
        entryUnitId,
        inspectionType: inspectionTypeValue,
      },
      {
        onSuccess: (data) => {
          TableData(data);
          setIsLoader(false);
        },
        onError: (error) => {
          console.error("Error mutating table data:", error);
          setIsLoader(false);
        },
      }
    );
  };

  const ArrivalData = arrivalDataCount.filter((row) => {
    const values = Object.values(row);
    return values.some((value) => String(value).toLowerCase().includes(debouncedSearchTerm.toLowerCase()));
  });

  // const handleRadioChange = (value) => {
  //   setRadioValueCheck(value);
  //   setSelectedUUID("");
  //   setInspectionTableData([]);
  //   setSelectedAnimal(null);
  //   setIsLoader(true);

  //   showToast("notify", `Switched to ${value}`);

  //   const selectedInspectionType = inspectionTypes.find((item) => item.label === value);
  //   if (selectedInspectionType) {
  //     setInspectionType(selectedInspectionType.value);

  //     if (selectedUUID) {
  //       setIsLoader(true);
  //       getTableData.mutate(
  //         {
  //           entryUnitId: selectedUUID,
  //           inspectionType: selectedInspectionType.value,
  //         },
  //         {
  //           onSuccess: (data) => {
  //             TableData(data);
  //             setIsLoader(false);
  //           },
  //           onError: (error) => {
  //             console.error("Error fetching new table data:", error);
  //             setIsLoader(false);
  //           },
  //         }
  //       );
  //     } else {
  //       setIsLoader(false);
  //     }
  //   }
  // };

  const handleRadioChange = (value) => {
    setRadioValueCheck(value);
    setSelectedUUID("");
    setInspectionTableData([]);
    setSelectedAnimal(null);
    showToast("notify", `Switched to ${value}`);

    const selectedInspectionType = inspectionTypes.find((item) => item.label === value);
    if (selectedInspectionType) {
      setInspectionType(selectedInspectionType.value);

      if (selectedUUID) {
        getTableData.mutate(
          {
            entryUnitId: selectedUUID,
            inspectionType: selectedInspectionType.value,
          },
          {
            onSuccess: (data) => {
              TableData(data);
              setIsLoader(false);
            },
            onError: (error) => {
              console.error("Error fetching new table data:", error);
              setIsLoader(false);
            },
          }
        );
      }
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const openModal = (rowData) => {
    setIsModalOpen(true);
    setModalInspectionType(inspectionTypes[0].label);
    setSelectedAnimal(rowData);
  };

  const Tablecolumns = InspectionTableHeader({ inspectionType, openModal });

  //   const processedData = data?.InspectionDetails?.map((inspection) => {
  //     const animalDetail = inspection?.animalDetail || {};
  //     const animalTypeId = animalDetail?.animalTypeId || null;
  //     const animalTokenNumber = animalDetail?.token || null;
  //     const animalType = animalDetail?.animalType || "Unknown";
  //     const animal = generateTokenNumber(animalType, animalDetail?.token);
  //     const editable = animalDetail?.editable || false;

  //     setEditableState((prevState) => ({
  //       ...prevState,
  //       [inspection.inspectionDetailId]: editable,
  //     }));

  //     return {
  //       animalTypeId: animalTypeId,
  //       animalType: animalType,
  //       animal: animal,
  //       editable,
  //       animalTokenNumber: animalTokenNumber,
  //       species: inspection.species || "",
  //       breed: inspection.breed || "",
  //       sex: inspection.sex || "",
  //       bodyColor: inspection.bodyColor || "",
  //       eyes: inspection.eyes || "",
  //       pregnancy: inspection.pregnancy || "",
  //       gait: inspection.gait || "",
  //       posture: inspection.posture || "",
  //       bodyTemp: inspection.bodyTemp || "",
  //       approxAge: inspection.approxAge || "",
  //       pulseRate: inspection.pulseRate || "",
  //       appetite: inspection.appetite || "",
  //       nostrils: inspection.nostrils || "",
  //       muzzle: inspection.muzzle || "",
  //       opinion: inspection.opinion || "",
  //       other: inspection.other || "",
  //       remark: inspection.remark || "",
  //       slaughterReceiptNumber: inspection.slaughterReceiptNumber || "",
  //       visibleMucusMembrane: inspection.visibleMucusMembrane || "",
  //       thoracicCavity: inspection.thoracicCavity || "",
  //       abdominalCavity: inspection.abdominalCavity || "",
  //       pelvicCavity: inspection.pelvicCavity || "",
  //       specimenCollection: inspection.specimenCollection || "",
  //       specialObservation: inspection.specialObservation || "",
  //     };
  //   });
  //   setInspectionTableData(processedData);
  // };

  const TableData = (data) => {
    const processedData = [];
    const processedAnimalTokens = new Set();

    data?.InspectionDetails?.forEach((inspection) => {
      const animalDetail = inspection?.animalDetail || {};
      const animalTypeId = animalDetail?.animalTypeId || null;
      const animalTokenNumber = animalDetail?.token || null;
      const animalType = animalDetail?.animalType || "Unknown";
      const animal = generateTokenNumber(animalType, animalTokenNumber);
      if (processedAnimalTokens.has(animal)) {
        return;
      }

      processedData.push({
        animalTypeId: animalTypeId,
        animalType: animalType,
        animal: animal,
        editable: animalDetail?.editable || false,
        animalTokenNumber: animalTokenNumber,
        species: inspection.species || "",
        breed: inspection.breed || "",
        sex: inspection.sex || "",
        bodyColor: inspection.bodyColor || "",
        eyes: inspection.eyes || "",
        pregnancy: inspection.pregnancy || "",
        gait: inspection.gait || "",
        posture: inspection.posture || "",
        bodyTemp: inspection.bodyTemp || "",
        approxAge: inspection.approxAge || "",
        pulseRate: inspection.pulseRate || "",
        appetite: inspection.appetite || "",
        nostrils: inspection.nostrils || "",
        muzzle: inspection.muzzle || "",
        opinion: inspection.opinion || "",
        other: inspection.other || "",
        remark: inspection.remark || "",
        slaughterReceiptNumber: inspection.slaughterReceiptNumber || "",
        visibleMucusMembrane: inspection.visibleMucusMembrane || "",
        thoracicCavity: inspection.thoracicCavity || "",
        abdominalCavity: inspection.abdominalCavity || "",
        pelvicCavity: inspection.pelvicCavity || "",
        specimenCollection: inspection.specimenCollection || "",
        specialObservation: inspection.specialObservation || "",
        animalQuarters: inspection.animalQuarters === "" ? null : inspection.animalQuarters,
      });
      processedAnimalTokens.add(animal);
    });

    setInspectionTableData(processedData);
  };

  const saveAnteMortemInspection = Digit.Hooks.deonar.useInspectionPointSave();

  const showToast = (type, message, duration = 5000) => {
    setToast({ key: type, action: message });
    setTimeout(() => {
      setToast(null);
    }, duration);
  };
  const handleUpdateData = () => {
    toggleModal();
    setIsLoader(true);

    const payload = {
      InspectionDetails: {
        ...selectedAnimal,
        entryUnitId: selectedUUID,
        inspectionId: inspectionTypes.find((item) => item.label === radioValueCheck)?.value,
      },
    };

    const currentValues = getValues();

    Object.keys(currentValues).forEach((key) => {
      if (currentValues[key] && currentValues[key] !== selectedAnimal[key]) {
        payload.InspectionDetails[key] = currentValues[key];
      }
    });

    saveAnteMortemInspection.mutate(payload, {
      onSuccess: (response) => {
        showToast("success", t("DEONAR_INSPECTION_DATA_UPDATED_SUCCESSFULY"));
        setInspectionTableData((prevData) => {
          return prevData.map((item) => {
            if (item.animal === selectedAnimal.animal) {
              return { ...item, ...payload.InspectionDetails };
            }
            return item;
          });
        });
        setIsLoader(false);
      },
      onError: (error) => {
        showToast("error", t("DEONAR_INSPECTION_DATA_NOT_UPDATED_SUCCESSFULY"));
        setIsLoader(false);
      },
    });
  };

  return (
    <React.Fragment>
      <div className="bmc-card-full">
        <MainFormHeader title={t("INSPECTION_POINT")} />
        <div className="bmc-card-row">
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ display: "flex", gap: "10px", padding: "0 1px", flexDirection: "column", width: "30%" }}>
              <div className="bmc-col-small-header" style={{ width: "100%" }}>
                <div className="bmc-row-card-header">
                  <div className="bmc-card-row">
                    <Header>{t("Inspection Point")}</Header>
                    <RadioButtons
                      t={t}
                      label="Inspection Point"
                      options={inspectionTypes.map((type) => type.label)}
                      style={{ float: "left" }}
                      selectedOption={radioValueCheck}
                      onSelect={handleRadioChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bmc-row-card-header">
              <CustomTable
                t={t}
                columns={columns(handleUUIDClick)}
                data={ArrivalData}
                disableSort={false}
                autoSort={false}
                manualPagination={false}
              />
            </div>
          </div>
        </div>

        <div className="bmc-row-card-header">
          <div className="bmc-card-row">
            {selectedUUID ? (
              <div style={{ paddingBottom: "20px", display: "flex", gap: "12px", alignItems: "center" }}>
                <h3 style={{ fontWeight: "600", fontSize: "20px" }}>{t("Active Arrival UUID")}:</h3>
                <span style={{ fontWeight: "bold", backgroundColor: "rgb(204, 204, 204)", borderRadius: "10px", padding: "8px", fontSize: "22px" }}>
                  {selectedUUID}
                </span>
              </div>
            ) : (
              <Header style={{ color: "red" }}>{`${t(" Arrival UUID")} - ${t("Please Select Arrival UUID from Above Table")}`}</Header>
            )}
          </div>
          <div className="bmc-card-row">
            {isLoader && radioValueCheck ? (
              <Loader />
            ) : inspectionTableData && inspectionTableData.length === 0 ? (
              <div className="">
                <strong>{t("Data is not Available.")}</strong>
              </div>
            ) : (
              <CustomTable
                t={t}
                columns={[
                  {
                    Header: "Edit",
                    accessor: "edit",
                    Cell: ({ row }) => {
                      const editable = row.original.editable;
                      return editable ? (
                        <span onClick={() => openModal(row.original)}>
                          <EditIcon style={{ cursor: "pointer" }} />
                        </span>
                      ) : null;
                    },
                  },
                  ...Tablecolumns,
                ]}
                tableClassName={"deonar-custom-scroll"}
                data={inspectionTableData}
                disableSort={false}
                autoSort={false}
                manualPagination={false}
                onAddClickFunction={() => openModal(inspectionTypes[0].label)}
              />
            )}
          </div>
        </div>
      </div>

      {modalInspectionType === inspectionTypes[0].label && radioValueCheck === "Ante-Mortem Inspection" && (
        <AnimalInspectionModal
          isModalOpen={isModalOpen}
          toggleModal={toggleModal}
          control={control}
          handleUpdateValue={handleUpdateData}
          inspectionTableData={inspectionTableData}
          speciesOptions={speciesOptions}
          breedOptions={breedOptions}
          sexOptions={sexOptions}
          approxAgeOptions={approxAgeOptions}
          bodyColorOptions={bodyColorOptions}
          pregnancyOptions={pregnancyOptions}
          opinionOptions={opinionOptions}
          eyesOptions={eyesOptions}
          nostrilOptions={nostrilOptions}
          muzzleOptions={muzzleOptions}
          bodyTempOptions={bodyTempOptions}
          pulseOptions={pulseOptions}
          postureOptions={postureOptions}
          gaitOptions={gaitOptions}
          appetiteOptions={appetiteOptions}
          selectedAnimal={selectedAnimal}
        />
      )}

      {modalInspectionType === inspectionTypes[0].label && radioValueCheck === "Re-Ante Mortem Inspection" && (
        <AnimalInspectionModal
          isModalOpen={isModalOpen}
          toggleModal={toggleModal}
          control={control}
          handleUpdateValue={handleUpdateData}
          inspectionTableData={inspectionTableData}
          speciesOptions={speciesOptions}
          breedOptions={breedOptions}
          sexOptions={sexOptions}
          approxAgeOptions={approxAgeOptions}
          bodyColorOptions={bodyColorOptions}
          pregnancyOptions={pregnancyOptions}
          Options={opinionOptions}
          eyesOptions={eyesOptions}
          nostrilOptions={nostrilOptions}
          muzzleOptions={muzzleOptions}
          bodyTempOptions={bodyTempOptions}
          pulseOptions={pulseOptions}
          postureOptions={postureOptions}
          gaitOptions={gaitOptions}
          appetiteOptions={appetiteOptions}
          selectedAnimal={selectedAnimal}
        />
      )}

      {modalInspectionType === inspectionTypes[0].label && radioValueCheck === "Before Slaughter Inspection" && (
        <BeforeSlauhterInspectionModal
          isModalOpen={isModalOpen}
          toggleModal={toggleModal}
          control={control}
          handleUpdateValue={handleUpdateData}
          inspectionTableData={inspectionTableData}
          speciesOptions={speciesOptions}
          breedOptions={breedOptions}
          sexOptions={sexOptions}
          approxAgeOptions={approxAgeOptions}
          bodyColorOptions={bodyColorOptions}
          pregnancyOptions={pregnancyOptions}
          opinionOptions={opinionOptions}
          eyesOptions={eyesOptions}
          nostrilOptions={nostrilOptions}
          muzzleOptions={muzzleOptions}
          bodyTempOptions={bodyTempOptions}
          pulseOptions={pulseOptions}
          postureOptions={postureOptions}
          gaitOptions={gaitOptions}
          appetiteOptions={appetiteOptions}
          selectedAnimal={selectedAnimal}
        />
      )}

      {modalInspectionType === inspectionTypes[0].label && radioValueCheck === "Post-Mortem Inspection" && (
        <PostMortemInspectionModal
          isModalOpen={isModalOpen}
          toggleModal={toggleModal}
          control={control}
          handleUpdateValue={handleUpdateData}
          inspectionTableData={inspectionTableData}
          speciesOptions={speciesOptions}
          breedOptions={breedOptions}
          sexOptions={sexOptions}
          approxAgeOptions={approxAgeOptions}
          bodyColorOptions={bodyColorOptions}
          pregnancyOptions={pregnancyOptions}
          opinionOptions={postMertemOpinion}
          visibleMucusMembraneOptions={visibleMucusMembraneOptions}
          thoracicCavityOptions={thoracicCavityOptions}
          abdominalCavityOptions={abdominalCavityOptions}
          pelvicCavityOptions={pelvicCavityOptions}
          specimenCollectionOptions={specimenCollectionOptions}
          specialObservationOptions={specialObservationOptions}
          animalQuarters={animalQuarters}
          selectedAnimal={selectedAnimal}
        />
      )}
      {toast && (
        <Toast
          error={toast.key === t("error")}
          label={t(toast.key === t("success") ? t("DEONAR_INSPECTION_DATA_UPDATED_SUCCESSFULY") : toast.action)}
          onClose={() => setToast(null)}
          style={{ maxWidth: "670px" }}
        />
      )}
    </React.Fragment>
  );
};

export default AnteMortemInspectionPage;
