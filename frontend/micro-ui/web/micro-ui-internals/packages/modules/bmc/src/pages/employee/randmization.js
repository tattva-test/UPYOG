import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import RandomizeApplications from "../../components/RandomizeApplications";
import Title from "../../components/title";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Table } from "@upyog/digit-ui-react-components";

const RandmizationPage = ({ Comment }) => {
  const { t } = useTranslation();
  const actions = ["RANDOMIZE"];
  const { control, handleSubmit, setValue } = useForm();
  const availableActions = ["RANDOMIZE"];
  const history = useHistory();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [applications, setApplications] = useState(() => {
    const savedApplications = sessionStorage.getItem("applications");
    return savedApplications ? JSON.parse(savedApplications) : [];
  });
  const [selectedAction, setSelectedAction] = useState(availableActions[0]);

  const getVerifierApplications = Digit.Hooks.bmc.useVerifierSchemeDetail();
  const getVerifyScheme = Digit.Hooks.bmc.useVerifierScheme();

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = applications.slice(indexOfFirstRow, indexOfLastRow);

  const handleSearchCriteria = (criteria) => {
    getVerifierApplications.mutate(
      {
        schemeId: criteria.schemeID,
        detailID: criteria.detailID,
        type: criteria.type,
        action: availableActions,
        number: Number(criteria.machineNumber),
      },
      {
        onSuccess: (data) => {
          if (data && data.Applications) {
            setApplications(data.Applications);
            setTotalRecords(data.Applications.length);
            sessionStorage.setItem("applications", JSON.stringify(data.Applications));
          } else {
            setApplications([]);
            setTotalRecords(0);
            sessionStorage.setItem("applications", JSON.stringify([]));
          }
        },
        onError: (err) => {
          console.error("Error fetching applications:", err);
        },
      }
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allApplicationNumbers = currentRows.map((row) => row.applicationNumber);
      setSelectedRows(allApplicationNumbers);
    } else {
      setSelectedRows([]);
    }
  };

  const handleRowCheckboxChange = (applicationNumber) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(applicationNumber)
        ? prevSelectedRows.filter((row) => row !== applicationNumber)
        : [...prevSelectedRows, applicationNumber]
    );
  };

  const handleRandomAll = () => {
    const data = {
      ApplicationStatus: {
        action: "SELECTED",
        Comment: Comment || null,
        ApplicationNumbers: selectedRows || [],
      },
    };

    getVerifyScheme.mutate(data, {
      onSuccess: () => {
        setApplications((prevApplications) => prevApplications.filter((application) => !selectedRows.includes(application.applicationNumber)));
        setSelectedRows([]);
        setIsModalOpen(false);
      },
      onError: (err) => {
        console.error("Error verifying applications:", err);
      },
    });
  };

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("applications");
    };
  }, []);

  const handleNextPage = () => {
    if (currentPage * rowsPerPage < totalRecords) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handlePageSizeChange = (event) => {
    const newSize = Number(event.target.value);
    if (newSize && !isNaN(newSize)) {
      setRowsPerPage(newSize);
      setCurrentPage(1);
    }
  };

  const Tablecolumns = [
    {
      Header: t("Name"),
      accessor: "aadharName",
    },
    {
      Header: t("Application Number"),
      accessor: "applicationNumber",
    },
    {
      Header: t("BMC_WARD_NAME"),
      accessor: "ward",
    },
    {
      Header: t("Gender"),
      accessor: "gender",
    },
    {
      Header: t("Pincode"),
      accessor: "pinCode",
    },
  ];

  const filteredData = applications.slice(indexOfFirstRow, indexOfLastRow).map((application) => {
    const applicantDetails = application.ApplicantDetails?.[0];
    return {
      aadharName: applicantDetails?.AadharUser?.aadharName || "N/A",
      applicationNumber: application.applicationNumber || "N/A",
      ward: applicantDetails?.UserOtherDetails?.ward.split('_')[1] || "N/A",
      gender: applicantDetails?.AadharUser?.gender || "N/A",
      pinCode: applicantDetails?.address?.pinCode?.value || "N/A",
    };
  });

  return (
    <React.Fragment>
      <Title text={t(`BMC_Application_for_${selectedAction}`)} />
      <div className="bmc-card-full">
        <RandomizeApplications onUpdate={handleSearchCriteria} actions={actions} />
        <div className="bmc-row-card-header" style={{ padding: "0" }}>
          <div className="bmc-card-row">
            <div className="bmc-table-container">
              <Table
                className="customTable table-fixed-first-column table-border-style bmc-hover-table"
                t={t}
                columns={Tablecolumns}
                data={filteredData}
                onPageSizeChange={handlePageSizeChange}
                currentPage={currentPage}
                onNextPage={handleNextPage}
                onPrevPage={handlePrevPage}
                pageSizeLimit={rowsPerPage}
                totalRecords={totalRecords}
                disableSort={false}
                getCellProps={(cellInfo) => ({
                  style: {
                    fontSize: "16px",
                  },
                })}
              />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default RandmizationPage;
