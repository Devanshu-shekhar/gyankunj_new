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
  enableExpanding = false
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

      return {
        sx: {
          backgroundColor: row.index % 2 === 1 ? "#ffffff" : getRandomLightColor(),
          "&:hover": {
            backgroundColor: "#e3f2fd",
            transition: "background-color 0.2s ease-in-out",
          },
        },
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
      }}
    >
      <MaterialReactTable table={table} />
    </Paper>
  );
};

export default CommonMatTable;
