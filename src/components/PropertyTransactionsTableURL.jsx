import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Checkbox,
  TableSortLabel,
  TablePagination,
  CircularProgress,
  Alert,
  InputAdornment,
  useTheme,
  alpha,
} from '@mui/material';
import { Search, Download, RestartAlt } from '@mui/icons-material';
import ReusableCard from './Card/ReusableCard.jsx';

// Sample data
const sampleTransactions = [
  {
    id: 1,
    propertyName: "Sunset Villa",
    agentName: "Ava Realtors",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    account: "Freedom Platinum Visa",
    transactionId: "4528790135",
    date: "2025-10-20 10:04 AM",
    amount: "+$5,300",
    note: "Commission payment from property sale",
    status: "Completed"
  },
  {
    id: 2,
    propertyName: "Oceanview Apartment",
    agentName: "BlueBrick Realty",
    avatar: null,
    account: "Freedom Unlimited Mastercard",
    transactionId: "4826709123",
    date: "2025-10-18 08:30 AM",
    amount: "-$1,200",
    note: "Monthly maintenance fee",
    status: "Pending"
  },
  {
    id: 3,
    propertyName: "Greenwood Loft",
    agentName: "Joseph Estates",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    account: "Elite Business Card",
    transactionId: "4837099012",
    date: "2025-10-17 07:15 AM",
    amount: "+$9,800",
    note: "Rent collection from tenant",
    status: "Completed"
  },
  {
    id: 4,
    propertyName: "Palm Heights",
    agentName: "LuxeSpaces",
    avatar: null,
    account: "Platinum Rewards Card",
    transactionId: "4710023011",
    date: "2025-10-14 09:45 AM",
    amount: "-$950",
    note: "Interior maintenance cost",
    status: "Failed"
  },
  {
    id: 5,
    propertyName: "Skyline Towers",
    agentName: "Elite Realty Group",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    account: "Business Premium Card",
    transactionId: "4850012399",
    date: "2025-10-10 03:25 PM",
    amount: "+$12,500",
    note: "Commercial property sale",
    status: "Completed"
  },
  {
    id: 6,
    propertyName: "Marina Bay Condos",
    agentName: "Coastal Properties",
    avatar: null,
    account: "Gold Business Card",
    transactionId: "4729384756",
    date: "2025-10-08 11:20 AM",
    amount: "+$7,200",
    note: "Property lease agreement",
    status: "Completed"
  },
  {
    id: 7,
    propertyName: "Downtown Office Space",
    agentName: "Metro Realty",
    avatar: "https://randomuser.me/api/portraits/women/28.jpg",
    account: "Corporate Platinum",
    transactionId: "4913847562",
    date: "2025-10-05 02:45 PM",
    amount: "-$2,100",
    note: "Office renovation costs",
    status: "Pending"
  },
  {
    id: 8,
    propertyName: "Garden View Estates",
    agentName: "GreenSpace Realty",
    avatar: null,
    account: "Premium Rewards Card",
    transactionId: "4812736495",
    date: "2025-10-03 09:15 AM",
    amount: "+$15,600",
    note: "Luxury home sale commission",
    status: "Completed"
  }
];

// Custom hook to handle URL search parameters with prefix support
const useURLTableState = (prefix, defaults) => {
  // Get initial state from URL parameters
  const getInitialState = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      search: urlParams.get(`${prefix}_search`) || defaults.search,
      agent: urlParams.get(`${prefix}_agent`) || defaults.agent,
      propertyType: urlParams.get(`${prefix}_propertyType`) || defaults.propertyType,
      month: parseInt(urlParams.get(`${prefix}_month`) || String(defaults.month), 10),
      year: parseInt(urlParams.get(`${prefix}_year`) || String(defaults.year), 10),
      page: parseInt(urlParams.get(`${prefix}_page`) || String(defaults.page), 10),
      rowsPerPage: parseInt(urlParams.get(`${prefix}_rows`) || String(defaults.rowsPerPage), 10),
      orderBy: urlParams.get(`${prefix}_orderBy`) || defaults.orderBy,
      order: urlParams.get(`${prefix}_order`) || defaults.order,
    };
  };

  const [state, setState] = useState(getInitialState);

  // Function to update URL parameters
  const updateURL = (newState) => {
    const urlParams = new URLSearchParams(window.location.search);

    // Update only our prefixed parameters
    Object.entries(newState).forEach(([key, value]) => {
      const paramName = `${prefix}_${key}`;

      // Remove parameter if it's the default value or empty
      if (value === '' || value === null || value === undefined ||
        (key === 'search' && value === defaults.search) ||
        (key === 'agent' && value === defaults.agent) ||
        (key === 'propertyType' && value === defaults.propertyType) ||
        (key === 'month' && value === defaults.month) ||
        (key === 'year' && value === defaults.year) ||
        (key === 'page' && value === defaults.page) ||
        (key === 'rowsPerPage' && value === defaults.rowsPerPage) ||
        (key === 'orderBy' && value === defaults.orderBy) ||
        (key === 'order' && value === defaults.order)) {
        urlParams.delete(paramName);
      } else {
        urlParams.set(paramName, String(value));
      }
    });

    // Update browser URL
    const newURL = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.replaceState({}, '', newURL);
  };

  // Update state and URL
  const updateState = (updates) => {
    setState(prevState => {
      const newState = { ...prevState, ...updates };
      updateURL(newState);
      return newState;
    });
  };

  // Listen for browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setState(getInitialState());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return [state, updateState];

};

