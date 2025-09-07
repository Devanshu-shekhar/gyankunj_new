import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Slide,
} from "@mui/material";
import {
  deleteFeesStructure,
  fetchFeesMetadata,
  fetchFeesStructuresList,
  getGradeDetails,
} from "../../../../ApiClient";
import CommonMatTable from "../../../../SharedComponents/CommonMatTable";
import { Delete, MoreVert } from "@mui/icons-material";
import CreateFeesStructure from "./CreateFeesStructure";
import { showAlertMessage } from "../../../AlertMessage";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FeesStructureView = () => {
  const [metadata, setMetadata] = useState({
    feeTypes: {},
    feeFrequencies: {},
    feeOccurrences: {},
    grades: {},
  });
  const [feesStructuresList, setFeesStructuresList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFeesStructureId, setSelectedFeesStructureId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRowId, setMenuRowId] = useState(null);
  const [refreshTable, setRefreshTable] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const fetchAndSetMetadata = async () => {
    try {
      const metadataResponse = await fetchFeesMetadata();
      const gradeResponse = await getGradeDetails();

      const parseListToMap = (list, idKey, valueKey) =>
        list.reduce((map, item) => {
          map[item[idKey]] = item[valueKey];
          return map;
        }, {});

      setMetadata({
        feeTypes: parseListToMap(
          metadataResponse?.data?.fee_types || [],
          "fee_type_id",
          "fee_type_name"
        ),
        feeFrequencies: parseListToMap(
          metadataResponse?.data?.fee_frequency || [],
          "fee_frequency_id",
          "fee_frequency_name"
        ),
        feeOccurrences: parseListToMap(
          metadataResponse?.data?.fee_occurrences || [],
          "fee_occurrence_id",
          "fee_occurrence_name"
        ),
        grades: parseListToMap(
          gradeResponse?.data?.grade_details?.grade_details || [],
          "grade_id",
          "grade"
        ),
      });
    } catch (err) {
      console.error("Failed to fetch metadata:", err);
    }
  };

  const fetchAndSetFeesStructures = async () => {
    setIsLoading(true);
    try {
      const response = await fetchFeesStructuresList();
      setFeesStructuresList(response?.data?.fees_structure_info || []);
    } catch (err) {
      console.error("Failed to fetch fees structures:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetMetadata();
  }, []);

  useEffect(() => {
    fetchAndSetFeesStructures();
  }, [refreshTable]);

  const handleMenuOpen = useCallback((event, rowId) => {
    setAnchorEl(event.currentTarget);
    setMenuRowId(rowId);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
    setMenuRowId(null);
  }, []);

  const handleDeleteConfirmation = (id) => {
    handleMenuClose();
    setSelectedFeesStructureId(id);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteCancel = () => {
    setSelectedFeesStructureId(null);
    setShowDeleteConfirmation(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      const payload = {
        "fee_master_ids": selectedFeesStructureId
     }
      const response = await deleteFeesStructure(payload);
      if (response?.data?.status === "success") {
        setAlert({
          type: "success",
          message: "Fee structure deleted successfully.",
        });
        setTimeout(() => {
          setRefreshTable((prev) => !prev);
          handleDeleteCancel();
          setAlert({ type: "", message: "" });
        }, 2000);
      } else {
        setAlert({
          type: "error",
          message: response?.data?.message || "Something went wrong.",
        });
      }
    } catch (err) {
      console.error("Failed to delete fees structures:", err);
    }
  };

  const handleModalClose = (isSubmit) => {
    setIsModalVisible(false);
    setSelectedFeesStructureId(null);
    if (isSubmit) {
      setRefreshTable((prev) => !prev);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "fee_type_id",
        header: "Fee Type",
        Cell: ({ row }) => (
          <div className="d-flex align-items-center justify-content-between">
            <span>{metadata.feeTypes[row.original.fee_type_id] || "-"}</span>
            <IconButton onClick={(event) => handleMenuOpen(event, row.id)}>
              <MoreVert />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl) && menuRowId === row.id}
              onClose={handleMenuClose}
            >
              <MenuItem
                onClick={() =>
                  handleDeleteConfirmation(row.original.fee_master_ids)
                }
              >
                <Delete fontSize="small" sx={{ marginRight: 1 }} /> Delete
              </MenuItem>
            </Menu>
          </div>
        ),
      },
      {
        accessorKey: "grade_ids",
        header: "Grades",
        Cell: ({ row }) => (
          <div>
            {row.original.grade_ids?.map((id) => (
              <div key={id}>{metadata.grades[id] || "-"}</div>
            )) || "-"}
          </div>
        ),
      },
      {
        accessorKey: "fee_frequency_id",
        header: "Frequency",
        Cell: ({ row }) => (
          <span>
            {metadata.feeFrequencies[row.original.fee_frequency_id] || "-"}
          </span>
        ),
      },
      {
        accessorKey: "fee_occurrence_id",
        header: "Occurrence",
        Cell: ({ row }) => (
          <span>
            {metadata.feeOccurrences[row.original.fee_occurrence_id] || "-"}
          </span>
        ),
      },
      {
        accessorKey: "charge",
        header: "Charge",
      },
    ],
    [anchorEl, menuRowId, metadata]
  );

  return (
    <div>
      <Box
        sx={{ display: "flex", justifyContent: "flex-end", marginBottom: 1 }}
      >
        <Button variant="contained" onClick={() => setIsModalVisible(true)}>
          Create Fees Structure
        </Button>
      </Box>

      <CommonMatTable
        columns={columns}
        isLoading={isLoading}
        data={feesStructuresList}
        renderTopToolbar={() => (
          <h1 style={{ fontSize: 18, marginTop: 10 }}>Fees Structure</h1>
        )}
      />

      {/* Modal placeholder */}
      {isModalVisible && (
        <CreateFeesStructure
          isOpen={isModalVisible}
          handleClose={handleModalClose}
          metadata={metadata}
        />
      )}
      <Dialog
        open={showDeleteConfirmation}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleDeleteCancel}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Delete Confirmation"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
          Are you sure you want to delete this fees structure?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Alert Message */}
      {alert.type &&
        showAlertMessage({
          open: true,
          alertFor: alert.type,
          message: alert.message,
        })}
    </div>
  );
};

export default FeesStructureView;
