import React from 'react';
import { Container, Paper, Typography, Box } from '@mui/material';
import EmployeesTable from '../tables/EmployeesTable';
import { mockEmployees } from '../../utils/mockData';

const EmployeesPage = () => {
    const handleSelectionChange = (selectedIds) => {
        console.log('Selected employee IDs:', selectedIds);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={2} sx={{ p: 3 }}>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Employees Directory
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Select employees to perform bulk actions. Click on employee name or avatar to view profile.
                    </Typography>
                </Box>

                <EmployeesTable employees={mockEmployees} onSelectionChange={handleSelectionChange} />
            </Paper>
        </Container>
    );
};

export default EmployeesPage;
