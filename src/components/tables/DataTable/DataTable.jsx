import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';

const DataTable = ({
  rows,
  columns,
  pageSize = 5,
  autoHeight = true,
  loading = false,
  checkboxSelection = false,
}) => {
  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        autoHeight={autoHeight}
        disableSelectionOnClick
        loading={loading}
        checkboxSelection={checkboxSelection}
      />
    </Box>
  );
};

export default DataTable;
