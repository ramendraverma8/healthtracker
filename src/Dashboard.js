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
    const labels = readings.map(reading => new Date(reading.timestamp).toLocaleString());
    const systolicData = readings.map(reading => reading.systolic);
    const diastolicData = readings.map(reading => reading.diastolic);

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
  }, [readings]);

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
// import React, { useState, useEffect } from 'react';
// import { ref, onValue, off } from "firebase/database";
// import { db, auth } from './firebaseConfig';
// import { useNavigate } from 'react-router-dom';
// import { Container, Grid, Paper, Typography, Box } from '@mui/material';
// import FilterControls from './FilterControls';
// import ReadingList from './ReadingList';
// import ReadingChart from './ReadingChart';

// const Dashboard = () => {
//   const [readings, setReadings] = useState([]);
//   const [chartData, setChartData] = useState({
//     labels: [],
//     datasets: [
//       {
//         label: 'Systolic',
//         data: [],
//         borderColor: 'red',
//         fill: false
//       },
//       {
//         label: 'Diastolic',
//         data: [],
//         borderColor: 'blue',
//         fill: false
//       }
//     ]
//   });
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [filterType, setFilterType] = useState('all');
//   const navigate = useNavigate();

//   const prepareChartData = (readings) => {
//     const labels = readings.map(reading => new Date(reading.timestamp).toLocaleDateString());
//     const systolicData = readings.map(reading => reading.systolic);
//     const diastolicData = readings.map(reading => reading.diastolic);

//     return {
//       labels: labels,
//       datasets: [
//         {
//           label: 'Systolic',
//           data: systolicData,
//           borderColor: 'red',
//           fill: false
//         },
//         {
//           label: 'Diastolic',
//           data: diastolicData,
//           borderColor: 'blue',
//           fill: false
//         }
//       ]
//     };
//   };

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (user) {
//         const userId = user.uid;
//         const readingsRef = ref(db, `users/${userId}/readings`);

//         onValue(readingsRef, (snapshot) => {
//           const data = snapshot.val();
//           if (data) {
//             setReadings(Object.entries(data).map(([key, value]) => ({ id: key, ...value })));
//           } else {
//             setReadings([]);
//           }
//         });

//         return () => off(readingsRef, 'value');
//       } else {
//         navigate('/');
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     const filteredReadings = readings.filter((reading) => {
//       const readingDate = new Date(reading.timestamp);
//       if (filterType === 'all') {
//         return true;
//       } else if (filterType === 'morning' && readingDate.getHours() < 12) {
//         return true;
//       } else if (filterType === 'evening' && readingDate.getHours() >= 12) {
//         return true;
//       } else if (startDate && endDate) {
//         return readingDate >= startDate && readingDate <= endDate;
//       }
//       return false;
//     });

//     setChartData(prepareChartData(filteredReadings));
//   }, [readings, startDate, endDate, filterType]);

//   return (
//     <Container maxWidth="lg">
//       <Box sx={{ mt: 4 }}>
//         <Typography variant="h4" gutterBottom>
//           Your Blood Pressure Readings
//         </Typography>
//         <Grid container spacing={3}>
//           <Grid item xs={12} md={4}>
//             <Paper sx={{ p: 2 }}>
//               <FilterControls
//                 startDate={startDate}
//                 endDate={endDate}
//                 filterType={filterType}
//                 setStartDate={setStartDate}
//                 setEndDate={setEndDate}
//                 setFilterType={setFilterType}
//               />
//             </Paper>
//           </Grid>
//           <Grid item xs={12} md={8}>
//             <Paper sx={{ p: 2 }}>
//               <ReadingChart chartData={chartData} />
//             </Paper>
//           </Grid>
//           <Grid item xs={12}>
//             <Paper sx={{ p: 2 }}>
//               <ReadingList readings={readings} />
//             </Paper>
//           </Grid>
//         </Grid>
//       </Box>
//     </Container>
//   );
// };

// export default Dashboard;