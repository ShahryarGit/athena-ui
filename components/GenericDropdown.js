import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const GenericDropdown = ({ label, defaultValue, options, disabled, onChange, style }) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  useEffect(() => {
    setSelectedValue(defaultValue);
  }, [defaultValue]);

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedValue(selectedValue);
    onChange(selectedValue);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="generic-dropdown-label">{label}</InputLabel>
      <Select
        labelId="generic-dropdown-label"
        id="generic-dropdown"
        value={selectedValue}
        label={label}
        onChange={handleChange}
        disabled={disabled}
        style={style}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default GenericDropdown;
