
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  InputAdornment,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Stack,
} from '@mui/material';
import {
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Search,
  Download,
  RestartAlt,
  Edit,
  Delete,
  MoreVert,
} from '@mui/icons-material';
import debounce from 'lodash.debounce';

// Constants for easy customization
const LABELS = {
  title: 'Property Transactions',
  searchPlaceholder: 'Search transactions...',
  propertyTypeLabel: 'Property Type',
  agentLabel: 'Agent',
  monthLabel: 'Month',
  yearLabel: 'Year',
  resetFilters: 'Reset Filters',
  downloadCSV: 'Download CSV',
  bulkDelete: 'Delete Selected',
  confirmDeleteTitle: 'Confirm Delete',
  confirmDeleteMessage: 'Are you sure you want to delete the selected transactions?',
  cancel: 'Cancel',
  delete: 'Delete',
  deleteSuccess: 'Transactions deleted successfully',
  deleteError: 'Failed to delete transactions',
  noRowsSelected: 'No rows selected',
};

// Mock dataset for demo/testing
// TODO: replace with API call
const MOCK_TRANSACTIONS = [
  {
    id: 1,
    propertyName: "Sunset Villa",
    agentName: "Ava Realtors",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    account: "Freedom Platinum Visa",
    transactionId: "TXN4528790135",
    date: new Date('2024-10-20T10:04:00'),
    amount: 5300,
    remarks: "Commission payment from property sale",
    status: "Completed",
    propertyType: "Residential"
  },
  {
    id: 2,
    propertyName: "Oceanview Apartment",
    agentName: "BlueBrick Realty",
    avatar: null,
    account: "Freedom Unlimited Mastercard",
    transactionId: "TXN4826709123",
    date: new Date('2024-10-18T08:30:00'),
    amount: -1200,
    remarks: "Monthly maintenance fee",
    status: "Pending",
    propertyType: "Residential"
  },
  {
    id: 3,
    propertyName: "Greenwood Office Complex",
    agentName: "Joseph Estates",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    account: "Elite Business Card",
    transactionId: "TXN4837099012",
    date: new Date('2024-10-17T07:15:00'),
    amount: 9800,
    remarks: "Rent collection from tenant",
    status: "Completed",
    propertyType: "Commercial"
  },
  {
    id: 4,
    propertyName: "Palm Heights Tower",
    agentName: "LuxeSpaces",
    avatar: null,
    account: "Platinum Rewards Card",
    transactionId: "TXN4710023011",
    date: new Date('2024-10-14T09:45:00'),
    amount: -950,
    remarks: "Interior maintenance cost",
    status: "Failed",
    propertyType: "Commercial"
  },
  {
    id: 5,
    propertyName: "Skyline Business Center",
    agentName: "Elite Realty Group",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    account: "Business Premium Card",
    transactionId: "TXN4850012399",
    date: new Date('2024-10-10T15:25:00'),
    amount: 12500,
    remarks: "Commercial property sale",
    status: "Completed",
    propertyType: "Commercial"
  },
  {
    id: 6,
    propertyName: "Marina Bay Condos",
    agentName: "Coastal Properties",
    avatar: null,
    account: "Gold Business Card",
    transactionId: "TXN4729384756",
    date: new Date('2024-10-08T11:20:00'),
    amount: 7200,
    remarks: "Property lease agreement",
    status: "Completed",
    propertyType: "Residential"
  },
  {
    id: 7,
    propertyName: "Downtown Retail Space",
    agentName: "Metro Realty",
    avatar: "https://randomuser.me/api/portraits/women/28.jpg",
    account: "Corporate Platinum",
    transactionId: "TXN4913847562",
    date: new Date('2024-10-05T14:45:00'),
    amount: -2100,
    remarks: "Office renovation costs",
    status: "Pending",
    propertyType: "Commercial"
  },
  {
    id: 8,
    propertyName: "Garden View Estates",
    agentName: "GreenSpace Realty",
    avatar: null,
    account: "Premium Rewards Card",
    transactionId: "TXN4812736495",
    date: new Date('2024-10-03T09:15:00'),
    amount: 15600,
    remarks: "Luxury home sale commission",
    status: "Completed",
    propertyType: "Residential"
  },
];

