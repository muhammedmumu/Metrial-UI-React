// PropertyTransactionsTableURL.jsx
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DataGrid,
  GridToolbar,
} from "@mui/x-data-grid";
import {
  Button,
  Stack,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  FilterAlt as FilterIcon,
  Download as DownloadIcon,
  RestartAlt as ResetIcon,
} from "@mui/icons-material";

const PropertyTransactionsTableURL = ({ transactions = [] }) => {
  // ✅ Safe router hooks with fallbacks
  let navigate, location;
  let isRouterAvailable = true;

  try {
    navigate = useNavigate();
    location = useLocation();
  } catch (error) {
    // Router not available, use fallbacks
    isRouterAvailable = false;
    navigate = () => { };
    location = { search: '', pathname: '/' };
  }

  // ✅ Parse URL parameters to restore table state (with router fallback)
  const getInitialStateFromURL = useCallback(() => {
    if (!isRouterAvailable) {
      // Fallback to localStorage when router is not available
      try {
        const saved = localStorage.getItem('propertyTransactionsTable');
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (error) {
        console.warn('Failed to load state from localStorage:', error);
      }

      // Return default state
      return {
        filterText: '',
        selectedRows: [],
        sortField: '',
        sortDirection: 'asc',
        page: 0,
        pageSize: 25,
        columnFilters: {},
        showFilters: false
      };
    }

    const searchParams = new URLSearchParams(location.search);

    return {
      filterText: searchParams.get('filter') || '',
      selectedRows: searchParams.get('selected') ?
        searchParams.get('selected').split(',').filter(Boolean) : [],
      sortField: searchParams.get('sortField') || '',
      sortDirection: searchParams.get('sortDirection') || 'asc',
      page: parseInt(searchParams.get('page')) || 0,
      pageSize: parseInt(searchParams.get('pageSize')) || 25,
      columnFilters: searchParams.get('columnFilters') ?
        JSON.parse(decodeURIComponent(searchParams.get('columnFilters'))) : {},
      showFilters: searchParams.get('showFilters') === 'true'
    };
  }, [isRouterAvailable, location?.search]);

  // ✅ State Management - Initialize from URL
  const [tableState, setTableState] = useState(() => {
    const initialState = getInitialStateFromURL();
    // Ensure columnFilters is always an object
    return {
      ...initialState,
      columnFilters: initialState.columnFilters || {}
    };
  });
  const [gridError, setGridError] = useState(false);

  // ✅ Menu state management
  const [headerMenuAnchor, setHeaderMenuAnchor] = useState(null);
  const [rowMenuAnchor, setRowMenuAnchor] = useState(null);
  const [selectedRowForMenu, setSelectedRowForMenu] = useState(null);

  // ✅ Update URL when state changes (with router fallback)
  const updateURL = useCallback((newState) => {
    if (!isRouterAvailable) {
      // Fallback to localStorage when router is not available
      try {
        localStorage.setItem('propertyTransactionsTable', JSON.stringify(newState));
      } catch (error) {
        console.warn('Failed to save state to localStorage:', error);
      }
      return;
    }

    const searchParams = new URLSearchParams();

    // Only add non-empty values to keep URL clean
    if (newState.filterText) searchParams.set('filter', newState.filterText);
    if (newState.selectedRows?.length > 0) searchParams.set('selected', newState.selectedRows.join(','));
    if (newState.sortField) searchParams.set('sortField', newState.sortField);
    if (newState.sortDirection && newState.sortDirection !== 'asc') searchParams.set('sortDirection', newState.sortDirection);
    if (newState.page > 0) searchParams.set('page', newState.page.toString());
    if (newState.pageSize !== 25) searchParams.set('pageSize', newState.pageSize.toString());
    if (newState.columnFilters && Object.keys(newState.columnFilters).length > 0) {
      searchParams.set('columnFilters', encodeURIComponent(JSON.stringify(newState.columnFilters)));
    }
    if (newState.showFilters) searchParams.set('showFilters', 'true');

    const newURL = `${location.pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    navigate(newURL, { replace: true });
  }, [isRouterAvailable, navigate, location?.pathname]);

  // ✅ Update state and URL together
  const updateTableState = useCallback((updates) => {
    setTableState(prev => {
      const newState = { ...prev, ...updates };
      updateURL(newState);
      return newState;
    });
  }, [updateURL]);

  // ✅ Restore state from URL when component mounts or URL changes
  useEffect(() => {
    const urlState = getInitialStateFromURL();
    setTableState(urlState);
  }, [getInitialStateFromURL]);

  // ✅ Enhanced filtering with column-specific filters
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Apply global search filter
    if (tableState.filterText) {
      filtered = filtered.filter((t) =>
        Object.values(t).some((value) =>
          String(value).toLowerCase().includes(tableState.filterText.toLowerCase())
        )
      );
    }

    // Apply column-specific filters
    if (tableState.columnFilters && Object.keys(tableState.columnFilters).length > 0) {
      filtered = filtered.filter((row) => {
        return Object.entries(tableState.columnFilters).every(([field, filter]) => {
          if (!filter.value) return true;

          const cellValue = String(row[field] || '').toLowerCase();
          const filterValue = String(filter.value).toLowerCase();

          switch (filter.operator) {
            case 'contains':
              return cellValue.includes(filterValue);
            case 'equals':
              return cellValue === filterValue;
            case 'startsWith':
              return cellValue.startsWith(filterValue);
            case 'endsWith':
              return cellValue.endsWith(filterValue);
            case 'notContains':
              return !cellValue.includes(filterValue);
            case 'notEquals':
              return cellValue !== filterValue;
            case 'greaterThan':
              return parseFloat(row[field]) > parseFloat(filter.value);
            case 'lessThan':
              return parseFloat(row[field]) < parseFloat(filter.value);
            case 'greaterThanOrEqual':
              return parseFloat(row[field]) >= parseFloat(filter.value);
            case 'lessThanOrEqual':
              return parseFloat(row[field]) <= parseFloat(filter.value);
            default:
              return cellValue.includes(filterValue);
          }
        });
      });
    }

    return filtered;
  }, [transactions, tableState.filterText, tableState.columnFilters]);

  // ✅ Apply sorting
  const sortedTransactions = useMemo(() => {
    if (!tableState.sortField) return filteredTransactions;

    return [...filteredTransactions].sort((a, b) => {
      const aValue = a[tableState.sortField];
      const bValue = b[tableState.sortField];

      let comparison = 0;
      if (aValue > bValue) comparison = 1;
      if (aValue < bValue) comparison = -1;

      return tableState.sortDirection === 'desc' ? -comparison : comparison;
    });
  }, [filteredTransactions, tableState.sortField, tableState.sortDirection]);

  // ✅ Ensure rows always have stable string IDs
  const safeRows = useMemo(() => {
    return sortedTransactions.map((t, index) => ({
      ...t,
      id: String(t.id ?? t.transactionId ?? `row-${index}`),
    }));
  }, [sortedTransactions]);

  // ✅ Safe clean selection model (only valid existing IDs) - prevents currentSelection.ids is not iterable
  const cleanSelectionModel = useMemo(() => {
    // Ensure selectedRows is always an array - prevent undefined/null/non-iterable values
    const safeSelected = Array.isArray(tableState.selectedRows) ? tableState.selectedRows : [];

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
  }, [tableState.selectedRows, safeRows]);

  // ✅ Handle selection changes with URL persistence
  const handleSelectionChange = useCallback((newSelection) => {
    const selectedIds = Array.isArray(newSelection) ? newSelection : [];
    updateTableState({ selectedRows: selectedIds });
  }, [updateTableState]);

  // ✅ Handle sorting changes with URL persistence
  const handleSortChange = useCallback((sortModel) => {
    if (sortModel.length > 0) {
      updateTableState({
        sortField: sortModel[0].field,
        sortDirection: sortModel[0].sort
      });
    } else {
      updateTableState({
        sortField: '',
        sortDirection: 'asc'
      });
    }
  }, [updateTableState]);

  // ✅ Filter operators
  const filterOperators = [
    { value: 'contains', label: 'Contains' },
    { value: 'equals', label: 'Equals' },
    { value: 'startsWith', label: 'Starts with' },
    { value: 'endsWith', label: 'Ends with' },
    { value: 'notContains', label: 'Does not contain' },
    { value: 'notEquals', label: 'Does not equal' },
    { value: 'greaterThan', label: 'Greater than' },
    { value: 'lessThan', label: 'Less than' },
    { value: 'greaterThanOrEqual', label: 'Greater than or equal' },
    { value: 'lessThanOrEqual', label: 'Less than or equal' }
  ];

  // ✅ Handle column filter changes
  const handleColumnFilter = useCallback((field, operator, value) => {
    const newColumnFilters = { ...tableState.columnFilters };

    if (value) {
      newColumnFilters[field] = { operator, value };
    } else {
      delete newColumnFilters[field];
    }

    updateTableState({ columnFilters: newColumnFilters });
  }, [tableState.columnFilters, updateTableState]);

  // ✅ Clear all filters
  const clearAllFilters = useCallback(() => {
    updateTableState({
      filterText: '',
      columnFilters: {}
    });
  }, [updateTableState]);

  // ✅ Toggle filter panel
  const toggleFilters = useCallback(() => {
    updateTableState({ showFilters: !tableState.showFilters });
  }, [tableState.showFilters, updateTableState]);

  // ✅ Header menu handlers
  const handleHeaderMenuOpen = useCallback((event) => {
    setHeaderMenuAnchor(event.currentTarget);
  }, []);

  const handleHeaderMenuClose = useCallback(() => {
    setHeaderMenuAnchor(null);
  }, []);

  // ✅ Row menu handlers
  const handleRowMenuOpen = useCallback((event, rowData) => {
    event.stopPropagation();
    setRowMenuAnchor(event.currentTarget);
    setSelectedRowForMenu(rowData);
  }, []);

  const handleRowMenuClose = useCallback(() => {
    setRowMenuAnchor(null);
    setSelectedRowForMenu(null);
  }, []);

  // ✅ Row-level action handlers
  const handleRowEdit = useCallback((rowData) => {
    console.log('Edit row:', rowData);
    // Here you would typically navigate to edit page or open edit modal
    alert(`Edit transaction: ${rowData.transactionId}`);
    handleRowMenuClose();
  }, [handleRowMenuClose]);

  const handleRowView = useCallback((rowData) => {
    console.log('View row:', rowData);
    // Here you would typically navigate to detail page or open view modal
    alert(`View transaction: ${rowData.transactionId}\n\nDetails:\n${JSON.stringify(rowData, null, 2)}`);
    handleRowMenuClose();
  }, [handleRowMenuClose]);

  const handleRowDelete = useCallback((rowData) => {
    if (window.confirm(`Are you sure you want to delete transaction ${rowData.transactionId}?`)) {
      console.log('Delete row:', rowData);
      // Here you would typically call an API to delete the specific transaction
      alert(`Deleted transaction: ${rowData.transactionId}`);
    }
    handleRowMenuClose();
  }, [handleRowMenuClose]);

  // ✅ Bulk Actions with URL persistence
  const handleDeleteSelected = useCallback(() => {
    if (cleanSelectionModel.length === 0) {
      alert("Please select rows to delete");
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${cleanSelectionModel.length} selected transaction(s)?`)) {
      // Here you would typically call an API to delete the transactions
      console.log(`Deleting IDs: ${cleanSelectionModel.join(", ")}`);

      // Clear selection after delete
      updateTableState({ selectedRows: [] });

      alert(`Deleted ${cleanSelectionModel.length} transactions successfully!`);
    }
  }, [cleanSelectionModel, updateTableState]);

  const handleDownloadSelected = useCallback(() => {
    if (cleanSelectionModel.length === 0) {
      alert("Please select rows to download");
      return;
    }

    const selectedData = safeRows.filter((r) =>
      cleanSelectionModel.includes(r.id)
    );

    const csvContent = [
      Object.keys(selectedData[0]).join(","),
      ...selectedData.map((r) => Object.values(r).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `selected_transactions_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    // Clean up
    URL.revokeObjectURL(link.href);
  }, [cleanSelectionModel, safeRows]);

  // ✅ Header-level action handlers (using existing functions with menu close)
  const handleHeaderResetFilters = useCallback(() => {
    clearAllFilters();
    handleHeaderMenuClose();
  }, [clearAllFilters, handleHeaderMenuClose]);

  const handleHeaderDownloadSelected = useCallback(() => {
    handleDownloadSelected();
    handleHeaderMenuClose();
  }, [handleDownloadSelected, handleHeaderMenuClose]);

  const handleHeaderDeleteSelected = useCallback(() => {
    handleDeleteSelected();
    handleHeaderMenuClose();
  }, [handleDeleteSelected, handleHeaderMenuClose]);

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
              handleSelectionChange(safeRows.map(row => row.id));
            } else {
              handleSelectionChange([]);
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
            let newSelection;
            if (e.target.checked) {
              newSelection = [...cleanSelectionModel, params.row.id];
            } else {
              newSelection = cleanSelectionModel.filter(id => id !== params.row.id);
            }
            handleSelectionChange(newSelection);
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
    {
      field: "actions",
      headerName: "Actions",
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={(event) => handleRowMenuOpen(event, params.row)}
          title="More actions"
          sx={{ color: 'text.secondary' }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  const handleReset = () => {
    // Reset all filters and selections
    const resetState = {
      filterText: '',
      selectedRows: [],
      sortField: '',
      sortDirection: 'asc',
      page: 0,
      pageSize: 25,
      columnFilters: {},
      showFilters: false
    };

    setTableState(resetState);
    updateURL(resetState);
    setGridError(false);
  };

  // ✅ Error recovery function
  const resetGrid = () => {
    handleReset();
  };

  // ✅ Safety guard for selection - prevents DataGrid internal errors
  useEffect(() => {
    // Always ensure selectedRows is an array to prevent "is not iterable" errors
    if (!Array.isArray(tableState.selectedRows)) {
      console.warn("Invalid selection model detected and fixed:", tableState.selectedRows);
      updateTableState({ selectedRows: [] });
      return;
    }

    // Clean up any invalid values in the selection array
    const hasInvalidValues = tableState.selectedRows.some(id => id === null || id === undefined || id === '');
    if (hasInvalidValues) {
      const cleanedSelection = tableState.selectedRows.filter(id =>
        id !== null && id !== undefined && id !== ''
      );
      console.warn("Cleaned invalid selection values:", { before: tableState.selectedRows, after: cleanedSelection });
      updateTableState({ selectedRows: cleanedSelection });
    }
  }, [tableState.selectedRows, updateTableState]);

  // ✅ Additional safety: Clear selection when data changes significantly
  useEffect(() => {
    if (tableState.selectedRows.length > 0 && safeRows.length === 0) {
      updateTableState({ selectedRows: [] });
    }
  }, [safeRows.length, tableState.selectedRows.length, updateTableState]);

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

  // ✅ Current sort model for DataGrid
  const sortModel = useMemo(() => {
    if (!tableState.sortField) return [];
    return [{
      field: tableState.sortField,
      sort: tableState.sortDirection
    }];
  }, [tableState.sortField, tableState.sortDirection]);

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

        <Stack direction="row" spacing={1} alignItems="center">
          {/* Header Kebab Menu */}
          <IconButton
            onClick={handleHeaderMenuOpen}
            title="More table actions"
            sx={{ color: 'text.secondary' }}
          >
            <MoreVertIcon />
          </IconButton>
          <input
            placeholder="Search all columns..."
            value={tableState.filterText}
            onChange={(e) => updateTableState({ filterText: e.target.value })}
            style={{
              border: "1px solid #ccc",
              borderRadius: "6px",
              padding: "6px 10px",
              minWidth: "200px"
            }}
          />
          <Button
            variant={tableState.showFilters ? "contained" : "outlined"}
            color="info"
            onClick={toggleFilters}
            title="Toggle advanced filters"
          >
            Filters {(tableState.columnFilters && Object.keys(tableState.columnFilters).length > 0) && `(${Object.keys(tableState.columnFilters).length})`}
          </Button>
          <Button
            variant="text"
            color="warning"
            onClick={clearAllFilters}
            disabled={!tableState.filterText && (!tableState.columnFilters || Object.keys(tableState.columnFilters).length === 0)}
            title="Clear all filters"
          >
            Clear Filters
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={cleanSelectionModel.length === 0}
            onClick={handleDeleteSelected}
            title={cleanSelectionModel.length > 0 ? `Delete ${cleanSelectionModel.length} selected` : 'Select rows to delete'}
          >
            Delete {cleanSelectionModel.length > 0 && `(${cleanSelectionModel.length})`}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            disabled={cleanSelectionModel.length === 0}
            onClick={handleDownloadSelected}
            title={cleanSelectionModel.length > 0 ? `Download ${cleanSelectionModel.length} selected` : 'Select rows to download'}
          >
            Download {cleanSelectionModel.length > 0 && `(${cleanSelectionModel.length})`}
          </Button>
          <Button
            variant="text"
            color="secondary"
            onClick={handleReset}
            title="Reset all filters, sorting and selections"
          >
            Reset
          </Button>
        </Stack>
      </Stack>

      {/* Advanced Filters Panel */}
      {tableState.showFilters && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid #e0e0e0' }}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Advanced Column Filters
          </Typography>
          <Stack spacing={2}>
            {['transactionId', 'propertyName', 'buyer', 'amount', 'date'].map((field) => (
              <Box key={field} sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="body2" sx={{ minWidth: 120, fontWeight: 500 }}>
                  {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}:
                </Typography>
                <select
                  value={tableState.columnFilters[field]?.operator || 'contains'}
                  onChange={(e) => {
                    const currentFilter = tableState.columnFilters[field];
                    handleColumnFilter(field, e.target.value, currentFilter?.value || '');
                  }}
                  style={{
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    minWidth: '140px'
                  }}
                >
                  {filterOperators.map(op => (
                    <option key={op.value} value={op.value}>{op.label}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder={`Filter ${field}...`}
                  value={tableState.columnFilters[field]?.value || ''}
                  onChange={(e) => {
                    const operator = tableState.columnFilters[field]?.operator || 'contains';
                    handleColumnFilter(field, operator, e.target.value);
                  }}
                  style={{
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    minWidth: '200px'
                  }}
                />
                {tableState.columnFilters[field] && (
                  <Button
                    size="small"
                    variant="text"
                    color="error"
                    onClick={() => handleColumnFilter(field, 'contains', '')}
                    title={`Clear ${field} filter`}
                    sx={{ minWidth: 'auto', p: 0.5 }}
                  >
                    ✕
                  </Button>
                )}
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {/* Status indicators */}
      {(tableState.filterText || cleanSelectionModel.length > 0 || tableState.sortField || (tableState.columnFilters && Object.keys(tableState.columnFilters).length > 0)) && (
        <Box sx={{ mb: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {tableState.filterText && `Global Filter: "${tableState.filterText}" • `}
            {(tableState.columnFilters && Object.keys(tableState.columnFilters).length > 0) && `Column Filters: ${Object.keys(tableState.columnFilters).length} active • `}
            {cleanSelectionModel.length > 0 && `${cleanSelectionModel.length} selected • `}
            {tableState.sortField && `Sorted by: ${tableState.sortField} (${tableState.sortDirection}) • `}
            Showing {safeRows.length} of {transactions.length} transactions
          </Typography>
        </Box>
      )}

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
          key={`datagrid-${safeRows.length}-${cleanSelectionModel.length}-${tableState.sortField}-${tableState.sortDirection}`}
          autoHeight
          rows={safeRows}
          columns={columns}
          sortModel={sortModel}
          onSortModelChange={handleSortChange}
          disableRowSelectionOnClick
          hideFooter
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
              showQuickFilter: false, // We have our own search
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

      {/* Header Kebab Menu */}
      <Menu
        anchorEl={headerMenuAnchor}
        open={Boolean(headerMenuAnchor)}
        onClose={handleHeaderMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: { minWidth: 200 }
        }}
      >
        <MenuItem
          onClick={handleHeaderResetFilters}
          disabled={!tableState.filterText && (!tableState.columnFilters || Object.keys(tableState.columnFilters).length === 0)}
        >
          <ListItemIcon>
            <ResetIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Reset Filters</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={handleHeaderDownloadSelected}
          disabled={cleanSelectionModel.length === 0}
        >
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            Download Selected {cleanSelectionModel.length > 0 && `(${cleanSelectionModel.length})`}
          </ListItemText>
        </MenuItem>

        <MenuItem
          onClick={handleHeaderDeleteSelected}
          disabled={cleanSelectionModel.length === 0}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText>
            Delete Selected {cleanSelectionModel.length > 0 && `(${cleanSelectionModel.length})`}
          </ListItemText>
        </MenuItem>
      </Menu>

      {/* Row Kebab Menu */}
      <Menu
        anchorEl={rowMenuAnchor}
        open={Boolean(rowMenuAnchor)}
        onClose={handleRowMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: { minWidth: 160 }
        }}
      >
        <MenuItem onClick={() => handleRowView(selectedRowForMenu)}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleRowEdit(selectedRowForMenu)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={() => handleRowDelete(selectedRowForMenu)}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default PropertyTransactionsTableURL;
