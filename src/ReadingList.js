import React from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

const ReadingList = ({ readings }) => {
  return (
    <List>
      {readings.length === 0 ? (
        <Typography variant="body1">No readings available.</Typography>
      ) : (
        readings.map((reading) => (
          <ListItem key={reading.id}>
            <ListItemText
              primary={`Systolic: ${reading.systolic}, Diastolic: ${reading.diastolic}`}
              secondary={new Date(reading.timestamp).toLocaleString()}
            />
          </ListItem>
        ))
      )}
    </List>
  );
};

export default ReadingList;