import { Activity } from "../../@types/activity";
import {
  Chart as ChartJS,
  Tooltip,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";
import { CrosshairPlugin } from "chartjs-plugin-crosshair";
import { useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import { HCoord, haversineDistance } from "../../utils/haversineDistance";
function ElevationChart({ activity }: { activity: Activity }) {
  const data = activity.elevation.elevationPoints.map((data) =>
    parseFloat(data.toFixed(0))
  );

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const chartData: ChartData = {
    datasets: [
      {
        label: "Elevation",
        data: data,
        fill: true,
        borderColor: "#66ccff",
        backgroundColor: "#66ccff66",
        tension: 0.1,
        spanGaps: true,
        yAxisID: "elevation",
        pointRadius: 0,
        pointHoverRadius: 0,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        display: false,
        labels: activity.distancePoints,
      },
    },
    plugins: {
      tooltip: {
        mode: "index",
        intersect: false,
        displayColors: false,
        callbacks: {
          title: () => "",
          label: (context: any) => {
            const elevation = context.parsed.y || 0;
            const additionalData = `Distance: ${formatDistanceLabel(
              context.label
            )}`;
            return [`Elevation: ${elevation} m`, additionalData];
          },
        },
      },
      legend: { display: false },
    },
  };

  function formatDistanceLabel(value: number) {
    return `${(value / 1000).toFixed(2)}km`;
  }

  return (
    <div className="p-4 border-gray-300 border-[1px] ml-4 mr-4 rounded-md">
      <Line data={chartData as any} options={chartOptions as any} />
    </div>
  );
}
export default ElevationChart;
