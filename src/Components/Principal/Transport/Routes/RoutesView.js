import React, { useState, useMemo, useEffect } from "react";
import { getAllRoutesList } from "../../../../ApiClient";
import CommonMatTable from "../../../../SharedComponents/CommonMatTable";
import { Box, Button } from "@mui/material";
import CreateRoutes from "./CreateRoutes";

const RoutesView = () => {
  const [routesList, setRoutesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddRoutesModalVisible, setIsAddRoutesModalVisible] = useState(false);
  const [refreshTable, setRefreshTable] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getAllRoutesList()
      .then((res) => {
        if (res?.data?.routes_data?.length > 0) {
          setRoutesList(res?.data?.routes_data);
        }
        setTimeout(() => setIsLoading(false), 1000);
      })
      .catch((err) => {
        setIsLoading(false);
        console.error(err);
      });
  }, [refreshTable]);

  const handleClose = (isSubmit) => {
    setIsAddRoutesModalVisible(false);
    if (isSubmit) {
      setTimeout(() => setRefreshTable(!refreshTable), 500);
    }
  };

  // Columns definition for the main table
  const columns = useMemo(
    () => [
      { accessorKey: "route_name", header: "Route Name" },
      { accessorKey: "start_point_name", header: "Start Point" },
    ],
    []
  );

  // Detail panel renderer for subrows
  const renderDetailPanel = ({ row }) => {
    const subRows = row.original.stop_points_data;

    return (
      <table className="table table-bordered w-100">
        <thead>
          <tr>
            <th style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
              Stop Order
            </th>
            <th style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
              Stop Name
            </th>
            <th style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
              Charge
            </th>
          </tr>
        </thead>
        <tbody>
          {subRows.map((stop) => (
            <tr key={stop.stop_point_id}>
              <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                {stop.stop_order}
              </td>
              <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                {stop.stop_point_name}
              </td>
              <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                {stop.route_charge}
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
        Configure Routes
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
        data={routesList || []}
        renderTopToolbar={() => (
          <h1 style={{ fontSize: 18, marginTop: 10 }}>Routes</h1>
        )}
        renderDetailPanel={renderDetailPanel}
      />
      {isAddRoutesModalVisible && (
        <CreateRoutes
          isOpen={isAddRoutesModalVisible}
          handleClose={handleClose}
          initialData={routesList}
        />
      )}
    </>
  );
};

export default RoutesView;
