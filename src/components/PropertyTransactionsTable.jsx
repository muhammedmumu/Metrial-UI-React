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
  IconButton,
  InputAdornment,
  Paper,
  TablePagination,
  CircularProgress,
  Alert,
  Checkbox,
  TableSortLabel,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Search,
  Download,
  FilterList,
  DateRange,
  KeyboardArrowDown,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import ReusableCard from './cards/ReusableCard.jsx';

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

const PropertyTransactionsTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('all');
  const [agentFilter, setAgentFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('date');
  const [order, setOrder] = useState('desc');
  const [startDate, setStartDate] = useState(new Date('2025-10-01'));
  const [endDate, setEndDate] = useState(new Date('2025-10-30'));
  const theme = useTheme();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTransactions(sampleTransactions);
        setFilteredTransactions(sampleTransactions);
        setError(null);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = transactions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (transaction) =>
          transaction.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.transactionId.includes(searchTerm) ||
          transaction.account.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Agent filter
    if (agentFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.agentName === agentFilter);
    }

    // Date range filter
    filtered = filtered.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    // Sort filtered data
    const sortedFiltered = [...filtered].sort((a, b) => {
      let aValue, bValue;
      
      switch (orderBy) {
        case 'account':
          aValue = a.account.toLowerCase();
          bValue = b.account.toLowerCase();
          break;
        case 'amount':
          aValue = parseFloat(a.amount.replace(/[$,+]/g, ''));
          bValue = parseFloat(b.amount.replace(/[$,+]/g, ''));
          break;
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        default:
          aValue = a[orderBy];
          bValue = b[orderBy];
      }
      
      if (order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredTransactions(sortedFiltered);
    setPage(0); // Reset page when filters change
  }, [searchTerm, propertyTypeFilter, agentFilter, transactions, startDate, endDate, orderBy, order]);

  const handleDownload = () => {
    console.log('Download transactions data');
    // Add export logic here
  };

  // Handle sorting
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Handle checkbox selection
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = filteredTransactions.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Get unique agents for filter dropdown
  const uniqueAgents = [...new Set(transactions.map(t => t.agentName))];

  // Generate initials from name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  // Generate avatar color from name
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

  // Get status chip color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
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

  // Get amount color
  const getAmountColor = (amount) => {
    return amount.startsWith('+') ? theme.palette.success.main : theme.palette.error.main;
  };

  if (loading) {
    return (
      <ReusableCard
        variant="elevated"
        sx={{ height: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <CircularProgress />
      </ReusableCard>
    );
  }

  if (error) {
    return (
      <ReusableCard variant="elevated" sx={{ height: 600 }}>
        <Alert severity="error" sx={{ mt: 2 }}>
          Error loading transactions: {error}
        </Alert>
      </ReusableCard>
    );
  }

  // Paginated data
  const paginatedTransactions = filteredTransactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <ReusableCard
      variant="elevated"
      sx={{ 
        height: 'auto',
        minHeight: 600,
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          pb: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          
          <Box
            sx={{
              width: 3,
              height: 24,
              background: `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              borderRadius: 1.5,
            }}
          /><Typography
            variant="body1"
            sx={{
              fontWeight:600,
              color: theme.palette.primary.main,
            }}
          >
            Property Transactions
          </Typography>
          
          {/* Dual Color Divider */}
          {/* <Box
            sx={{
              width: 3,
              height: 24,
              background: `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              borderRadius: 1.5,
            }}
          /> */}
        </Box>

        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={handleDownload}
          sx={{
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          Download
        </Button>
      </Box>

      {/* Filters */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: {
            xs: 'column',        // Column layout on extra small screens
            sm: 'column',        // Column layout on small screens
            md: 'row',           // Row layout on medium screens and up
          },
          justifyContent: {
            xs: 'flex-start',    // Start alignment on small screens
            md: 'space-between', // Space between on medium screens and up
          },
          alignItems: {
            xs: 'stretch',       // Stretch alignment on small screens
            md: 'center',        // Center alignment on medium screens and up
          },
          mb: 3,
          gap: 2,
        }}
      >
        {/* Search - Left aligned on large screens, full width on small */}
        <TextField
          placeholder="Search transactions or properties..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ 
            width: {
              xs: '100%',        // Full width on extra small screens
              sm: '100%',        // Full width on small screens
              md: 250,           // Fixed width on medium screens and up
            },
            '& .MuiOutlinedInput-root': {
              backgroundColor: alpha(theme.palette.background.default, 0.5),
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Right side filters - Column on small, Row on large */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: {
              xs: 'column',      // Column layout on extra small screens
              sm: 'column',      // Column layout on small screens
              md: 'row',         // Row layout on medium screens and up
            },
            gap: 2,
            alignItems: {
              xs: 'stretch',     // Stretch on small screens for full width
              md: 'center',      // Center on medium screens and up
            },
            width: {
              xs: '100%',        // Full width on small screens
              md: 'auto',        // Auto width on medium screens and up
            },
          }}
        >
          {/* Property Type Filter */}
          <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 150 } }}>
            <InputLabel>Property Type</InputLabel>
            <Select
              value={propertyTypeFilter}
              onChange={(e) => setPropertyTypeFilter(e.target.value)}
              label="Property Type"
            >
              <MenuItem value="all">All Property Types</MenuItem>
              <MenuItem value="residential">Residential</MenuItem>
              <MenuItem value="commercial">Commercial</MenuItem>
              <MenuItem value="luxury">Luxury</MenuItem>
            </Select>
          </FormControl>

          {/* Agent Filter */}
          <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 150 } }}>
            <InputLabel>Agent</InputLabel>
            <Select
              value={agentFilter}
              onChange={(e) => setAgentFilter(e.target.value)}
              label="Agent"
            >
              <MenuItem value="all">All Agents</MenuItem>
              {uniqueAgents.map((agent) => (
                <MenuItem key={agent} value={agent}>
                  {agent}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Date filters container - Side by side on all screens */}
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              width: {
                xs: '100%',      // Full width on small screens
                md: 'auto',      // Auto width on medium screens and up
              },
            }}
          >
            {/* Month Picker */}
            <FormControl size="small" sx={{ flex: { xs: 1, md: 'none' }, minWidth: { xs: 'auto', md: 120 } }}>
              <InputLabel>Month</InputLabel>
              <Select
                value={startDate.getMonth()}
                onChange={(e) => {
                  const newMonth = e.target.value;
                  const newStartDate = new Date(startDate.getFullYear(), newMonth, 1);
                  const newEndDate = new Date(startDate.getFullYear(), newMonth + 1, 0);
                  setStartDate(newStartDate);
                  setEndDate(newEndDate);
                }}
                label="Month"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <MenuItem key={i} value={i}>
                    {new Date(2025, i, 1).toLocaleDateString('en', { month: 'long' })}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Year Picker */}
            <FormControl size="small" sx={{ flex: { xs: 1, md: 'none' }, minWidth: { xs: 'auto', md: 100 } }}>
              <InputLabel>Year</InputLabel>
              <Select
                value={startDate.getFullYear()}
                onChange={(e) => {
                  const newYear = e.target.value;
                  const month = startDate.getMonth();
                  const newStartDate = new Date(newYear, month, 1);
                  const newEndDate = new Date(newYear, month + 1, 0);
                  setStartDate(newStartDate);
                  setEndDate(newEndDate);
                }}
                label="Year"
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const year = 2023 + i;
                  return (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Box>

      {/* Table */}
      <TableContainer sx={{ 
        flex: 1, 
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: '4px',
          height: '4px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: alpha(theme.palette.grey[300], 0.2),
          borderRadius: 2,
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: alpha(theme.palette.primary.main, 0.3),
          borderRadius: 2,
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.5),
          },
        },
      }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell 
                padding="checkbox" 
                sx={{ fontWeight: 600, backgroundColor: alpha(theme.palette.background.default, 0.5) }}
              >
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
                  active={orderBy === 'account'}
                  direction={orderBy === 'account' ? order : 'asc'}
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
                  active={orderBy === 'date'}
                  direction={orderBy === 'date' ? order : 'asc'}
                  onClick={() => handleRequestSort('date')}
                >
                  Date & Time
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, backgroundColor: alpha(theme.palette.background.default, 0.5) }}>
                <TableSortLabel
                  active={orderBy === 'amount'}
                  direction={orderBy === 'amount' ? order : 'asc'}
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
            {paginatedTransactions.map((transaction) => {
              const isItemSelected = isSelected(transaction.id);
              return (
                <TableRow
                  key={transaction.id}
                  hover
                  onClick={(event) => handleClick(event, transaction.id)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  selected={isItemSelected}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    },
                  }}
                >
                  {/* Checkbox */}
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      onChange={(event) => handleClick(event, transaction.id)}
                    />
                  </TableCell>
                {/* Property / Agent */}
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
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, lineHeight: 1.2 }}
                      >
                        {transaction.propertyName}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        {transaction.agentName}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                {/* Account */}
                <TableCell>
                  <Typography variant="body2">
                    {transaction.account}
                  </Typography>
                </TableCell>

                {/* Transaction ID */}
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

                {/* Date & Time */}
                <TableCell>
                  <Typography variant="body2">
                    {transaction.date}
                  </Typography>
                </TableCell>

                {/* Amount */}
                <TableCell>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: getAmountColor(transaction.amount),
                      fontWeight: 600,
                    }}
                  >
                    {transaction.amount}
                  </Typography>
                </TableCell>

                {/* Remarks */}
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      maxWidth: 200,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {transaction.note}
                  </Typography>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Chip
                    label={transaction.status}
                    size="small"
                    sx={{
                      ...getStatusColor(transaction.status),
                      fontWeight: 500,
                      fontSize: '0.75rem',
                    }}
                  />
                </TableCell>
              </TableRow>
            );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredTransactions.length}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25]}
        sx={{
          borderTop: `1px solid ${theme.palette.divider}`,
          mt: 2,
        }}
      />
    </ReusableCard>
  );
};

export default PropertyTransactionsTable;