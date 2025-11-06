// PropertyTransactionsTableURL.jsx
import React, { useState, useMemo, useEffect } from "react";
import {
  DataGrid,
  GridToolbar,
} from "@mui/x-data-grid";
import {
  Button,
  Stack,
  Box,
  Typography,
} from "@mui/material";

const PropertyTransactionsTableURL = ({ transactions = [] }) => {
  // ✅ State Management - Always initialize as empty array to prevent undefined/null
  const [selectedRows, setSelectedRows] = useState(() => []);
  const [filterText, setFilterText] = useState("");
  const [gridError, setGridError] = useState(false);

  // ✅ Derived Data
  const filteredTransactions = useMemo(() => {
    if (!filterText) return transactions;
    return transactions.filter((t) =>
      Object.values(t).some((value) =>
        String(value).toLowerCase().includes(filterText.toLowerCase())
      )
    );
  }, [transactions, filterText]);

  // ✅ Ensure rows always have stable string IDs
  const safeRows = useMemo(() => {
    return filteredTransactions.map((t, index) => ({
      ...t,
      id: String(t.id ?? t.transactionId ?? `row-${index}`),
    }));
  }, [filteredTransactions]);

  // ✅ Safe clean selection model (only valid existing IDs) - prevents currentSelection.ids is not iterable
  const cleanSelectionModel = useMemo(() => {
    // Ensure selectedRows is always an array - prevent undefined/null/non-iterable values
    const safeSelected = Array.isArray(selectedRows) ? selectedRows : [];

    // Ensure we have valid rows data
    if (!Array.isArray(safeRows) || safeRows.length === 0) {
      return []; // Return empty array if no data
    }

    // Create set of valid IDs that exist in current data
    const validIds = new Set(safeRows.map((r) => String(r.id)));

    // Filter selection to only include existing IDs
    const cleanSelection = safeSelected
      .filter((id) => id !== null && id !== undefined) // Remove null/undefined
      .map((id) => String(id)) // Ensure all IDs are strings
      .filter((id) => validIds.has(id)); // Only keep existing IDs

    return cleanSelection;
  }, [selectedRows, safeRows]);

  // ✅ Columns definition with manual selection checkbox
  const columns = [
    {
      field: "select",
      headerName: "Select",
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderHeader: () => (
        <input
          type="checkbox"
          checked={cleanSelectionModel.length > 0 && cleanSelectionModel.length === safeRows.length}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRows(safeRows.map(row => row.id));
            } else {
              setSelectedRows([]);
            }
          }}
          style={{ margin: 0 }}
        />
      ),
      renderCell: (params) => (
        <input
          type="checkbox"
          checked={cleanSelectionModel.includes(params.row.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRows(prev => [...prev, params.row.id]);
            } else {
              setSelectedRows(prev => prev.filter(id => id !== params.row.id));
            }
          }}
          style={{ margin: 0 }}
        />
      ),
    },
    { field: "transactionId", headerName: "Transaction ID", flex: 1 },
    { field: "propertyName", headerName: "Property Name", flex: 1.5 },
    { field: "buyer", headerName: "Buyer", flex: 1 },
    { field: "amount", headerName: "Amount", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 },
  ];

  // ✅ Bulk Actions
  const handleDeleteSelected = () => {
    if (cleanSelectionModel.length === 0) return;
    alert(`Deleting IDs: ${cleanSelectionModel.join(", ")}`);
  };

  const handleDownloadSelected = () => {
    if (cleanSelectionModel.length === 0) return;
    const selectedData = safeRows.filter((r) =>
      cleanSelectionModel.includes(r.id)
    );
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        Object.keys(selectedData[0]).join(","),
        ...selectedData.map((r) => Object.values(r).join(",")),
      ].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "selected_transactions.csv";
    link.click();
  };

  const handleReset = () => {
    setSelectedRows([]);
    setFilterText("");
    setGridError(false);
  };

  // ✅ Error recovery function
  const resetGrid = () => {
    setSelectedRows([]);
    setFilterText("");
    setGridError(false);
  };

  // ✅ Safety guard for selection - prevents DataGrid internal errors
  useEffect(() => {
    // Always ensure selectedRows is an array to prevent "is not iterable" errors
    if (!Array.isArray(selectedRows)) {
      console.warn("Invalid selection model detected and fixed:", selectedRows);
      setSelectedRows([]);
      return;
    }

    // Clean up any invalid values in the selection array
    const hasInvalidValues = selectedRows.some(id => id === null || id === undefined || id === '');
    if (hasInvalidValues) {
      const cleanedSelection = selectedRows.filter(id =>
        id !== null && id !== undefined && id !== ''
      );
      console.warn("Cleaned invalid selection values:", { before: selectedRows, after: cleanedSelection });
      setSelectedRows(cleanedSelection);
    }
  }, [selectedRows]);

  // ✅ Additional safety: Clear selection when data changes significantly
  useEffect(() => {
    if (selectedRows.length > 0 && safeRows.length === 0) {
      setSelectedRows([]);
    }
  }, [safeRows.length, selectedRows.length]);

  // ✅ Error detection and recovery
  useEffect(() => {
    const handleError = (event) => {
      if (event.error && event.error.message &&
        (event.error.message.includes('selection.ids is not iterable') ||
          event.error.message.includes('currentSelection.ids is not iterable'))) {
        console.error('DataGrid selection error detected, resetting grid:', event.error);
        setGridError(true);
        event.preventDefault();
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // ✅ Render
  return (
    <Box sx={{ height: "auto", width: "100%", p: 2 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h6" fontWeight="bold">
          Property Transactions
        </Typography>

        <Stack direction="row" spacing={1}>
          <input
            placeholder="Search..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{
              border: "1px solid #ccc",
              borderRadius: "6px",
              padding: "6px 10px",
            }}
          />
          <Button
            variant="contained"
            color="error"
            disabled={cleanSelectionModel.length === 0}
            onClick={handleDeleteSelected}
          >
            Delete
          </Button>
          <Button
            variant="outlined"
            color="primary"
            disabled={cleanSelectionModel.length === 0}
            onClick={handleDownloadSelected}
          >
            Download
          </Button>
          <Button variant="text" color="secondary" onClick={handleReset}>
            Reset
          </Button>
        </Stack>
      </Stack>

      {/* Additional safety wrapper to catch any DataGrid rendering errors */}
      {gridError ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error" gutterBottom>
            DataGrid Error Detected
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            The table encountered an error. Click below to reset and try again.
          </Typography>
          <Button variant="contained" onClick={resetGrid}>
            Reset Table
          </Button>
        </Box>
      ) : Array.isArray(safeRows) && safeRows.length >= 0 ? (
        <DataGrid
          key={`datagrid-${safeRows.length}-${cleanSelectionModel.length}`} // Force re-render on data/selection changes
          autoHeight
          rows={safeRows}
          columns={columns}
          disableRowSelectionOnClick
          hideFooter // ✅ Hide footer to prevent "Cannot read properties of undefined (reading 'size')" error
          sortingMode="client"
          disableColumnSelector
          disableColumnFilter
          disableColumnMenu
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f5f5f5",
              fontWeight: "bold",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#f0f8ff",
            },
          }}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
        />
      ) : (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography color="text.secondary">
            No data available or invalid data format
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PropertyTransactionsTableURL;
