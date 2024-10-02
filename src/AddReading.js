import React, { useState } from 'react';
import { ref, push } from "firebase/database";
import { auth, db } from './firebaseConfig'; // Import the auth and db services
import { useNavigate } from 'react-router-dom'; // Import for redirection
import { TextField, Button, Typography, Container, Box, Paper } from '@mui/material';

const AddReading = () => {
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [error, setError] = useState(null); // State to handle errors
  const navigate = useNavigate(); // Hook for navigation

  const handleAddReading = () => {
    const user = auth.currentUser;
    if (!user) {
      setError('User not authenticated');
      return;
    }
    
    const userId = user.uid;
    const readingsRef = ref(db, `users/${userId}/readings`);

    // Create a new reading object
    const newReading = {
      systolic: parseInt(systolic, 10), // Convert to integer
      diastolic: parseInt(diastolic, 10), // Convert to integer
      timestamp: Date.now() // Get current timestamp
    };

    // Push the new reading to the database
    push(readingsRef, newReading)
      .then(() => {
        // Clear the input fields after successful addition
        setSystolic('');
        setDiastolic('');
        setError(null); // Clear any previous errors
        console.log('Reading added successfully!');
        navigate('/dashboard'); // Redirect to dashboard
      })
      .catch((error) => {
        // Handle errors (e.g., network issues, invalid data)
        setError('Error adding reading: ' + error.message);
        console.error('Error adding reading:', error);
      });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Add Blood Pressure Reading
          </Typography>
          {error && <Typography color="error">{error}</Typography>} {/* Display error message */}
          <form onSubmit={(event) => {
            event.preventDefault();
            handleAddReading();
          }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="systolic"
              label="Systolic"
              type="number"
              value={systolic}
              onChange={(e) => setSystolic(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="diastolic"
              label="Diastolic"
              type="number"
              value={diastolic}
              onChange={(e) => setDiastolic(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              Add Reading
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default AddReading;