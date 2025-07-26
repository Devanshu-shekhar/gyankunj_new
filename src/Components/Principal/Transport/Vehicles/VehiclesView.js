import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  getAllVehiclesList,
} from "../../../../ApiClient";
import CommonMatTable from "../../../../SharedComponents/CommonMatTable";
import CreateVehicle from "./CreateVehicle";
import { Delete, Edit, MoreVert } from "@mui/icons-material";

const VehiclesView = () => {
  const [vehiclesList, setVehiclesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [refreshTable, setRefreshTable] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRowId, setMenuRowId] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    getAllVehiclesList()
      .then((res) => {
        setVehiclesList([]);
        if (res?.data?.vehicles_data?.length > 0) {
          setVehiclesList(res.data.vehicles_data);
        }
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  }, [refreshTable]);

  const handleEdit = (rowData) => {
    setSelectedVehicle(rowData);
    setIsModalVisible(true);
    handleMenuClose();
  };

  const handleDelete = (rowData) => {
    setSelectedVehicle(rowData);
    handleMenuClose();
  };

  const handleMenuOpen = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setMenuRowId(rowId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRowId(null);
  };

  const handleClose = (isSubmit) => {
    setIsModalVisible(false);
    setSelectedVehicle(null);
    if (isSubmit) {
      setTimeout(() => {
        setRefreshTable(!refreshTable);
      }, 500);
    }
  };

  // Columns definition
  const columns = useMemo(
    () => [
      {
        accessorKey: "vehicle_owner",
        header: "Vehicle owner",
        Cell: ({ row }) => (
          <div className="align-items-center d-flex justify-content-between">
            <div className="text-truncate">{row.original.vehicle_owner}</div>
            <IconButton
              onClick={(event) =>
                handleMenuOpen(event, row.original.vehicle_id)
              }
            >
              <MoreVert />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl) && menuRowId === row.original.vehicle_id}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => handleEdit(row.original)}>
                <Edit fontSize="small" sx={{ marginRight: 1 }} /> Edit
              </MenuItem>
              <MenuItem
                className="disabled"
                onClick={() => handleDelete(row.original)}
              >
                <Delete fontSize="small" sx={{ marginRight: 1 }} /> Delete
              </MenuItem>
            </Menu>
          </div>
        ),
        size: 50,
      },
      { accessorKey: "vehicle_type", header: "Vehicle type" },
      {
        accessorKey: "vehicle_registration_number",
        header: "Registration number",
      },
      { accessorKey: "manufacturing_date", header: "Manufacturing date" },
      { accessorKey: "insurance_expiry_date", header: "Insurance expiry date" },
      { accessorKey: "pollution_expiry_date", header: "Pollution expiry date" },
    ],
    [anchorEl, menuRowId]
  );

  // Custom JSX element for the top toolbar
  const RenderTopToolbarCustomActions = () => {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          marginBottom: 2,
          justifyContent: "end",
        }}
      >
        <Button
          variant="contained"
          onClick={() => setIsModalVisible(true)}
        >
          Create Vehicle
        </Button>
      </Box>
    );
  };

  return (
    <>
      <RenderTopToolbarCustomActions />

      <CommonMatTable
        columns={columns}
        isLoading={isLoading}
        data={vehiclesList || []}
        renderTopToolbar={() => (
          <h1 style={{ fontSize: 18, marginTop: 10 }}>Vehicles</h1>
        )}
      />
      {isModalVisible && (
        <CreateVehicle
          isOpen={isModalVisible}
          handleClose={handleClose}
          initialData={selectedVehicle}
        />
      )}
    </>
  );
};

export default VehiclesView;
