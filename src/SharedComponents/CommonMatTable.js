import React, { useEffect } from "react";
import "../Styles/CommonMatTable.css";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Paper } from "@mui/material";

const CommonMatTable = ({
  columns,
  data,
  renderTopToolbar,
  isLoading,
  renderDetailPanel,
  enableExpanding = false,
  onRowClick,
  selectedRowId = null,
}) => {
  const [primaryColor, setPrimaryColor] = React.useState("#1976d2"); // Default to MUI blue
  useEffect(() => {
    const configStr = localStorage.getItem("school_config");
    if (configStr) {
      try {
        const parsedConfig = JSON.parse(configStr);
        setPrimaryColor(parsedConfig.primary_color || "#1976d2");
      } catch (error) {
        console.error("Error parsing school_config from localStorage:", error);
      }
    }
  }, []);
  const table = useMaterialReactTable({
    columns,
    data,
    state: {
      isLoading: isLoading,
    },
    enableExpanding: enableExpanding,
    renderDetailPanel,
    columnFilterDisplayMode: "popover",
    paginationDisplayMode: "pages",
    enableFullScreenToggle: false,
    renderTopToolbarCustomActions: renderTopToolbar,
    muiTableHeadCellProps: {
      sx: {
        fontWeight: "bold",
        fontSize: "14px",
        border: "1px solid #e0e0e0",
        backgroundColor: "#f0f0f0",
      },
    },

    muiTableBodyCellProps: {
      sx: {
        border: "1px solid #e0e0e0",
      },
    },

    muiTopToolbarProps: {
      sx: {
        background: `linear-gradient(90deg, ${primaryColor}, ${primaryColor}99)`,
        padding: "8px 16px",
        color: "white",
        "& .MuiButton-root": { color: "white !important" },
        "& .MuiSvgIcon-root": { color: "white !important" },
        "& .MuiInputBase-input": { color: "white !important" },
      },
    },

    muiTableBodyRowProps: ({ row }) => {
      // Function to generate random light color
      const getRandomLightColor = () => {
        const r = Math.floor(200 + Math.random() * 55); // 200-255
        const g = Math.floor(200 + Math.random() * 55);
        const b = Math.floor(200 + Math.random() * 55);
        return `rgb(${r}, ${g}, ${b})`;
      };

      const rowId = row.original?.id ?? `${row.original?.grade_id ?? row.original?.grade}-${row.original?.section_id ?? row.original?.section}`;
      const isSelected = selectedRowId != null && String(rowId) === String(selectedRowId);

      return {
        sx: {
          cursor: onRowClick ? "pointer" : "auto",
          backgroundColor: isSelected
            ? "#dcedc8" // selected light green
            : row.index % 2 === 1
            ? "#ffffff"
            : getRandomLightColor(),
          boxShadow: isSelected ? "inset 0 0 0 2px rgba(76,175,80,0.12)" : undefined,
          "&:hover": {
            backgroundColor: isSelected ? "#c5e1a5" : "#e3f2fd",
            transition: "background-color 0.2s ease-in-out",
          },
        },
        onClick: () => {
          if (onRowClick) onRowClick(row.original);
        },
        "aria-selected": isSelected,
      };
    },


  });
return (
<Paper
  elevation={3}
  sx={{
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #e0e0e0",
    transition: "box-shadow 0.3s ease-in-out",
    "&:hover": {
      boxShadow: "0 8px 30px rgba(25, 118, 210, 0.4)", // blue shadow
    },
    // apply styles to table cells
    "& .MuiTableCell-root": {
      transition: "transform 0.15s ease, box-shadow 0.15s ease",
    },
    "&:hover .MuiTableCell-root": {
      //transform: "scale(1.05)", // smooth zoom effect
      boxShadow: "0 2px 8px rgba(25, 118, 210, 0.15)", // subtle blue glow
    },
  }}
>
  <MaterialReactTable table={table} />
</Paper>
);


};

export default CommonMatTable;
