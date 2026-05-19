import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { useAdmin } from "../context/AdminContext";
import { MONTHLY_REVENUE } from "../data/mockData";

export default function RevenueChart() {
  const ref = useRef(null);
  const chart = useRef(null);
  const { darkMode } = useAdmin();

  useEffect(() => {
    if (!ref.current) return;
    const tick = darkMode ? "#94a3b8" : "#64748b";
    const grid = darkMode ? "rgba(71,85,105,0.35)" : "rgba(226,232,240,0.9)";
    chart.current?.destroy();
    chart.current = new Chart(ref.current, {
      type: "line",
      data: {
        labels: MONTHLY_REVENUE.map((x) => x.m),
        datasets: [{
          label: "Doanh thu (triệu)",
          data: MONTHLY_REVENUE.map((x) => x.v),
          borderColor: "#10b981",
          backgroundColor: "rgba(16,185,129,0.12)",
          fill: true,
          tension: 0.4,
          pointRadius: 4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: tick } } },
        scales: {
          x: { ticks: { color: tick }, grid: { color: grid } },
          y: { ticks: { color: tick }, grid: { color: grid } },
        },
      },
    });
    return () => chart.current?.destroy();
  }, [darkMode]);

  return (
    <section className="chart-h">
      <canvas ref={ref} />
    </section>
  );
}
