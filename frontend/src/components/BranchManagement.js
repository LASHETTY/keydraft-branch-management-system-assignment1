import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  GridView as GridViewIcon,
  ViewList as ListViewIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  FileUpload as FileUploadIcon,
  FileDownload as FileDownloadIcon,
  Logout as LogoutIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import * as XLSX from 'xlsx';

const API_URL = 'http://localhost:5000/api';

const BranchManagement = ({ onLogout }) => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentBranch, setCurrentBranch] = useState({
    name: '',
    code: '',
    address: '',
    city: '',
    state: '',
    phone: '',
    email: '',
    status: 'active',
  });
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const columns = [
    { 
      field: 'name', 
      headerName: 'Branch Name', 
      flex: 1,
      headerClassName: 'super-app-theme--header',
      renderCell: (params) => (
        <Typography sx={{ fontWeight: 600, color: '#2c3e50' }}>
          {params.value}
        </Typography>
      ),
    },
    { 
      field: 'code', 
      headerName: 'Branch Code', 
      flex: 1,
      headerClassName: 'super-app-theme--header',
    },
    { 
      field: 'address', 
      headerName: 'Address', 
      flex: 1.5,
      headerClassName: 'super-app-theme--header',
    },
    { 
      field: 'city', 
      headerName: 'City', 
      flex: 1,
      headerClassName: 'super-app-theme--header',
    },
    { 
      field: 'state', 
      headerName: 'State', 
      flex: 1,
      headerClassName: 'super-app-theme--header',
    },
    { 
      field: 'phone', 
      headerName: 'Phone', 
      flex: 1,
      headerClassName: 'super-app-theme--header',
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      flex: 1,
      headerClassName: 'super-app-theme--header',
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      flex: 1,
      headerClassName: 'super-app-theme--header',
      renderCell: (params) => (
        <Box
          sx={{
            backgroundColor: params.value === 'active' ? '#4caf50' : '#f44336',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
        >
          {params.value.charAt(0).toUpperCase() + params.value.slice(1)}
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      headerClassName: 'super-app-theme--header',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="contained"
            onClick={() => handleEdit(params.row)}
            sx={{
              backgroundColor: '#2196f3',
              '&:hover': {
                backgroundColor: '#1976d2',
              },
            }}
          >
            Edit
          </Button>
          <Button
            size="small"
            variant="contained"
            color="error"
            onClick={() => handleDelete(params.row._id)}
            sx={{
              backgroundColor: '#f44336',
              '&:hover': {
                backgroundColor: '#d32f2f',
              },
            }}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  const fetchBranches = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/branches?page=${page + 1}&limit=${pageSize}&search=${searchQuery}`
      );
      setBranches(response.data.branches);
      setTotalRows(response.data.totalPages * pageSize);
    } catch (error) {
      console.error('Error fetching branches:', error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchQuery]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const handleAdd = () => {
    setCurrentBranch({
      name: '',
      code: '',
      address: '',
      city: '',
      state: '',
      phone: '',
      email: '',
      status: 'active',
    });
    setOpenDialog(true);
  };

  const handleEdit = (branch) => {
    setCurrentBranch(branch);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      try {
        await axios.delete(`${API_URL}/branches/${id}`);
        fetchBranches();
      } catch (error) {
        console.error('Error deleting branch:', error);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (currentBranch._id) {
        await axios.put(`${API_URL}/branches/${currentBranch._id}`, currentBranch);
      } else {
        await axios.post(`${API_URL}/branches`, currentBranch);
      }
      setOpenDialog(false);
      fetchBranches();
    } catch (error) {
      console.error('Error saving branch:', error);
    }
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      try {
        for (const branch of jsonData) {
          await axios.post(`${API_URL}/branches`, branch);
        }
        fetchBranches();
      } catch (error) {
        console.error('Error importing branches:', error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(branches);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Branches');
    XLSX.writeFile(workbook, 'branches.xlsx');
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper 
        elevation={3}
        sx={{ 
          p: 2,
          backgroundColor: 'white',
          borderRadius: 2,
          mb: 3,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3,
          borderBottom: '3px solid #1e88e5',
          pb: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                backgroundColor: '#1e88e5',
                width: 40,
                height: 40,
                mr: 2,
                fontWeight: 'bold',
              }}
            >
              B
            </Avatar>
            <Typography 
              variant="h4" 
              sx={{ 
                color: '#2c3e50', 
                fontWeight: 'bold',
                letterSpacing: '0.5px',
              }}
            >
              Branch Management System
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Toggle View">
              <IconButton 
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                sx={{ 
                  backgroundColor: '#f5f5f5',
                  '&:hover': { backgroundColor: '#e0e0e0' },
                }}
              >
                {viewMode === 'grid' ? <ListViewIcon /> : <GridViewIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Toggle Fullscreen">
              <IconButton 
                onClick={toggleFullScreen}
                sx={{ 
                  backgroundColor: '#f5f5f5',
                  '&:hover': { backgroundColor: '#e0e0e0' },
                }}
              >
                {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Logout">
              <IconButton 
                onClick={onLogout}
                sx={{ 
                  backgroundColor: '#f44336',
                  color: 'white',
                  '&:hover': { backgroundColor: '#d32f2f' },
                }}
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mb: 3,
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <TextField
            label="Search Branches"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ 
              minWidth: 300,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#90caf9',
                },
                '&:hover fieldset': {
                  borderColor: '#42a5f5',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1e88e5',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ color: '#90caf9', mr: 1 }} />
              ),
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{ 
              backgroundColor: '#4caf50',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#388e3c',
              }
            }}
          >
            Add Branch
          </Button>
          <Button
            variant="outlined"
            startIcon={<FileUploadIcon />}
            component="label"
            sx={{ 
              borderColor: '#ff9800',
              color: '#ff9800',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#f57c00',
                backgroundColor: 'rgba(255, 152, 0, 0.08)',
              }
            }}
          >
            Import Excel
            <input
              type="file"
              hidden
              accept=".xlsx,.xls"
              onChange={handleImport}
            />
          </Button>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={handleExport}
            sx={{ 
              borderColor: '#2196f3',
              color: '#2196f3',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#1976d2',
                backgroundColor: 'rgba(33, 150, 243, 0.08)',
              }
            }}
          >
            Export Excel
          </Button>
        </Box>

        <Box sx={{ height: 'calc(100vh - 300px)', width: '100%' }}>
          <DataGrid
            rows={branches}
            columns={columns}
            loading={loading}
            pagination
            page={page}
            pageSize={pageSize}
            rowCount={totalRows}
            onPageChange={(newPage) => setPage(newPage)}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[5, 10, 20]}
            getRowId={(row) => row._id}
            sx={{
              '& .MuiDataGrid-cell': {
                fontSize: '0.9rem',
                color: '#2c3e50',
              },
              '& .super-app-theme--header': {
                backgroundColor: '#f8fafc',
                color: '#2c3e50',
                fontWeight: 700,
                fontSize: '0.95rem',
              },
              border: 'none',
              borderRadius: 2,
              '& .MuiDataGrid-row:hover': {
                backgroundColor: '#f8fafc',
              },
              '& .MuiDataGrid-columnHeaders': {
                borderBottom: '2px solid #e0e0e0',
              },
            }}
          />
        </Box>
      </Paper>

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle sx={{ 
          borderBottom: '2px solid #1976d2',
          mb: 2,
          pb: 1
        }}>
          {currentBranch._id ? 'Edit Branch' : 'Add New Branch'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Branch Name"
                value={currentBranch.name}
                onChange={(e) => setCurrentBranch({ ...currentBranch, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Branch Code"
                value={currentBranch.code}
                onChange={(e) => setCurrentBranch({ ...currentBranch, code: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={currentBranch.address}
                onChange={(e) => setCurrentBranch({ ...currentBranch, address: e.target.value })}
                required
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                value={currentBranch.city}
                onChange={(e) => setCurrentBranch({ ...currentBranch, city: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="State"
                value={currentBranch.state}
                onChange={(e) => setCurrentBranch({ ...currentBranch, state: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={currentBranch.phone}
                onChange={(e) => setCurrentBranch({ ...currentBranch, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                value={currentBranch.email}
                onChange={(e) => setCurrentBranch({ ...currentBranch, email: e.target.value })}
                type="email"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={currentBranch.status}
                  label="Status"
                  onChange={(e) => setCurrentBranch({ ...currentBranch, status: e.target.value })}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setOpenDialog(false)}
            variant="outlined"
            color="inherit"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            sx={{ 
              backgroundColor: '#4caf50',
              '&:hover': {
                backgroundColor: '#388e3c',
              }
            }}
          >
            {currentBranch._id ? 'Update Branch' : 'Add Branch'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BranchManagement;
