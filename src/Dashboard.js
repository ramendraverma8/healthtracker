import React, { useState, useEffect } from 'react';
import { Grid, Paper, Box, Container, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ref, onValue, off } from "firebase/database";
import { auth, db } from './firebaseConfig';
import FilterControls from './FilterControls';
import ReadingChart from './ReadingChart';
import ReadingList from './ReadingList';

const Dashboard = () => {
  const [readings, setReadings] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Systolic',
        data: [],
        borderColor: 'red',
        fill: false
      },
      {
        label: 'Diastolic',
        data: [],
        borderColor: 'blue',
        fill: false
      }
    ]
  });

  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    const userId = user.uid;
    const readingsRef = ref(db, `users/${userId}/readings`);

    onValue(readingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setReadings(Object.entries(data).map(([key, value]) => ({ id: key, ...value })));
      } else {
        setReadings([]);
      }
    });

    return () => off(readingsRef, 'value');
  }, []);

  useEffect(() => {
    const filteredReadings = readings.filter((reading) => {
      const readingDate = new Date(reading.timestamp);
      const isWithinDateRange = (!startDate || readingDate >= startDate) && (!endDate || readingDate <= endDate);
      const isMatchingFilterType = filterType === 'all' || (filterType === 'morning' && readingDate.getHours() < 12) || (filterType === 'evening' && readingDate.getHours() >= 12);
      return isWithinDateRange && isMatchingFilterType;
    });

    const labels = filteredReadings.map(reading => new Date(reading.timestamp).toLocaleString());
    const systolicData = filteredReadings.map(reading => reading.systolic);
    const diastolicData = filteredReadings.map(reading => reading.diastolic);

    setChartData({
      labels,
      datasets: [
        {
          label: 'Systolic',
          data: systolicData,
          borderColor: 'red',
          fill: false
        },
        {
          label: 'Diastolic',
          data: diastolicData,
          borderColor: 'blue',
          fill: false
        }
      ]
    });
  }, [readings, startDate, endDate, filterType]);

  return (
    <Container>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <FilterControls
                startDate={startDate}
                endDate={endDate}
                filterType={filterType}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                setFilterType={setFilterType}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <ReadingChart chartData={chartData} />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <ReadingList readings={readings} />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/add-reading')}
              sx={{ mt: 2 }}
            >
              Add Reading
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;