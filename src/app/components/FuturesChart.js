import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, LineElement, CategoryScale, LinearScale, PointElement, Filler } from 'chart.js';

// Register the required Chart.js components, including the Filler plugin
ChartJS.register(Title, Tooltip, LineElement, CategoryScale, LinearScale, PointElement, Filler);

const FuturesChart = () => {
  const data = {
    labels: ['1', '2', '3', '4', '5', '6', '7'], // Example time points (can be replaced with actual timestamps)
    datasets: [
      {
        label: 'Futures Price',
        data: [100, 101, 103, 102, 105, 107, 110], // Mock price data
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true, // Enables filling the area under the line chart
      },
    ],
  };

  return (
    <div className="mb-4">
      <h3 className="text-xl font-semibold mb-4">Futures Price Chart</h3>
      <Line data={data} />
    </div>
  );
};

export default FuturesChart;