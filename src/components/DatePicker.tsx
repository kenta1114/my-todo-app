import React from "react";
import {
  TextField,
  Box,
  IconButton,
  Chip,
  Menu,
  MenuItem
} from '@mui/material';

import { formatDate, getDateStatus, getDateStatusColor} from '../utils/dateUtils';

interface DatePickerProps{
  dueDate?:Date;
  onDateChange:(date:Date | undefined)=>void;
  label?:string;
  size?:'small'|'medium';
}

const DatePicker: React.FC<DatePickerProps> = ({
  dueDate,
  onDateChange,
  label = "期限日時",
  size = 'small'
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleQuickDateSelect = (date: Date) => {
    onDateChange(date);
    setAnchorEl(null);
  };

  const getQuickDateOptions = () => {
    const now = new Date();
    const options = [
      { label: '今日', date: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59) },
      { label: '明日', date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59) },
      { label: '今週末', date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + (6 - now.getDay()), 23, 59) },
      { label: '来週', date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 23, 59) },
    ];
    return options;
  };

  const formatDateTimeLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const parseDateTime = (dateTimeString: string): Date => {
    return new Date(dateTimeString);
  };

  return(
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <TextField
        type="datetime-local"
        label={label}
        value={dueDate ? formatDateTimeLocal(dueDate) : ''}
        onChange={(e) => {
          if (e.target.value) {
            onDateChange(parseDateTime(e.target.value));
          } else {
            onDateChange(undefined);
          }
        }}
        size={size}
        sx={{ 
          minWidth: 200,
          '& .MuiInputLabel-root': {
            fontSize: size === 'small' ? '0.875rem' : '1rem'
          }
        }}
        InputLabelProps={{
          shrink: true,
        }}
    />

    {dueDate && (
        <Chip
          label={formatDate(dueDate)}
          size={size}
          sx={{
            backgroundColor: getDateStatusColor(getDateStatus(dueDate)) + '20',
            color: getDateStatusColor(getDateStatus(dueDate)),
            fontWeight: 'bold'
          }}
          onDelete={() => onDateChange(undefined)}
        />
    )}

    <IconButton
        size={size}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{ fontSize: size === 'small' ? '1rem' : '1.2rem' }}
      >
        ⚡
    </IconButton>

    <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {getQuickDateOptions().map((option, index) => (
          <MenuItem
            key={index}
            onClick={() => handleQuickDateSelect(option.date)}
          >
            {option.label}
          </MenuItem>
        ))}
    </Menu>
  </Box>
  )
};

export default DatePicker;

