import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import MainFormHeader from "../commonFormFields/formMainHeading";
import SubmitPrintButtonFields from "../commonFormFields/submitPrintBtn";
import useSubmitForm from "../../../hooks/useSubmitForm";
import { COLLECTION_POINT_ENDPOINT } from "../../../constants/apiEndpoints";
import { columns, generateTokenNumber } from "./utils";
import useDeonarCommon from "../../../../../../libraries/src/hooks/deonar/useCommonDeonar";
import CustomModal from "../commonFormFields/customModal";
import CustomTable from "../commonFormFields/customTable";
import TableCard from "../commonFormFields/tableCard";
import MultiColumnDropdown from "../commonFormFields/multiColumnDropdown";
import SubmitButtonField from "../commonFormFields/submitBtn";
import { Toast } from "@upyog/digit-ui-react-components";
import ConfirmationDialog from "../commonFormFields/confirmationDialog";
import { QueryClient, useQueryClient } from "react-query";

const StablingFeePage = () => {
  const { t } = useTranslation();

  const [defaults, setDefaults] = useState({});
  const [selectedUUID, setSelectedUUID] = useState();
  const [rows, setRows] = useState();
  const [animalCount, setAnimalCount] = useState([]);
  const [brokerData, setBrokerData] = useState([]);

  const [gawaltable, setGawaltable] = useState([]);
  const [gawalDropdown, setGawalDropdown] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);
  const [brokerOption, setBrokerOption] = useState([]);
  const [availableCount, setAvailableCount] = useState(0);

  const [totalRecords, setTotalRecords] = useState(0);

  const [sortParams, setSortParams] = useState({});

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [globalGawal, setGlobalGawal] = useState(null);

  const [isGlobalGawalEnabled, setIsGlobalGawalEnabled] = useState(false);
  const [isGlobalBrokerEnabled, setIsGlobalBrokerEnabled] = useState(false);

  const [globalBroker, setGlobalBroker] = useState(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const {
    control,
    setValue,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm({ defaultValues: defaults, mode: "onChange" });

  const { submitForm, isSubmitting, response, error } = useSubmitForm(COLLECTION_POINT_ENDPOINT);

  const { fetchEntryFeeDetailsbyUUID, fetchDeonarCommon, searchDeonarCommon, saveStablingDetails, fetchStablingList, invalidateDeonarDetails } = useDeonarCommon();
  const useFetchOptions = (optionType) => {
    const { data } = searchDeonarCommon({
      CommonSearchCriteria: {
        Option: optionType || [],
      },
    });

    return data
      ? data.CommonDetails.map((item) => ({
          name: item.name || "Unknown",
          value: item.id,
          licenceNumber: item.licenceNumber,
          mobileNumber: item.mobileNumber,
          registrationNumber: item.registrationnumber,
          traderType: item.tradertype,
          animalType: item.animalType,
        }))
      : [];
  };

  const gawalData1 = useFetchOptions("gawal");
  const brokerData1 = useFetchOptions("broker");

  const { data: fetchedData, isLoading } = fetchStablingList();

  useEffect(() => {
    if (fetchedData) {
      setAnimalCount(fetchedData.SecurityCheckDetails);
      setTotalRecords();
    }
  }, [fetchedData]);

  useEffect(() => {
    if (gawalData1.length) {
      const combinedData = gawalData1.map((item) => {
        const animalTypes = item.animalType.map((animal) => animal.name).join(", ");
        return {
          label: item.name || "Unknown",
          licenceNumber: item.licenceNumber,
          mobileNumber: item.mobileNumber,
          registrationNumber: item.registrationNumber,
          animalTypes: animalTypes || "No Animal Type",
          traderType: item.traderType,
          value: item.value,
        };
      });
      if (JSON.stringify(combinedData) !== JSON.stringify(gawalDropdown)) {
        setGawalDropdown(combinedData);
      }
    }
  }, [gawalData1, gawalDropdown]);

  useEffect(() => {
    if (brokerData1.length) {
      const combinedData = brokerData1.map((item) => {
        const animalTypes = item.animalType.map((animal) => animal.name).join(", ");
        return {
          label: item.name || "Unknown",
          licenceNumber: item.licenceNumber,
          mobileNumber: item.mobileNumber,
          registrationNumber: item.registrationNumber,
          animalTypes: animalTypes || "No Animal Type",
          traderType: item.traderType,
          value: item.value,
        };
      });
      if (JSON.stringify(combinedData) !== JSON.stringify(brokerData)) {
        setBrokerData(combinedData);
      }
    }
  }, [brokerData1, brokerData]);

  const handleUUIDClick = (entryUnitId) => {
    setSelectedUUID(entryUnitId);
    setIsModalOpen(!isModalOpen);
  };

  const toggleModal = () => {
    if (isDirty) {
      setIsConfirmModalOpen(true);
    } else {
      resetModal();
      setIsModalOpen(false);
    }
  };
  const handleConfirmClose = (confirm) => {
    setIsConfirmModalOpen(false);
    if (confirm) {
      resetModal();
      setIsModalOpen(false);
      setIsDirty(false);
    }
  };

  const fields = [
    { key: "entryUnitId", label: "Arrival UUID", isClickable: true },
    { key: "traderName", label: "Trader Name" },
    { key: "licenceNumber", label: "License Number" },
    { key: "vehicleNumber", label: "Vehicle Number" },
    { key: "dateOfArrival", label: "Arrival Date" },
    { key: "timeOfArrival", label: "Arrival Time" },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (fetchedData && fetchedData.SecurityCheckDetails) {
      const securityCheckDetails = fetchedData.SecurityCheckDetails;
      const mappedAnimalCount = securityCheckDetails.flatMap((detail) =>
        detail.animalDetails.map((animal) => ({
          arrivalId: detail.entryUnitId,
          animalTypeId: animal.animalTypeId,
          animalType: animal.animalType,
          count: animal.token,
        }))
      );
      setGawaltable(mappedAnimalCount);
    }
  }, [fetchedData]);

  const filteredGawaltable = gawaltable.filter((animal) => animal.arrivalId === selectedUUID);

  const handleSelect = (rowIndex, selectedOptionsForDropdown) => {
    setSelectedOption((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [rowIndex]: selectedOptionsForDropdown,
    }));
    setDropdownOpen(false);
    setIsDirty(true);
  };

  const handleBrokerSelect = (rowIndex, selectedOptionsForDropdown) => {
    setBrokerOption((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [rowIndex]: selectedOptionsForDropdown,
    }));
    setIsDirty(true);
  };

  const isVisibleColumns = [
    { Header: "Animal Type", accessor: "animalType" },
    {
      Header: "Animal Token",
      accessor: "count",
      Cell: ({ row }) => {
        const animalType = row.original.animalType;
        const index = row.index;
        return generateTokenNumber(animalType, row.original.count);
      },
    },
    {
      accessor: "animalDetails",
      Header: "Assign Gawal",
      Cell: ({ row }) => {
        const animalType = row.original.animalType.toLowerCase();
        const filteredGawalDropdown = gawalDropdown.filter((gawal) => gawal.animalTypes.toLowerCase().includes(animalType));

        return (
          <MultiColumnDropdown
            options={filteredGawalDropdown}
            selected={selectedOption[row.index] || []}
            onSelect={(e, selected) => handleSelect(row.index, selected)}
            placeholder="Select Gawal"
            displayKeys={["label", "licenceNumber", "mobileNumber"]}
            optionsKey="value"
            defaultUnit="Options"
            autoCloseOnSelect={true}
            showColumnHeaders={true}
            headerMappings={{
              label: "Name",
              licenceNumber: "License",
              mobileNumber: "Mobile Number",
            }}
          />
        );
      },
    },
    {
      accessor: "brokerDetails",
      Header: "Assign Broker",
      Cell: ({ row }) => {
        const animalType = row.original.animalType.toLowerCase();
        const filteredBrokerDropdown = brokerData.filter((broker) => broker.animalTypes.toLowerCase().includes(animalType));

        return (
          <MultiColumnDropdown
            options={filteredBrokerDropdown}
            selected={brokerOption[row.index] || []}
            onSelect={(e, selected) => handleBrokerSelect(row.index, selected)}
            placeholder="Select Broker"
            displayKeys={["label", "licenceNumber", "mobileNumber"]}
            optionsKey="value"
            defaultUnit="Options"
            autoCloseOnSelect={true}
            showColumnHeaders={true}
            headerMappings={{
              label: "Broker Name",
              licenceNumber: "License Number",
              mobileNumber: "Mobile Number",
            }}
          />
        );
      },
    },
  ];

  const onSubmit = async (formData) => {
    try {
      const filteredAnimalAssignments = gawaltable
        .filter((animal) => animal.arrivalId === selectedUUID)
        .map((animal, index) => {
          const selectedGawalArray = selectedOption[index] || [];
          const selectedGawal = selectedGawalArray[0];

          const selectedBrokerArray = brokerOption[index] || [];
          const selectedBroker = selectedBrokerArray[0];

          const assignments = [];

          // Add gawal assignment if selected
          if (selectedGawal) {
            assignments.push({
              animalTypeId: animal.animalTypeId,
              token: animal.count,
              assignedStakeholder: selectedGawal.value,
            });
          }

          // Add broker assignment if selected
          if (selectedBroker) {
            assignments.push({
              animalTypeId: animal.animalTypeId,
              token: animal.count,
              assignedStakeholder: selectedBroker.value,
            });
          }

          return assignments.length > 0 ? assignments : null;
        })
        .filter((entry) => entry !== null)
        .flat(); // Flatten the array to combine gawal and broker objects

      const payload = {
        ...formData,
        animalAssignments: filteredAnimalAssignments,
        arrivalId: selectedUUID,
      };

      saveStablingDetails(payload, {
        onSuccess: () => {
          resetModal();
          setIsModalOpen(false);
          setToast({ key: "success" });
        },

        onError: (error) => {
          console.error("Error submitting form:", error);
          setToast({ key: "error", action: error.message });
        },
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setToast({ key: "error", action: "Form submission failed" });
    }
  };

  const handleGlobalGawalSelect = (selected) => {
    const selectedGawal = selected[0] || null;
    setGlobalGawal(selectedGawal);
    if (isGlobalGawalEnabled && selectedGawal) {
      const updatedOptions = gawaltable.map((row, index) => {
        const animalType = row.animalType.toLowerCase();
        if (selectedGawal.animalTypes.toLowerCase().includes(animalType)) {
          return [selectedGawal];
        } else {
          return selectedOption[index] || [];
        }
      });
      setSelectedOption(updatedOptions);
    }
    setIsDirty(true);
  };

  const handleGlobalBrokerSelect = (selected) => {
    setGlobalBroker(selected[0] || null);
    if (isGlobalBrokerEnabled) {
      applyGlobalBroker(selected[0]);
    }
    setIsDirty(true);
  };

  const applyGlobalGawal = (gawal) => {
    setSelectedOption((prevOptions) => gawaltable.map((_, index) => [gawal]));
  };

  const applyGlobalBroker = (broker) => {
    setBrokerOption((prevOptions) => gawaltable.map((_, index) => [broker]));
  };

  const handleGlobalGawalToggle = (e) => {
    setIsGlobalGawalEnabled(e.target.checked);
    if (e.target.checked && globalGawal) {
      applyGlobalGawal(globalGawal);
    }
  };

  const handleGlobalBrokerToggle = (e) => {
    setIsGlobalBrokerEnabled(e.target.checked);
    if (e.target.checked && globalBroker) {
      applyGlobalBroker(globalBroker);
    }
  };

  const applicableGawals = useMemo(() => {
    const allAnimalTypesInTable = gawaltable.map((row) => row.animalType.toLowerCase());
    return gawalDropdown.filter((gawal) =>
      gawal.animalTypes
        .toLowerCase()
        .split(", ")
        .some((animalType) => allAnimalTypesInTable.includes(animalType))
    );
  }, [gawaltable, gawalDropdown]);

  const resetModal = () => {
    setSelectedUUID(undefined);
    setSelectedOption([]);
    setBrokerOption([]);
    setGlobalGawal([]);
    setGlobalBroker([]);
    setIsDirty(false);
  };

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
          <MainFormHeader title={"DEONAR_STABLING"} />
          {/* <div className="bmc-row-card-header"> */}

          <div className="bmc-card-row">
            {/* <StablingTypeOptionsField setStablingFormType={setStablingFormType} control={control} data={data} setData={setData} /> */}
            <div className="bmc-row-card-header">
              {isMobileView && animalCount.map((data, index) => <TableCard data={data} key={index} fields={fields} onUUIDClick={handleUUIDClick} />)}
              <CustomTable
                t={t}
                columns={columns(handleUUIDClick)}
                data={animalCount}
                manualPagination={false}
                tableClassName={"deonar-scrollable-table"}
                totalRecords={totalRecords}
                isLoadingRows={isLoading}
                // onSort={handleSort}
                //  fileName="YourCustomFileName"
              />
              {isModalOpen && (
                <CustomModal isOpen={isModalOpen} onClose={toggleModal} selectedUUID={selectedUUID} style={{ width: "100%" }}>
                  {/* <div className="bmc-row-card-header" style={{ marginBottom: "40px" }}> */}
                  <div style={{ display: "flex", gap: "20px", justifyContent: "space-between", marginBottom: "40px" }}>
                    <div style={{ marginBottom: "20px" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center" }}>
                        <input type="checkbox" checked={isGlobalGawalEnabled} onChange={handleGlobalGawalToggle} />
                        <h3 style={{ fontWeight: "500", fontSize: "16px" }}>Apply selected Gawal for all animals</h3>
                      </label>
                      <MultiColumnDropdown
                        options={applicableGawals}
                        selected={globalGawal ? [globalGawal] : []}
                        onSelect={(e, selected) => handleGlobalGawalSelect(selected)}
                        placeholder="Select Gawal"
                        displayKeys={["label", "licenceNumber", "mobileNumber"]}
                        optionsKey="value"
                        autoCloseOnSelect={true}
                        headerMappings={{
                          label: "Name",
                          licenceNumber: "License",
                          mobileNumber: "Mobile Number",
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center" }}>
                        <input type="checkbox" checked={isGlobalBrokerEnabled} onChange={handleGlobalBrokerToggle} />
                        <h3 style={{ fontWeight: "500", fontSize: "16px" }}>Apply selected Broker for all animals</h3>
                      </label>
                      <MultiColumnDropdown
                        options={brokerData}
                        selected={globalBroker ? [globalBroker] : []}
                        onSelect={(e, selected) => handleGlobalBrokerSelect(selected)}
                        placeholder="Select Broker"
                        displayKeys={["label", "licenceNumber", "mobileNumber"]}
                        optionsKey="value"
                        autoCloseOnSelect={true}
                        headerMappings={{
                          label: "Broker Name",
                          licenceNumber: "License Number",
                          mobileNumber: "Mobile Number",
                        }}
                      />
                    </div>
                  </div>
                  {/* </div> */}
                  <div className="bmc-card-row">
                    {/* <div className="bmc-row-card-header" style={{ overflowY: "auto", maxHeight: "300px" }}> */}
                    {/* {isMobileView && data.map((data, index) => <TableCard data={data} key={index} fields={fields} onUUIDClick={handleUUIDClick} />)} */}
                    <CustomTable
                      t={t}
                      columns={isVisibleColumns}
                      manualPagination={false}
                      data={filteredGawaltable}
                      totalRecords={totalRecords}
                      tableClassName={"ebe-custom-scroll"}
                      autoSort={false}
                      isLoadingRows={isLoading}
                    />
                    {/* </div> */}
                  </div>
                  <SubmitButtonField control={control} />

                  {/* <Fragment>
                  <div className="bmc-row-card-header" style={{ marginBottom: "40px" }}>
                    <SubmitPrintButtonFields />
                  </div>
                </Fragment> */}
                </CustomModal>
              )}
            </div>
          </div>
        </form>

        {isConfirmModalOpen && (
          <ConfirmationDialog
            message={t("You have unsaved changes. Do you want to continue?")}
            onConfirm={() => handleConfirmClose(true)}
            onCancel={() => handleConfirmClose(false)}
          />
        )}
      </div>
      {toast && (
        <Toast
          error={toast.key === "error"}
          label={t(toast.key === "success" ? "STABLING_DATA_SAVED_SUCCESSFULLY" : toast.action)}
          onClose={() => setToast(null)}
          style={{ maxWidth: "670px" }}
        />
      )}
    </React.Fragment>
  );
};

export default StablingFeePage;
