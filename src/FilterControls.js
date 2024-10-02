import React from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

const FilterControls = ({ startDate, endDate, filterType, setStartDate, setEndDate, setFilterType }) => {
  return (
    <Box>
      <TextField
        id="startDate"
        label="Start Date"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={startDate ? startDate.toISOString().split('T')[0] : ''}
        onChange={(e) => setStartDate(new Date(e.target.value))}
        fullWidth
        margin="normal"
      />
      <TextField
        id="endDate"
        label="End Date"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={endDate ? endDate.toISOString().split('T')[0] : ''}
        onChange={(e) => setEndDate(new Date(e.target.value))}
        fullWidth
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel id="filter-type-label">Filter Type</InputLabel>
        <Select
          labelId="filter-type-label"
          id="filter-type"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="morning">Morning</MenuItem>
          <MenuItem value="evening">Evening</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default FilterControls;