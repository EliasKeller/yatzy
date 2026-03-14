export default function DiceIcon({ value, size = 28 }) {
  const dotPositions = {
    1: [[50, 50]],
    2: [[28, 28], [72, 72]],
    3: [[28, 28], [50, 50], [72, 72]],
    4: [[28, 28], [72, 28], [28, 72], [72, 72]],
    5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
    6: [
      [28, 25],
      [72, 25],
      [28, 50],
      [72, 50],
      [28, 75],
      [72, 75],
    ],
  };

  const dots = dotPositions[value] || [];

  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <rect
        x="2"
        y="2"
        width="96"
        height="96"
        rx="16"
        fill="#1f2937"
        stroke="#4b5563"
        strokeWidth="3"
      />
      {dots.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="10" fill="#d1d5db" />
      ))}
    </svg>
  );
}