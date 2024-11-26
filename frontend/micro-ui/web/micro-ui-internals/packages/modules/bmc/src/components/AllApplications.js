import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Pagination from "../components/pagination";

const AllApplicationsPage = () => {
  const { t } = useTranslation();
  const [applicationsStatus, setApplicationsStatus] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = applicationsStatus.slice(indexOfFirstRow, indexOfLastRow);

  const applicationFunction = (data) => {
    console.log("Data received in applicationFunction:", typeof data);
    if (data) {
      setApplicationsStatus(data.Applications);
    }
  };

  Digit.Hooks.bmc.useBMCApplicationStatus({}, { select: applicationFunction });

  console.log("Applications Status:", applicationsStatus);
  return (
    <React.Fragment>
      <div className="bmc-card-full">
        <div className="bmc-row-card-header">
          <div className="bmc-card-row">
            <div className="bmc-title">{t("BMC_ALL_APPLICATIONS_STATUS")}</div>
            <div className="bmc-table-container" style={{ padding: "0" }}>
              <table className="bmc-hover-table">
                <thead>
                  <tr>
                    <th data-label={t("BMC_ApplicationNumber")}>{t("BMC_ApplicationNumber")}</th>
                    <th data-label={t("BMC_SchemeName")}>{t("BMC_SchemeName")}</th>
                    <th data-label={t("BMC_MachineName")}>{t("BMC_MachineName")}</th>
                    <th data-label={t("BMC_CourseName")}>{t("BMC_CourseName")}</th>
                    <th data-label={t("BMC_CurrentStatus")}>{t("BMC_CurrentStatus")}</th>
                    <th data-label={t("BMC_LastModifiedDate")}>{t("BMC_LastModifiedDate")}</th>
                    <th data-label={t("BMC_Comment")}>{t("BMC_Comment")}</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRows &&
                    currentRows.map((item) => (
                      <tr key={item.applicationNumber}>
                        <td data-label={t("BMC_ApplicationNumber")}>{item.applicationNumber || "N/A"}</td>
                        <td data-label={t("BMC_SchemeName")}>{item.name || "N/A"}</td>
                        <td data-label={t("BMC_MachineName")}>{item.machine || "N/A"}</td>
                        <td data-label={t("BMC_CourseName")}>{item.courseName || "N/A"}</td>
                        <td data-label={t("BMC_CurrentStatus")}>{item.currentStatus || "N/A"}</td>
                        <td data-label={t("BMC_LastModifiedDate")}>{item.lastModifiedTime || "N/A"}</td>
                        <td data-label={t("BMC_Comment")}>{item.comment || "N/A"}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <Pagination
                totalRecords={applicationsStatus.length}
                rowsPerPage={rowsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                onRowsPerPageChange={setRowsPerPage}
              />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AllApplicationsPage;
