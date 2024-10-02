import React, { useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Register all necessary components, including scales
Chart.register(...registerables);

const ReadingChart = ({ chartData }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartInstance = chartRef.current?.chartInstance;

    if (chartInstance) {
      chartInstance.update();
    }

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [chartData]);

  return (
    <Line
      ref={chartRef}
      data={chartData}
      options={{
        plugins: {
          title: {
            display: true,
            text: 'Blood Pressure Readings'
          }
        },
        scales: {
          x: {
            type: 'category',
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Blood Pressure'
            }
          }
        }
      }}
    />
  );
};

export default ReadingChart;