// Custom hook for table state management
const useTableState = () => {
  const [state, setState] = useState({
    search: '',
    propertyType: 'all',
    agent: 'all',
    month: '',
    year: '',
    page: 0,
    pageSize: 10,
    sortField: 'date',
    sortOrder: 'desc',
  });

  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  return [state, updateState];
};

// Confirmation Dialog Component
const ConfirmDialog = ({ open, onClose, onConfirm, title, message }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{message}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>{LABELS.cancel}</Button>
      <Button onClick={onConfirm} color="error" variant="contained">
        {LABELS.delete}
      </Button>
    </DialogActions>
  </Dialog>
);

// Custom Toolbar Component
const CustomToolbar = ({
  state,
  updateState,
  onResetFilters,
  onDownloadCSV,
  onBulkDelete,
  uniqueAgents,
  selectedCount,
  filteredCount
}) => {
  const theme = useTheme();

  // Debounced search handler
  const debouncedSearch = useMemo(
    () => debounce((value) => {
      updateState({ search: value, page: 0 });
    }, 500),
    [updateState]
  );

  const handleSearchChange = (event) => {
    debouncedSearch(event.target.value);
  };

  return (
    <GridToolbarContainer sx={{ p: 2, gap: 2, flexWrap: 'wrap' }}>
      {/* Search */}
      <TextField
        placeholder={LABELS.searchPlaceholder}
        size="small"
        defaultValue={state.search}
        onChange={handleSearchChange}
        sx={{ minWidth: 250 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
            </InputAdornment>
          )
        }}
      />

      {/* Filters */}
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>{LABELS.propertyTypeLabel}</InputLabel>
        <Select
          value={state.propertyType}
          label={LABELS.propertyTypeLabel}
          onChange={(e) => updateState({ propertyType: e.target.value, page: 0 })}
        >
          <MenuItem value="all">All Types</MenuItem>
          <MenuItem value="Residential">Residential</MenuItem>
          <MenuItem value="Commercial">Commercial</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>{LABELS.agentLabel}</InputLabel>
        <Select
          value={state.agent}
          label={LABELS.agentLabel}
          onChange={(e) => updateState({ agent: e.target.value, page: 0 })}
        >
          <MenuItem value="all">All Agents</MenuItem>
          {uniqueAgents.map(agent => (
            <MenuItem key={agent} value={agent}>{agent}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label={LABELS.monthLabel}
          views={['month', 'year']}
          value={state.month ? new Date(state.year || new Date().getFullYear(), parseInt(state.month) - 1) : null}
          onChange={(date) => {
            if (date) {
              updateState({
                month: String(date.getMonth() + 1),
                year: String(date.getFullYear()),
                page: 0
              });
            } else {
              updateState({ month: '', year: '', page: 0 });
            }
          }}
          slotProps={{
            textField: {
              size: 'small',
              sx: { minWidth: 150 }
            }
          }}
        />
      </LocalizationProvider>

      {/* Action Buttons */}
      <Box sx={{ ml: 'auto', display: 'flex', gap: 1, alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {selectedCount > 0 && `${selectedCount} selected • `}
          {filteredCount} results
        </Typography>

        {selectedCount > 0 && (
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={onBulkDelete}
          >
            {LABELS.bulkDelete} ({selectedCount})
          </Button>
        )}

        <Tooltip title={LABELS.resetFilters}>
          <IconButton onClick={onResetFilters} size="small">
            <RestartAlt />
          </IconButton>
        </Tooltip>

        <Tooltip title={LABELS.downloadCSV}>
          <IconButton onClick={onDownloadCSV} size="small">
            <Download />
          </IconButton>
        </Tooltip>
      </Box>
    </GridToolbarContainer>
  );
};

// Main Component
const PropertyTransactionsTableURL = ({
  title = LABELS.title,
  onEdit = () => { },
  onDelete = () => { },
  onMoreActions = () => { }
}) => {
  const theme = useTheme();
  const [tableState, updateTableState] = useTableState();

  // Local state
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectionModel, setSelectionModel] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({ open: false });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Load data (simulated)
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        // TODO: replace with API call
        // const response = await fetch('/api/transactions');
        // const data = await response.json();

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        if (mounted) {
          setTransactions(MOCK_TRANSACTIONS);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Failed to load transactions');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();
    return () => { mounted = false; };
  }, []);

  // Filter data based on table state
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Text search
    if (tableState.search) {
      const searchTerm = tableState.search.toLowerCase();
      filtered = filtered.filter(transaction =>
        transaction.propertyName.toLowerCase().includes(searchTerm) ||
        transaction.agentName.toLowerCase().includes(searchTerm) ||
        transaction.account.toLowerCase().includes(searchTerm) ||
        transaction.transactionId.toLowerCase().includes(searchTerm) ||
        transaction.remarks.toLowerCase().includes(searchTerm)
      );
    }

    // Property type filter
    if (tableState.propertyType && tableState.propertyType !== 'all') {
      filtered = filtered.filter(transaction =>
        transaction.propertyType === tableState.propertyType
      );
    }

    // Agent filter
    if (tableState.agent && tableState.agent !== 'all') {
      filtered = filtered.filter(transaction =>
        transaction.agentName === tableState.agent
      );
    }

    // Month/Year filter
    if (tableState.month && tableState.year) {
      const filterMonth = parseInt(tableState.month) - 1; // JS months are 0-based
      const filterYear = parseInt(tableState.year);

      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getMonth() === filterMonth &&
          transactionDate.getFullYear() === filterYear;
      });
    }

    // Ensure all rows have proper id field for DataGrid
    return filtered.map((transaction, index) => {
      return {
        ...transaction,
        id: transaction.id || transaction.transactionId || `row-${index}`
      };
    });
  }, [transactions, tableState]);

  // Clean up selection model when filtered data changes
  useEffect(() => {
    if (filteredTransactions.length > 0) {
      const availableIds = new Set(filteredTransactions.map(row => row.id));
      setSelectionModel(prev => prev.filter(id => availableIds.has(id)));
    } else {
      setSelectionModel([]);
    }
  }, [filteredTransactions]);

  // Get unique agents for filter dropdown
  const uniqueAgents = useMemo(() => {
    return [...new Set(transactions.map(t => t.agentName))].sort();
  }, [transactions]);

  // Helper functions
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#96CEB4',
      '#FFEAA7',
      '#DDA0DD',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatCurrency = (amount) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount));

    return amount >= 0 ? `+${formatted}` : `-${formatted}`;
  };

  // Event handlers
  const handleResetFilters = () => {
    updateTableState({
      search: '',
      propertyType: 'all',
      agent: 'all',
      month: '',
      year: '',
      page: 0,
      sortField: 'date',
      sortOrder: 'desc'
    });
    setSelectionModel([]);
  };

  const handleDownloadCSV = () => {
    if (filteredTransactions.length === 0) {
      setSnackbar({
        open: true,
        message: 'No data to download',
        severity: 'warning'
      });
      return;
    }

    const headers = [
      'Transaction ID',
      'Property Name',
      'Agent Name',
      'Account',
      'Date',
      'Amount',
      'Status',
      'Remarks'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(row => [
        row.transactionId,
        `"${row.propertyName}"`,
        `"${row.agentName}"`,
        `"${row.account}"`,
        row.date.toISOString(),
        row.amount,
        row.status,
        `"${row.remarks}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleBulkDelete = () => {
    if (selectionModel.length === 0) {
      setSnackbar({
        open: true,
        message: LABELS.noRowsSelected,
        severity: 'warning'
      });
      return;
    }

    setConfirmDialog({
      open: true,
      title: LABELS.confirmDeleteTitle,
      message: `${LABELS.confirmDeleteMessage} This will delete ${selectionModel.length} transaction${selectionModel.length > 1 ? 's' : ''}.`
    });
  };

  const confirmBulkDelete = () => {
    // TODO: Add API call for bulk delete
    // await bulkDeleteTransactions(selectionModel);

    // Optimistic update
    setTransactions(prev => prev.filter(t => !selectionModel.includes(t.id)));
    setSelectionModel([]);
    setConfirmDialog({ open: false });
    setSnackbar({
      open: true,
      message: LABELS.deleteSuccess,
      severity: 'success'
    });
  };

  const handleEdit = (row) => {
    // TODO: Implement edit functionality
    console.log('Edit transaction:', row);
    onEdit(row);
  };

  const handleDelete = (row) => {
    // TODO: Add API call for single delete
    // await deleteTransaction(row.id);

    // Optimistic update
    setTransactions(prev => prev.filter(t => t.id !== row.id));
    setSnackbar({
      open: true,
      message: 'Transaction deleted successfully',
      severity: 'success'
    });
  };

  // DataGrid columns definition
  const columns = [
    {
      field: 'propertyAgent',
      headerName: 'Property / Agent',
      flex: 1,
      minWidth: 250,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
          <Avatar
            src={params.row.avatar}
            sx={{
              width: 40,
              height: 40,
              backgroundColor: getAvatarColor(params.row.agentName),
              color: 'white',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            {!params.row.avatar && getInitials(params.row.agentName)}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
              {params.row.propertyName}
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              {params.row.agentName}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'account',
      headerName: 'Account',
      flex: 0.8,
      minWidth: 150,
    },
    {
      field: 'transactionId',
      headerName: 'Transaction ID',
      flex: 0.7,
      minWidth: 140,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            fontFamily: 'monospace',
            color: theme.palette.text.secondary
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'date',
      headerName: 'Date & Time',
      flex: 0.8,
      minWidth: 160,
      type: 'dateTime',
      valueFormatter: (params) => {
        return new Date(params).toLocaleString();
      },
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 0.6,
      minWidth: 120,
      type: 'number',
      renderCell: (params) => (
        <Typography
          variant="subtitle2"
          sx={{
            color: params.value >= 0 ? theme.palette.success.main : theme.palette.error.main,
            fontWeight: 600
          }}
        >
          {formatCurrency(params.value)}
        </Typography>
      ),
    },
    {
      field: 'remarks',
      headerName: 'Remarks',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Tooltip title={params.value} placement="top">
          <Typography
            variant="body2"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%'
            }}
          >
            {params.value}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.5,
      minWidth: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={getStatusColor(params.value)}
          sx={{ fontWeight: 500 }}
        />
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Edit />}
          label="Edit"
          onClick={() => handleEdit(params.row)}
        />,
        <GridActionsCellItem
          icon={<Delete />}
          label="Delete"
          onClick={() => handleDelete(params.row)}
        />,
        <GridActionsCellItem
          icon={<MoreVert />}
          label="More"
          onClick={() => onMoreActions(params.row)}
        />,
      ],
    },
  ];

  if (loading || !tableState) {
    return (
      <Box sx={{
        height: 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error loading transactions: {error}
      </Alert>
    );
  }

  // Ensure we have valid data for DataGrid
  const safeRows = Array.isArray(filteredTransactions) ? filteredTransactions : [];

  return (
    <Box sx={{ height: 700, width: '100%' }}>
      <DataGrid
        rows={safeRows}
        columns={columns}
        disableRowSelectionOnClick
        hideFooter
        sortModel={[{
          field: tableState?.sortField ?? 'date',
          sort: tableState?.sortOrder ?? 'desc'
        }]}
        sortingMode="client"
        onSortModelChange={(model) => {
          if (model.length > 0) {
            updateTableState({
              sortField: model[0].field,
              sortOrder: model[0].sort
            });
          }
        }}
        slots={{
          toolbar: () => (
            <CustomToolbar
              state={tableState}
              updateState={updateTableState}
              onResetFilters={handleResetFilters}
              onDownloadCSV={handleDownloadCSV}
              onBulkDelete={handleBulkDelete}
              uniqueAgents={uniqueAgents}
              selectedCount={0}
              filteredCount={filteredTransactions.length}
            />
          ),
        }}
        sx={{
          '& .MuiDataGrid-toolbarContainer': {
            borderBottom: `1px solid ${theme.palette.divider}`,
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.04),
          },
        }}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false })}
        onConfirm={confirmBulkDelete}
        title={confirmDialog.title}
        message={confirmDialog.message}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

PropertyTransactionsTableURL.propTypes = {
  title: PropTypes.string,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onMoreActions: PropTypes.func,
};

export default PropertyTransactionsTableURL;