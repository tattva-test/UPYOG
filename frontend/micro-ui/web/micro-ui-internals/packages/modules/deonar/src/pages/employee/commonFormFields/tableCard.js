import React from "react";
import { Card } from "@upyog/digit-ui-react-components";

const TableCard = ({ data, fields, onUUIDClick }) => {
  return (
    <Card
      style={{
        padding: "16px",
        margin: "16px 0",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: "20px",
        justifyContent: "space-between",
      }}
    >
      {fields.map((field) => (
        <div key={field.key} style={{ marginBottom: "8px" }}>
          <strong>{field.label}:</strong>{" "}
          {field.isClickable && data[field.key] ? (
            <span
              onClick={() => onUUIDClick && onUUIDClick(data[field.key])}
              style={{
                color: "blue",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              {data[field.key] || "N/A"}
            </span>
          ) : (
            <span>{data[field.key] || "N/A"}</span>
          )}
        </div>
      ))}
    </Card>
  );
};

export default TableCard;
