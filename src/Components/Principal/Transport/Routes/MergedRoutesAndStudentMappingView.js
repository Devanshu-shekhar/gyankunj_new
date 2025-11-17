import React, { useEffect, useMemo, useState } from "react";
import {
  evaluateStudentRouteRequest,
  fetchAllStudentsMetadata,
  fetchMappedStudentRoutes,
  getAllRoutesList,
} from "../../../../ApiClient";
import CommonMatTable from "../../../../SharedComponents/CommonMatTable";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import CreateRoutes from "./CreateRoutes";
import { showAlertMessage } from "../../../AlertMessage";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CreateStudentRouteMapping from "../Mappings/CreateStudentRouteMapping";

/**
 * MergedRoutesAndStudentMappingView
 *
 * Single page that shows routes (routes_data) and student mappings (student_routes_data)
 * in one table. Each row = route. Expanded detail contains:
 *   - Stop Points table (stop_order, stop_point_name, route_charge)
 *   - Student mapping under each stop (student list + approve/reject controls)
 *
 * Merge strategy:
 *   1) Try to match by route_id between routes_data and student_routes_data
 *   2) If no match, fallback to index-based merging (since API alignment confirmed)
 */
const MergedRoutesAndStudentMappingView = () => {
  const [mergedData, setMergedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTable, setRefreshTable] = useState(false);

  // modals
  const [isAddRoutesModalVisible, setIsAddRoutesModalVisible] = useState(false);
  const [isAddStudentRoutesModalVisible, setIsAddStudentRoutesModalVisible] =
    useState(false);

  // auxiliary lists (used by CreateStudentRouteMapping)
  const [studentList, setStudentList] = useState([]);
  const [routesList, setRoutesList] = useState([]);

  // selected edit data placeholder (if you want to reuse)
  const [selectedDataToEdit, setSelectedDataToEdit] = useState();

  // alerts + confirmation dialog state
  const [showAlert, setShowAlert] = useState("");
  const [confirmationDialog, setConfirmationDialog] = useState({
    open: false,
    route_id: null,
    stop_point_id: null,
    student_id: null,
    is_assigned: null,
  });

  // Fetch routes + mapped students + students metadata in parallel and merge
  useEffect(() => {
    async function loadAll() {
      setIsLoading(true);
      try {
        const [routesRes, mappedRes, studentsRes] = await Promise.all([
          getAllRoutesList(),
          fetchMappedStudentRoutes(),
          fetchAllStudentsMetadata(),
        ]);

        const routesData = routesRes?.data?.routes_data || [];
        const studentRoutesData = mappedRes?.data?.student_routes_data || [];
        const studentsData = studentsRes?.data?.students_data || [];

        setRoutesList(routesData);
        setStudentList(studentsData);

        const merged = mergeRoutesAndStudents(routesData, studentRoutesData);
        setMergedData(merged);
      } catch (err) {
        console.error("Error loading route/student data:", err);
      } finally {
        // small UX delay similar to your components
        setTimeout(() => setIsLoading(false), 500);
      }
    }

    loadAll();
  }, [refreshTable]);

  // Merge function:
  // - prefer matching by route_id
  // - fallback to index alignment if not found
  const mergeRoutesAndStudents = (routesData = [], studentRoutesData = []) => {
    return routesData.map((route, idx) => {
      // find by route_id first
      let studentRoute = studentRoutesData.find(
        (sr) => sr.route_id === route.route_id
      );

      // fallback to index alignment when no route_id match (based on your "3" confirmation)
      if (!studentRoute && studentRoutesData[idx]) {
        studentRoute = studentRoutesData[idx];
      }

      // Create mergedStops: each stop from routes' stop_points_data,
      // attach student_ids if present in studentRoute.route_student_info.
      const mergedStops = (route.stop_points_data || []).map((stop, sIdx) => {
        // try matching by stop_point_id
        let studentStop =
          studentRoute?.route_student_info?.find(
            (st) => st.stop_point_id === stop.stop_point_id
          ) ?? null;

        // fallback to matching by stop name if id match not found
        if (!studentStop) {
          studentStop =
            studentRoute?.route_student_info?.find(
              (st) =>
                st.stop_point_name &&
                stop.stop_point_name &&
                st.stop_point_name.trim().toLowerCase() ===
                  stop.stop_point_name.trim().toLowerCase()
            ) ?? null;
        }

        // final fallback: index-alignment within the route stops
        if (!studentStop && studentRoute?.route_student_info?.[sIdx]) {
          studentStop = studentRoute.route_student_info[sIdx];
        }

        return {
          ...stop,
          student_ids: studentStop?.student_ids || [],
          // keep original stop mapping name from studentRoute if route stop name is missing
          mapped_stop_point_name:
            stop.stop_point_name || studentStop?.stop_point_name || "",
        };
      });

      return {
        ...route,
        mergedStops,
        // keep original studentRoute info for other operations if needed
        _raw_student_route_info: studentRoute || null,
      };
    });
  };

  // Close handlers for modals
  const handleCloseRoutesModal = (isSubmit) => {
    setIsAddRoutesModalVisible(false);
    if (isSubmit) setTimeout(() => setRefreshTable((p) => !p), 400);
  };
  const handleCloseStudentRoutesModal = (isSubmit) => {
    setIsAddStudentRoutesModalVisible(false);
    if (isSubmit) setTimeout(() => setRefreshTable((p) => !p), 400);
  };

  // Confirm dialog actions
  const openConfirmationDialog = (
    route_id,
    stop_point_id,
    student_id,
    is_assigned
  ) => {
    setConfirmationDialog({
      open: true,
      route_id,
      stop_point_id,
      student_id,
      is_assigned,
    });
  };

  const closeConfirmationDialog = () => {
    setConfirmationDialog({
      open: false,
      route_id: null,
      stop_point_id: null,
      student_id: null,
      is_assigned: null,
    });
  };

  const takeActionOnRoute = async () => {
    // build payload (exclude 'open')
    const payload = {
      route_id: confirmationDialog.route_id,
      stop_point_id: confirmationDialog.stop_point_id,
      student_id: confirmationDialog.student_id,
      is_assigned: confirmationDialog.is_assigned,
    };

    try {
      const res = await evaluateStudentRouteRequest(payload);
      if (res?.data?.status === "success") {
        setShowAlert("success");
      } else {
        setShowAlert("error");
      }
      setTimeout(() => setShowAlert(""), 2000);
      setRefreshTable((p) => !p);
    } catch (err) {
      console.error("evaluateStudentRouteRequest error:", err);
      setShowAlert("error");
      setTimeout(() => setShowAlert(""), 3000);
    } finally {
      closeConfirmationDialog();
    }
  };

  // Table column definitions (merged)
  const columns = useMemo(
    () => [
      { accessorKey: "route_name", header: "Route Name" },
      { accessorKey: "start_point_name", header: "Start Point" },
    ],
    []
  );

  // Detail panel rendering: show stops table + students list per stop
 const renderDetailPanel = ({ row }) => {
  const stops = row.original.mergedStops || [];

  return (
    <div style={{ padding: "12px 0" }}>
      <table className="table table-bordered w-100">
        <thead>
          <tr>
            <th style={{ padding: "8px" }}>Stop Order</th>
            <th style={{ padding: "8px" }}>Stop Name</th>
            <th style={{ padding: "8px" }}>Charge</th>
            <th style={{ padding: "8px" }}>Students</th>
          </tr>
        </thead>

        <tbody>
          {stops.map((stop) => (
            <tr key={stop.stop_point_id ?? stop.stop_point_name}>
              <td style={{ padding: "8px" }}>
                {stop.stop_order ?? "-"}
              </td>

              <td style={{ padding: "8px" }}>
                {stop.stop_point_name || stop.mapped_stop_point_name}
              </td>

              <td style={{ padding: "8px" }}>
                {stop.route_charge ?? "-"}
              </td>

              <td style={{ padding: "8px" }}>
                {stop.student_ids?.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: 16 }}>
                    {stop.student_ids.map((stu) => (
                      <li
                        key={stu.student_id}
                        style={{
                          marginBottom: 6,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}
                      >
                        {/* Student name/id */}
                        <div>
                          <strong>{stu.student_name ?? "Unknown"}</strong>{" "}
                          -{" "}
                          <span style={{ fontFamily: "monospace" }}>
                            {stu.student_id}
                          </span>
                        </div>

                        {/* Approve / Reject icons */}
                        {stu.to_be_reviewed && (
                          <div style={{ display: "flex", gap: 8 }}>
                            <CheckRoundedIcon
                              className="cursor"
                              color="success"
                              onClick={() =>
                                openConfirmationDialog(
                                  row.original.route_id,
                                  stop.stop_point_id,
                                  stu.student_id,
                                  true
                                )
                              }
                              style={{ cursor: "pointer" }}
                            />
                            <CloseRoundedIcon
                              className="cursor"
                              color="error"
                              onClick={() =>
                                openConfirmationDialog(
                                  row.original.route_id,
                                  stop.stop_point_id,
                                  stu.student_id,
                                  false
                                )
                              }
                              style={{ cursor: "pointer" }}
                            />
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <i>No students mapped</i>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

  // Top toolbar with both buttons
  const RenderTopToolbarCustomActions = () => (
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
        onClick={() => setIsAddRoutesModalVisible(true)}
      >
        Configure Routes
      </Button>

      <Button
        variant="contained"
        onClick={() => setIsAddStudentRoutesModalVisible(true)}
      >
        Configure Students Route
      </Button>
    </Box>
  );

  return (
    <>
      <RenderTopToolbarCustomActions />

      <CommonMatTable
        columns={columns}
        isLoading={isLoading}
        enableExpanding={true}
        data={mergedData || []}
        renderTopToolbar={() => (
          <h1 style={{ fontSize: 18, marginTop: 10 }}>
            Routes & Student Mapping
          </h1>
        )}
        renderDetailPanel={renderDetailPanel}
      />

      {/* Modals */}
      {isAddRoutesModalVisible && (
        <CreateRoutes
          isOpen={isAddRoutesModalVisible}
          handleClose={handleCloseRoutesModal}
          initialData={routesList}
        />
      )}

      {isAddStudentRoutesModalVisible && (
        <CreateStudentRouteMapping
          isOpen={isAddStudentRoutesModalVisible}
          handleClose={handleCloseStudentRoutesModal}
          routesList={routesList}
          studentList={studentList}
          initialData={selectedDataToEdit}
        />
      )}

      {/* Alert toaster call (same behavior as previous) */}
      {showAlert &&
        showAlertMessage({
          open: true,
          alertFor: showAlert,
          message: `Evaluation student route ${
            showAlert === "success" ? "succeeded" : "failed"
          }.`,
        })}

      {/* Confirmation dialog for approve/reject */}
      <Dialog open={confirmationDialog.open} onClose={closeConfirmationDialog}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to{" "}
            {confirmationDialog.is_assigned ? "approve" : "reject"} this route
            application?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmationDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={takeActionOnRoute}
            color={confirmationDialog.is_assigned ? "success" : "error"}
          >
            {confirmationDialog.is_assigned ? "Approve" : "Reject"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MergedRoutesAndStudentMappingView;