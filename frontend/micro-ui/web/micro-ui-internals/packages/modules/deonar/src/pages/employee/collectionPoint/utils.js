// // utils.js
import { Dropdown } from "@upyog/digit-ui-react-components";
import CustomChip from "../commonFormFields/deonarChip";

import React, { useEffect, useState } from "react";
import CustomModal from "../commonFormFields/customModal";
import GenericAddRow from "../commonFormFields/genericAddRow";
import { useTranslation } from "react-i18next";

export const deColumns = [
  {
    header: "ID",
    key: "id",
    render: (value, row, handleUUIDClick, index) => index + 1, // Display the sequence number
  },
  {
    header: "DEONAR_ARRIVAL_UUID",
    sortable: true,
    key: "entryUnitId",
    render: (value, row, handleUUIDClick) => (
      <span onClick={() => handleUUIDClick(value)} style={{ cursor: "pointer", color: "blue" }}>
        {value}
      </span>
    ),
  },
  { header: "DEONAR_TRADER_NAME", key: "traderName" },
  { header: "DEONAR_LICENSE_NUMBER", key: "licenceNumber" },
  { header: "DEONAR_VEHICLE_NUMBER", key: "vehicleNumber" },
  { header: "ARRIVAL_DATE_FIELD", key: "dateOfArrival" },
  { header: "ARRIVAL_TIME_FIELD", key: "timeOfArrival" },
  { header: "DEONAR_PERMISSION_NUMBER", key: "importPermission" },
  { header: "DEONAR_STAKEHOLDER", key: "stakeholderTypeName" },
  // {
  //   key: "animalDetails",
  //   header: "ANIMAL_DETAILS",
  //   render: (animalDetails) => {
  //     if (Array.isArray(animalDetails) && animalDetails.length > 0) {
  //       return (
  //         <div className="bmc-chip">
  //           <div className="dropdownStyles">
  //             {animalDetails.map((animal, index) => (
  //               <CustomChip key={index} text={`${animal.animalType}: ${animal.count}`} style={{ backgroundColor: "#d1e7dd", color: "#0f5132" }} />
  //             ))}
  //           </div>
  //         </div>
  //       );
  //     }
  //     return "-";
  //   },
  // },
];

export const columns = (handleUUIDClick) => [
  {
    Header: "ID",
    accessor: "id",
    Cell: ({ row }) => row.index + 1,
    getHeaderProps: (column) => ({
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center", // or any other styles you want
      },
    }),
    isVisible: false,
  },
  {
    Header: "DEONAR_ARRIVAL_UUID",
    accessor: "entryUnitId",
    sortable: true,
    Cell: ({ row }) => (
      <span onClick={() => handleUUIDClick(row.original.entryUnitId)} style={{ cursor: "pointer", color: "blue" }}>
        {row.original.entryUnitId}
      </span>
    ),
    isVisible: true,
  },
  {
    Header: "DEONAR_TRADER_NAME",
    accessor: "traderName",
    getHeaderProps: (column) => ({
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center", // or any other styles you want
      },
    }),
    isVisible: true,
  },
  {
    Header: "DEONAR_LICENSE_NUMBER",
    accessor: "licenceNumber",
    getHeaderProps: (column) => ({
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center", // or any other styles you want
      },
    }),
    isVisible: true,
  },
  {
    Header: "ARRIVAL_DATE_FIELD",
    accessor: "dateOfArrival",
    getHeaderProps: (column) => ({
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center", // or any other styles you want
      },
    }),
    isVisible: true,
  },
  {
    Header: "ARRIVAL_TIME_FIELD",
    accessor: "timeOfArrival",
    getHeaderProps: (column) => ({
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center", // or any other styles you want
      },
    }),
    isVisible: true,
  },

  // Table Column Configuration
  // {
  //   accessor: "animalDetails",
  //   Header: "ANIMAL_DETAILS",
  //   Cell: ({ row }) => <AnimalDetailsCell row={row} />
  // }
];

