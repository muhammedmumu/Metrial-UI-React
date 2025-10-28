import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Avatar, Stack, Chip } from '@mui/material';

const EmployeesTable = ({ employees = [], onSelectionChange }) => {
  const [selectionModel, setSelectionModel] = useState([]);

  const handleSelectionChange = (newSelection) => {
    setSelectionModel(newSelection);
    if (onSelectionChange) {
      onSelectionChange(newSelection);
    }
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Employee',
      flex: 1,
      minWidth: 200,
      renderCell: (p) => (
        <Stack 
          direction="row" 
          spacing={2} 
          alignItems="center"
          sx={{ 
            cursor: 'pointer',
            '&:hover': { opacity: 0.8 }
          }}
          onClick={() => {
            if (p.row.profileUrl) {
              window.open(p.row.profileUrl, '_blank');
            }
          }}
        >
          <Avatar 
            src={p.row.avatarUrl} 
            alt={p.row.name}
            sx={{ width: 40, height: 40 }}
          >
            {p.row.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Box sx={{ fontWeight: 500 }}>{p.row.name}</Box>
            {p.row.email && (
              <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                {p.row.email}
              </Box>
            )}
          </Box>
        </Stack>
      ),
    },
    {
      field: 'position',
      headerName: 'Position',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'department',
      headerName: 'Department',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (p) => (
        <Chip
          label={p.value}
          color={p.value === 'Active' ? 'success' : 'default'}
          size="small"
        />
      ),
    },
  ];

  // Ensure we have valid data
  if (!employees || !Array.isArray(employees) || employees.length === 0) {
    return (
      <Box sx={{ height: 400, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>No employee data available</div>
      </Box>
    );
  }

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={employees}
        columns={columns}
        checkboxSelection
        disableRowSelectionOnClick
        rowSelectionModel={selectionModel}
        onRowSelectionModelChange={handleSelectionChange}
        pageSizeOptions={[5, 10, 25, 50]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10 },
          },
        }}
        sx={{
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      />
    </Box>
  );
};

export default EmployeesTable;