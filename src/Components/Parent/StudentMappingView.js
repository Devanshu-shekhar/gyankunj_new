import React, { useState, useMemo, useEffect } from "react";
import { Box, Button } from "@mui/material";
import { fetchMappedStudentRoutes, getAllRoutesList } from "../../ApiClient";
import CreateStudentRouteMapping from "./CreateStudentRouteMapping";
import CommonMatTable from "../../SharedComponents/CommonMatTable";

const StudentMappingView = () => {
  const [studentRoutesList, setStudentRoutesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddRoutesModalVisible, setIsAddRoutesModalVisible] = useState(false);
  const [refreshTable, setRefreshTable] = useState(false);
  const [routesList, setRoutesList] = useState();
  const [selectedDataToEdit, setSelectedDataToEdit] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetchMappedStudentRoutes()
      .then((res) => {
        setStudentRoutesList([]);
        if (res?.data?.student_routes_data?.length > 0) {
          setStudentRoutesList(res?.data?.student_routes_data);
        }
        setTimeout(() => setIsLoading(false), 1000);
      })
      .catch((err) => {
        setIsLoading(false);
        console.error(err);
      });
  }, [refreshTable]);

  useEffect(() => {
    getAllRoutesList()
      .then((res) => {
        setRoutesList([]);
        if (res?.data?.routes_data?.length > 0) {
          setRoutesList(res?.data?.routes_data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleClose = (isSubmit) => {
    setIsAddRoutesModalVisible(false);
    if (isSubmit) {
      setTimeout(() => setRefreshTable(!refreshTable), 500);
    }
  };

  // Columns definition for the main table
  const columns = useMemo(
    () => [{ accessorKey: "route_name", header: "Route Name" }],
    []
  );

  // Detail panel renderer for subrows
  const renderDetailPanel = ({ row }) => {
    const subRows = row.original.route_student_info;

    return (
      <table className="table table-bordered w-100">
        <thead>
          <tr>
            <th style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
              Stop Name
            </th>
            <th style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
              Student Details
            </th>
          </tr>
        </thead>
        <tbody>
          {subRows.map((stop) => (
            <tr key={stop.stop_point_id}>
              <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                {stop.stop_point_name}
              </td>
              <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                <ul>
                  {stop.student_ids.map((user) => (
                    <li key={user.student_id}>
                      <span>
                        {user.student_name}
                        {" - "}
                        {user.student_id}
                      </span>
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

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
        data={studentRoutesList || []}
        renderTopToolbar={() => (
          <h1 style={{ fontSize: 18, marginTop: 10 }}>Students Route</h1>
        )}
        renderDetailPanel={renderDetailPanel}
      />
      {isAddRoutesModalVisible && (
        <CreateStudentRouteMapping
          isOpen={isAddRoutesModalVisible}
          handleClose={handleClose}
          routesList={routesList}
          initialData={selectedDataToEdit}
        />
      )}
    </>
  );
};

export default StudentMappingView;