export const createDynamicColumns = (handleUUIDClick, tableType) => {
  const baseColumns = [
    {
      Header: "ID",
      accessor: "id",
      Cell: ({ row }) => row.index + 1,
      isVisible: false,
    },
    {
      Header: "DEONAR_ARRIVAL_UUID",
      accessor: "entryUnitId",
      Cell: ({ row }) => (
        <span onClick={() => handleUUIDClick(row.original.entryUnitId)} style={{ cursor: "pointer", color: "blue" }}>
          {row.original.entryUnitId}
        </span>
      ),
    },
    {
      Header: "DEONAR_TRADER_NAME",
      accessor: "traderName",
    },
    {
      Header: "DEONAR_LICENSE_NUMBER",
      accessor: "licenceNumber",
    },
    {
      Header: "ARRIVAL_DATE_FIELD",
      accessor: "dateOfArrival",
    },
    {
      Header: "ARRIVAL_TIME_FIELD",
      accessor: "timeOfArrival",
    },
  ];

  if (tableType === "washing" || tableType === "parking") {
    return [
      {
        Header: "ID",
        accessor: "id",
        Cell: ({ row }) => row.index + 1,
        getHeaderProps: (column) => ({
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        }),
        isVisible: false,
      },
      {
        Header: "Deonar_Vehicle_Number",
        accessor: "vehicleNumber",
        Cell: ({ row }) => (
          <span
            onClick={() => handleUUIDClick(row.original.vehicleNumber, row.original.vehicleId, tableType)}
            style={{ cursor: "pointer", color: "blue" }}
          >
            {row.original.vehicleNumber}
          </span>
        ),
      },
      {
        Header: "Deonar_Vehicle_Type",
        accessor: "vehicleType",
      },

      {
        Header: "Deonar_Parking_Time",
        accessor: "parkingTime",
      },
      {
        Header: "Deonar_Parking_Date",
        accessor: "parkingDate",
      },
    ];
  }

  if (tableType === "slaughter") {
    return [
      {
        Header: "ID",
        accessor: "id",
        Cell: ({ row }) => row.index + 1,
        getHeaderProps: (column) => ({
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        }),
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
  }

  if (tableType === "trading") {
    return [
      {
        Header: "ID",
        accessor: "id",
        Cell: ({ row }) => row.index + 1,
        isVisible: false,
      },
      {
        Header: "DEONAR_ARRIVAL_UUID",
        accessor: "entryUnitId",
        Cell: ({ row }) => (
          <span onClick={() => handleUUIDClick(row.original.entryUnitId)} style={{ cursor: "pointer", color: "blue" }}>
            {row.original.entryUnitId}
          </span>
        ),
      },
      {
        Header: "DEONAR_TRADER_NAME",
        accessor: "traderName",
      },
      {
        Header: "DEONAR_LICENSE_NUMBER",
        accessor: "licenceNumber",
      },
      {
        Header: "ARRIVAL_DATE_FIELD",
        accessor: "dateOfArrival",
      },
      {
        Header: "ARRIVAL_TIME_FIELD",
        accessor: "timeOfArrival",
      },
    ];
  }

  if (tableType === "removal") {
    return [
      {
        Header: "ID",
        accessor: "id",
        Cell: ({ row }) => row.index + 1,
        isVisible: false,
      },
      {
        Header: "DEONAR_ARRIVAL_UUID",
        accessor: "entryUnitId",
        Cell: ({ row }) => (
          <span onClick={() => handleUUIDClick(row.original.entryUnitId)} style={{ cursor: "pointer", color: "blue" }}>
            {row.original.entryUnitId}
          </span>
        ),
      },
      // {
      //   Header: "DEONAR_ARRIVAL_UUID",
      //   accessor: "arrivalId",
      // },
      {
        Header: "DEONAR_TRADER_NAME",
        accessor: "traderName",
      },
      {
        Header: "DEONAR_LICENSE_NUMBER",
        accessor: "licenceNumber",
      },
      {
        Header: "ARRIVAL_DATE_FIELD",
        accessor: "dateOfArrival",
      },
      {
        Header: "ARRIVAL_TIME_FIELD",
        accessor: "timeOfArrival",
      },
    ];
  }

  if (tableType === "penalty") {
    return [
      {
        Header: "ID",
        accessor: "id",
        Cell: ({ row }) => row.index + 1,
        isVisible: false,
      },
      {
        Header: "Deonar_Penalty_Reference",
        accessor: "penaltyReference",
        Cell: ({ row }) => (
          <span onClick={() => handleUUIDClick(row.original.penaltyReference)} style={{ cursor: "pointer", color: "blue" }}>
            {row.original.penaltyReference}
          </span>
        ),
      },
      // {
      //   Header: "DEONAR_Penalty_Unit",
      //   accessor: "unit",
      // },
      {
        Header: "DEONAR_StakeHolder_NAME",
        accessor: "stakeholderName",
      },
      {
        Header: "DEONAR_LICENSE_NUMBER",
        accessor: "licenceNumber",
      },
      // {
      //   Header: "ARRIVAL_Penalty_Amount",
      //   accessor: "amount",
      // },
    ];
  }
  if (tableType === "weighing") {
    return [
      {
        Header: "ID",
        accessor: "id",
        Cell: ({ row }) => row.index + 1,
        getHeaderProps: (column) => ({
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        }),
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
  }

  return baseColumns;
};

export function generateDynamicData(length, startId = 1) {
  const traderNames = [
    "John Doe",
    "Jane Smith",
    "Mohammed Ali",
    "Sophia Wilson",
    "David Lee",
    "Emily Johnson",
    "Michael Brown",
    "Sarah Davis",
    "James Clark",
    "Mary Evans",
  ];
  const stakeholderTypes = ["Trader", "Owner", "Broker", "Agent"];

  const randomDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    return date.toISOString().split("T")[0]; // Format to YYYY-MM-DD
  };

  const randomTime = () => {
    const hours = Math.floor(Math.random() * 12) + 1;
    const minutes = Math.floor(Math.random() * 60);
    const ampm = Math.random() > 0.5 ? "AM" : "PM";
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes} ${ampm}`;
  };

  return Array.from({ length }, (_, i) => ({
    id: startId + i,
    entryUnitId: `UUID-${Math.floor(1000 + Math.random() * 9000)}`,
    traderName: traderNames[Math.floor(Math.random() * traderNames.length)],
    licenceNumber: `LIC-${Math.floor(1000 + Math.random() * 9000)}`,
    vehicleNumber: `MH${Math.floor(10 + Math.random() * 90)}${["AB", "CD", "EF", "GH"][Math.floor(Math.random() * 4)]}${Math.floor(
      1000 + Math.random() * 9000
    )}`,
    dateOfArrival: randomDate(),
    timeOfArrival: randomTime(),
    importPermission: `IMP-${Math.floor(1000 + Math.random() * 9000)}`,
    stakeholderTypeName: stakeholderTypes[Math.floor(Math.random() * stakeholderTypes.length)],
  }));
}

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// const AnimalDetailsCell = ({ row }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const handleChipClick = () => {
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   const animalDetails = row.original.animalDetails;

//   return (
//     <div>
//       {/* Display single clickable chip */}
//       <CustomChip
//         text="View"
//         onClick={handleChipClick}
//         style={{ cursor: 'pointer', backgroundColor: '#d1e7dd', color: '#0f5132' }}
//       />

//       {/* Modal to show animal details as chips */}
//       <CustomModal isOpen={isModalOpen} onClose={handleCloseModal} title={'Animal Details'}>
//         <div className="animal-details-chips">
//           {animalDetails && animalDetails.length > 0 ? (
//             animalDetails.map((animal, index) => (
//               <CustomChip
//                 key={index}
//                 text={`${animal.animalType}: ${animal.count}`}
//                 style={{ backgroundColor: '#e0f7fa', color: '#00695c', margin: '5px' }}
//               />
//             ))
//           ) : (
//             <p>No animal details available</p>
//           )}
//         </div>
//       </CustomModal>
//     </div>
//   );
// };

export const visibleColumns = [
  { Header: "Animal Type", accessor: "animalType" },
  { Header: "Animal Token", accessor: "count" },
  {
    accessor: "animalDetails",
    Header: "Gawal Details",
    Cell: ({ row }) => <GenericAddRow />,
  },

  // {
  //   Header: "Actions",
  //   accessor: "action",
  //   Cell: ({ row }) => (
  //     <span onClick={() => handleUUIDClick(row.original.employeeCode)} style={{ cursor: "pointer", color: "blue" }}>
  //       <RemoveIcon />
  //     </span>
  //   ),
  // },
];

export const generateTokenNumber = (animalName, index) => {
  const prefix = animalName?.substring(0, 2).toUpperCase();
  const tokenNumber = `${prefix}${String(index).padStart(3, "0")}`;
  return tokenNumber;
};

const paymentMethodOptions = [
  { label: "Cash", value: "Cash" },
  { label: "Card", value: "Card" },
  { label: "UPI", value: "UPI" },
];

export const feeConfigs = {
  arrival: {
    fields: [
      { type: "dropdown", label: "Payment Mode", name: "paymentMethod", required: false },
      { type: "input", label: "Reference Number", name: "transactionId", required: false },
    ],
    options: {
      paymentMethod: paymentMethodOptions,
    },
  },
  stabling: {
    fields: [
      { type: "dropdown", label: "Payment Mode", name: "paymentMethod", required: false },
      { type: "input", label: "Reference Number", name: "transactionId", required: false },
    ],
    options: {
      paymentMethod: paymentMethodOptions,
    },
  },
  trading: {
    fields: [
      { type: "dropdown", label: "Payment Mode", name: "paymentMethod", required: false },
      { type: "input", label: "Reference Number", name: "transactionId", required: false },
    ],
    options: {
      paymentMethod: paymentMethodOptions,
    },
  },
  removal: {
    fields: [
      { type: "dropdown", label: "Payment Mode", name: "paymentMethod", required: false },
      { type: "input", label: "Reference Number", name: "transactionId", required: false },
    ],
    options: {
      paymentMethod: paymentMethodOptions,
    },
  },
  slaughter: {
    fields: [
      // { type: "dropdown", label: "Slaughter Type", name: "slaughterType", required: false },
      // { type: "dropdown", label: "Slaughter Unit", name: "slaughterUnit", required: false },
      // { type: "input", label: "Number of Animals", name: "numberOfAnimals", required: false },
      { type: "dropdown", label: "Payment Mode", name: "paymentMethod", required: false },
      { type: "input", label: "Reference Number", name: "transactionId", required: false },
    ],
    options: {
      paymentMethod: paymentMethodOptions,
      slaughterUnit: [
        { label: "Slaughter Unit 1", value: "SU1" },
        { label: "Slaughter Unit 2", value: "SU2" },
        { label: "Slaughter Unit 3", value: "SU3" },
      ],
      slaughterType: [
        { label: "Slaughter Type 1", value: "ST1" },
        { label: "Slaughter Type 2", value: "ST2" },
        { label: "Slaughter Type 3", value: "ST3" },
      ],
    },
  },
  washing: {
    fields: [
      { type: "dropdown", label: "Payment Mode", name: "paymentMethod", required: false },
      { type: "input", label: "Reference Number", name: "transactionId", required: false },
    ],
    options: {
      paymentMethod: paymentMethodOptions,
    },
  },
  parking: {
    fields: [
      // { type: "input", label: "Deonar Parking Amount", name: "parkingAmount", required: false },
      { type: "dropdown", label: "Payment Mode", name: "paymentMethod", required: false },
      { type: "input", label: "Reference Number", name: "transactionId", required: false },
    ],
    options: {
      paymentMethod: paymentMethodOptions,
    },
  },
  weighing: {
    fields: [
      { type: "dropdown", label: "Deonar type of Animal", name: "weighingType", required: false },
      { type: "input", label: "Deonar carcass weight", name: "days", required: false },
      { type: "input", label: "Deonar Kena Weight", name: "days", required: false },
      { type: "dropdown", label: "Deonar payment mode", name: "paymentMode", required: false },
      { type: "input", label: "Enter Amount", name: "feePerDay", required: false },
      { type: "input", label: "Reference Number", name: "transactionId", required: false },
    ],
    options: {
      stablingType: paymentMethodOptions,
    },
  },
  penalty: {
    fields: [
      { type: "dropdown", label: "Payment Mode", name: "paymentMethod", required: false },
      { type: "input", label: "Reference Number", name: "transactionId", required: false },
    ],
    options: {
      paymentMethod: paymentMethodOptions,
    },
  },
  // Add configurations for other fee types here
};

export const collectionDynamicColumns = {
  arrival: [
    {
      Header: "Animal Type",
      accessor: "animalType",
      disableSortBy: true,
    },
    {
      Header: "Animal Count",
      accessor: "animalCount",
      disableSortBy: true,
    },
    {
      Header: "Animal Fee",
      accessor: "animalFee",
      disableSortBy: true,
    },
    {
      Header: "Animal Total Fee",
      accessor: "totalFee",
      disableSortBy: true,
    },
  ],
  stabling: [
    {
      Header: "Animal Type",
      accessor: "animalType",
      disableSortBy: true,
    },
    {
      Header: "Animal Count",
      accessor: "animalCount",
      disableSortBy: true,
    },
    {
      Header: "Stabling Fee",
      accessor: "animalFee",
      disableSortBy: true,
    },
    {
      Header: "Total Stabling Fee",
      accessor: "totalFee",
      disableSortBy: true,
    },
  ],
  washing: [
    {
      Header: "Vehicle Number",
      accessor: "vehiclenumber",
      disableSortBy: true,
    },
    {
      Header: "Vehicle Type",
      accessor: "vehicletype",
      disableSortBy: true,
    },
    {
      Header: "Total Washing Fee",
      accessor: "total",
      disableSortBy: true,
    },
  ],
  parking: [
    {
      Header: "Vehicle Number",
      accessor: "vehiclenumber",
      disableSortBy: true,
    },
    {
      Header: "Vehicle Type",
      accessor: "vehicletype",
      disableSortBy: true,
    },
    {
      Header: "Parking Date",
      accessor: "parkingdate",
      disableSortBy: true,
    },
    {
      Header: "Parking Time",
      accessor: "parkingtime",
      disableSortBy: true,
    },
    {
      Header: "Departure Date",
      accessor: "departuredate",
      disableSortBy: true,
    },
    {
      Header: "Departure Time",
      accessor: "departuretime",
      disableSortBy: true,
    },
    {
      Header: "Total Hours",
      accessor: "totalhours",
      disableSortBy: true,
    },
    // {
    //   Header: "Total Parking Fee",
    //   accessor: "total",
    //   disableSortBy: true,
    // },
  ],
  slaughter: [
    {
      Header: "Animal",
      accessor: "animalType",
      disableSortBy: true,
    },
    {
      Header: "Animal Count",
      accessor: "animalCount",
      disableSortBy: true,
    },
    {
      Header: "Slaughter Fee",
      accessor: "animalFee",
      disableSortBy: true,
    },
    {
      Header: "Total Slaughter Fee",
      accessor: "totalFee",
      disableSortBy: true,
    },
  ],
  removal: [
    {
      Header: "Animal Type",
      accessor: "animalType",
      disableSortBy: true,
    },
    {
      Header: "Animal Count",
      accessor: "animalCount",
      disableSortBy: true,
    },
    {
      Header: "Removal Fee",
      accessor: "animalFee",
      disableSortBy: true,
    },
    {
      Header: "Removal Total Fee",
      accessor: "totalFee",
      disableSortBy: true,
    },
  ],
  trading: [
    {
      Header: "Animal Type",
      accessor: "animalType",
      disableSortBy: true,
    },
    {
      Header: "Animal Count",
      accessor: "animalCount",
      disableSortBy: true,
    },
    {
      Header: "Animal Fee",
      accessor: "animalFee",
      disableSortBy: true,
    },
    {
      Header: "Animal Total Fee",
      accessor: "totalFee",
      disableSortBy: true,
    },
  ],
  penalty: [
    {
      Header: "DEONAR_Penalty_Unit",
      accessor: "unit",
    },
    {
      Header: "ARRIVAL_Penalty_Amount",
      accessor: "total",
    },
  ],
  // Add other fee types as needed
};

export const toastMessages = {
  arrival: {
    success: "Entry Collection Fee saved successfully!",
    error: "Failed to save Entry Collection Fee.",
  },
  stabling: {
    success: "Stabling Fee saved successfully!",
    error: "Failed to save Stabling Fee.",
  },
  trading: {
    success: "Trading Fee saved successfully!",
    error: "Failed to save Trading Fee.",
  },
  removal: {
    success: "Removal Collection Fee saved successfully!",
    error: "Failed to save Removal Collection Fee.",
  },
  slaughter: {
    success: "Slaughter Recovery Fee saved successfully!",
    error: "Failed to save Slaughter Recovery Fee.",
  },
  washing: {
    success: "Vehicle Washing Fee saved successfully!",
    error: "Failed to save Vehicle Washing Fee.",
  },
  parking: {
    success: "Parking Fee saved successfully!",
    error: "Failed to save Parking Fee.",
  },
  weighing: {
    success: "Weighing Charge saved successfully!",
    error: "Failed to save Weighing Charge.",
  },
  penalty: {
    success: "Penalty Charge saved successfully!",
    error: "Failed to save Penalty Charge.",
  },
};