const PropertyTransactionsTableURL = ({ title = "Property Transactions", prefix = "table" }) => {
  const theme = useTheme();

  const defaults = {
    search: '',
    agent: 'all',
    propertyType: 'all',
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    page: 0,
    rowsPerPage: 5,
    orderBy: 'date',
    order: 'desc',
  };

  const [qsState, setQsState] = useURLTableState(prefix, defaults);

  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState([]);

  const startDate = new Date(qsState.year, qsState.month, 1, 0, 0, 0);
  const endDate = new Date(qsState.year, qsState.month + 1, 0, 23, 59, 59);

  // Load data
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    const load = async () => {
      try {
        await new Promise(r => setTimeout(r, 800));
        if (!mounted) return;
        setTransactions(sampleTransactions);
        setFilteredTransactions(sampleTransactions);
      } catch (err) {
        if (!mounted) return;
        setError(err.message || 'Unknown error');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = transactions;

    if (qsState.propertyType && qsState.propertyType !== 'all') {
      filtered = filtered.filter(t => {
        // Simple property type logic based on transaction amount
        if (qsState.propertyType === 'commercial') {
          return parseFloat(t.amount.replace(/[$,]/g, '')) > 5000;
        } else if (qsState.propertyType === 'residential') {
          return parseFloat(t.amount.replace(/[$,]/g, '')) <= 5000;
        }
        return true;
      });
    }

    if (qsState.agent && qsState.agent !== 'all') {
      filtered = filtered.filter(t => t.agentName === qsState.agent);
    }

    if (qsState.search) {
      const s = qsState.search.toLowerCase();
      filtered = filtered.filter(t =>
        t.propertyName.toLowerCase().includes(s) ||
        t.agentName.toLowerCase().includes(s) ||
        (t.transactionId && t.transactionId.includes(s)) ||
        (t.account && t.account.toLowerCase().includes(s))
      );
    }

    // Date filter
    filtered = filtered.filter(t => {
      const td = new Date(t.date);
      return td >= startDate && td <= endDate;
    });

    // Sorting
    const sorted = [...filtered].sort((a, b) => {
      let aValue, bValue;
      switch (qsState.orderBy) {
        case 'account':
          aValue = a.account?.toLowerCase() || '';
          bValue = b.account?.toLowerCase() || '';
          break;
        case 'amount':
          aValue = parseFloat(a.amount.replace(/[$,]/g, '')) || 0;
          bValue = parseFloat(b.amount.replace(/[$,]/g, '')) || 0;
          break;
        case 'date':
        default:
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
      }
      if (qsState.order === 'asc') return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    });

    setFilteredTransactions(sorted);
    if (qsState.page !== 0 && sorted.length <= qsState.page * qsState.rowsPerPage) {
      setQsState({ page: 0 });
    }
  }, [transactions, qsState.search, qsState.agent, qsState.propertyType, qsState.month, qsState.year, qsState.orderBy, qsState.order, startDate, endDate]);

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
    switch ((status || '').toLowerCase()) {
      case 'completed':
        return {
          backgroundColor: alpha(theme.palette.success.main, 0.1),
          color: theme.palette.success.main
        };
      case 'pending':
        return {
          backgroundColor: alpha(theme.palette.warning.main, 0.1),
          color: theme.palette.warning.main
        };
      case 'failed':
        return {
          backgroundColor: alpha(theme.palette.error.main, 0.1),
          color: theme.palette.error.main
        };
      default:
        return {
          backgroundColor: alpha(theme.palette.grey[500], 0.1),
          color: theme.palette.grey[700]
        };
    }
  };

  const getAmountColor = (amount) => (amount && amount.startsWith('+') ? theme.palette.success.main : theme.palette.error.main);

  // Event handlers
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = filteredTransactions.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    event.stopPropagation();
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) newSelected = newSelected.concat(selected, id);
    else if (selectedIndex === 0) newSelected = newSelected.concat(selected.slice(1));
    else if (selectedIndex === selected.length - 1) newSelected = newSelected.concat(selected.slice(0, -1));
    else if (selectedIndex > 0) newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const uniqueAgents = [...new Set(transactions.map(t => t.agentName))];

  const updateSingle = (k, v) => setQsState({ [k]: v });
  const updatePage = (event, newPage) => updateSingle('page', newPage);
  const updateRowsPerPage = (event) => {
    setQsState({
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0
    });
  };

  const handleRequestSort = (property) => {
    const isAsc = qsState.orderBy === property && qsState.order === 'asc';
    setQsState({
      order: isAsc ? 'desc' : 'asc',
      orderBy: property
    });
  };

  const handleDownload = () => {
    const rows = filteredTransactions.map(r => ({
      id: r.id,
      property: r.propertyName,
      agent: r.agentName,
      account: r.account,
      transactionId: r.transactionId,
      date: r.date,
      amount: r.amount,
      status: r.status,
      note: r.note,
    }));
    if (rows.length === 0) return;

    const header = Object.keys(rows[0]).join(',');
    const csv = [header, ...rows.map(r => Object.values(r).map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_').toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetFilters = () => {
    setQsState(defaults);
  };

  const paginated = filteredTransactions.slice(qsState.page * qsState.rowsPerPage, qsState.page * qsState.rowsPerPage + qsState.rowsPerPage);

  if (loading) {
    return (
      <ReusableCard
        variant="elevated"
        sx={{ height: 520, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <CircularProgress />
      </ReusableCard>
    );
  }

  if (error) {
    return (
      <ReusableCard variant="elevated" sx={{ height: 520 }}>
        <Alert severity="error" sx={{ mt: 2 }}>
          Error loading transactions: {error}
        </Alert>
      </ReusableCard>
    );
  }

  return (
    <ReusableCard
      variant="elevated"
      sx={{
        height: 'auto',
        minHeight: 520,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2,
        pb: 1,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box
            sx={{
              width: 3,
              height: 24,
              background: `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              borderRadius: 1.5,
            }}
          />
          <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
            {title}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="text"
            onClick={handleResetFilters}
            sx={{
              minWidth: 'auto',  // removes default 64px
              width: '40px',     // optional: fixed size for icon
              height: '40px',
              borderColor: theme.palette.error.main,
              color: theme.palette.secondary.light,
              '&:hover': {
                backgroundColor: alpha(theme.palette.error.main, 0.06),
                borderColor: theme.palette.error.main
              },

            }}
          >
            <RestartAlt />
          </Button>
          <Button
            variant="text"

            onClick={handleDownload}
            sx={{
              minWidth: 'auto',  // removes default 64px
              width: '40px',     // optional: fixed size for icon
              height: '40px',
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.06),

              }
            }}
          >
            <Download />
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: { xs: 'flex-start', md: 'space-between' },
        alignItems: { xs: 'stretch', md: 'center' },
        gap: 2,
        mb: 2,
      }}>
        <TextField
          placeholder="Search transactions..."
          size="small"
          value={qsState.search}
          onChange={(e) => updateSingle('search', e.target.value)}
          sx={{
            width: { xs: '100%', md: 250 },
            '& .MuiOutlinedInput-root': { backgroundColor: alpha(theme.palette.background.default, 0.5) }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
              </InputAdornment>
            )
          }}
        />

        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          alignItems: { xs: 'stretch', md: 'center' },
          width: { xs: '100%', md: 'auto' },
        }}>
          <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 150 } }}>
            <InputLabel>Property Type</InputLabel>
            <Select value={qsState.propertyType} label="Property Type" onChange={(e) => updateSingle('propertyType', e.target.value)}>
              <MenuItem value="all">All Property Types</MenuItem>
              <MenuItem value="residential">Residential</MenuItem>
              <MenuItem value="commercial">Commercial</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 150 } }}>
            <InputLabel>Agent</InputLabel>
            <Select value={qsState.agent} label="Agent" onChange={(e) => updateSingle('agent', e.target.value)}>
              <MenuItem value="all">All Agents</MenuItem>
              {uniqueAgents.map(agent => <MenuItem key={agent} value={agent}>{agent}</MenuItem>)}
            </Select>
          </FormControl>

          <Box sx={{
            display: 'flex',
            gap: 1,
            width: { xs: '100%', md: 'auto' },
          }}>
            <FormControl size="small" sx={{ flex: { xs: 1, md: 'none' }, minWidth: { xs: 'auto', md: 120 } }}>
              <InputLabel>Month</InputLabel>
              <Select value={String(qsState.month)} label="Month" onChange={(e) => {
                const m = Number(e.target.value);
                updateSingle('month', m);
              }}>
                {Array.from({ length: 12 }, (_, i) => (
                  <MenuItem key={i} value={i}>{new Date(2025, i, 1).toLocaleDateString('en', { month: 'long' })}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ flex: { xs: 1, md: 'none' }, minWidth: { xs: 'auto', md: 100 } }}>
              <InputLabel>Year</InputLabel>
              <Select value={String(qsState.year)} label="Year" onChange={(e) => updateSingle('year', Number(e.target.value))}>
                {Array.from({ length: 5 }, (_, i) => {
                  const y = 2023 + i;
                  return <MenuItem key={y} value={y}>{y}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Box>

      {/* Table */}
      <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" sx={{ fontWeight: 600, backgroundColor: alpha(theme.palette.background.default, 0.5) }}>
                <Checkbox
                  color="primary"
                  indeterminate={selected.length > 0 && selected.length < filteredTransactions.length}
                  checked={filteredTransactions.length > 0 && selected.length === filteredTransactions.length}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 600, backgroundColor: alpha(theme.palette.background.default, 0.5) }}>
                Property / Agent
              </TableCell>
              <TableCell sx={{ fontWeight: 600, backgroundColor: alpha(theme.palette.background.default, 0.5) }}>
                <TableSortLabel
                  active={qsState.orderBy === 'account'}
                  direction={qsState.orderBy === 'account' ? qsState.order : 'asc'}
                  onClick={() => handleRequestSort('account')}
                >
                  Account
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, backgroundColor: alpha(theme.palette.background.default, 0.5) }}>
                Transaction ID
              </TableCell>
              <TableCell sx={{ fontWeight: 600, backgroundColor: alpha(theme.palette.background.default, 0.5) }}>
                <TableSortLabel
                  active={qsState.orderBy === 'date'}
                  direction={qsState.orderBy === 'date' ? qsState.order : 'asc'}
                  onClick={() => handleRequestSort('date')}
                >
                  Date & Time
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, backgroundColor: alpha(theme.palette.background.default, 0.5) }}>
                <TableSortLabel
                  active={qsState.orderBy === 'amount'}
                  direction={qsState.orderBy === 'amount' ? qsState.order : 'asc'}
                  onClick={() => handleRequestSort('amount')}
                >
                  Amount
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, backgroundColor: alpha(theme.palette.background.default, 0.5) }}>
                Remarks
              </TableCell>
              <TableCell sx={{ fontWeight: 600, backgroundColor: alpha(theme.palette.background.default, 0.5) }}>
                Status
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginated.map((transaction) => {
              const isItemSelected = isSelected(transaction.id);
              return (
                <TableRow
                  key={transaction.id}
                  hover
                  selected={isItemSelected}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.05) }
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      onChange={(e) => handleClick(e, transaction.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={transaction.avatar}
                        sx={{
                          width: 40,
                          height: 40,
                          backgroundColor: getAvatarColor(transaction.agentName),
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                        }}
                      >
                        {!transaction.avatar && getInitials(transaction.agentName)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                          {transaction.propertyName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                          {transaction.agentName}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{transaction.account}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: 'monospace',
                        color: theme.palette.text.secondary
                      }}
                    >
                      {transaction.transactionId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{transaction.date}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: getAmountColor(transaction.amount),
                        fontWeight: 600
                      }}
                    >
                      {transaction.amount}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        maxWidth: 200,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {transaction.note}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={transaction.status}
                      size="small"
                      sx={{
                        ...getStatusColor(transaction.status),
                        fontWeight: 500,
                        fontSize: '0.75rem'
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredTransactions.length}
        page={qsState.page}
        onPageChange={updatePage}
        rowsPerPage={qsState.rowsPerPage}
        onRowsPerPageChange={updateRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        sx={{
          borderTop: `1px solid ${theme.palette.divider}`,
          mt: 2
        }}
      />
    </ReusableCard>
  );
};

export default PropertyTransactionsTableURL;