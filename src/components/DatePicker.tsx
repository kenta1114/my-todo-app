import React from "react";
import {
  TextField,
  Box,
  Chip
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
  </Box>
  )
};

export default DatePicker;
