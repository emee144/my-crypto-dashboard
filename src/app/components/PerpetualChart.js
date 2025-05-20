'use client';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from 'chart.js';

ChartJS.register(Title, Tooltip, LineElement, CategoryScale, LinearScale, PointElement);

const PerpetualChart = () => {
  const rawData = [
    { timestamp: 1713744000, price: 3125 },
    { timestamp: 1713747600, price: 3132 },
  ];

  const data = {
    labels: rawData.map(item =>
      new Date(item.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    ),
    datasets: [
      {
        label: 'Perpetual Price',
        data: rawData.map(item => item.price),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div className="mb-4">
      <h3 className="text-xl font-semibold mb-4">Perpetual Market Chart</h3>
      <Line data={data} />
    </div>
  );
};

export default PerpetualChart;