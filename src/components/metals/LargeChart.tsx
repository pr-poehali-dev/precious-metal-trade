interface Metal {
  id: string;
  chartPoints: number[];
  [key: string]: unknown;
}

interface LargeChartProps {
  metal: Metal;
  history?: number[];
}

const LargeChart = ({ metal, history }: LargeChartProps) => {
  const w = 600, h = 120;
  const points = (history && history.length > 1) ? history : metal.chartPoints;
  const min = Math.min(...points) - 2;
  const max = Math.max(...points) + 2;
  const range = max - min || 1;
  const xs = points.map((_, i) => (i / (points.length - 1)) * w);
  const ys = points.map((p) => h - ((p - min) / range) * (h - 8) - 4);
  const d = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ");
  const fill = `${d} L${w},${h} L0,${h} Z`;
  const up = points[points.length - 1] >= points[0];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} fill="none" preserveAspectRatio="none" className="w-full h-28">
      <defs>
        <linearGradient id={`grad-${metal.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={up ? "#2d7a4f" : "#c0392b"} stopOpacity="0.12" />
          <stop offset="100%" stopColor={up ? "#2d7a4f" : "#c0392b"} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill={`url(#grad-${metal.id})`} />
      <path d={d} stroke={up ? "#2d7a4f" : "#c0392b"} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default LargeChart;
