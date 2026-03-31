import "./ProcessingStatus.scss";

interface ProcessingStatusProps {
  text: string;
  percent?: number;
}

const clampPercent = (value?: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, value));
};

export default function ProcessingStatus({
  text,
  percent,
}: ProcessingStatusProps) {
  const progress = clampPercent(percent);

  return (
    <section className="processing-status">
      <div className="processing-status__label-row">
        <span>{text}</span>
        <strong>{progress}%</strong>
      </div>

      <div className="processing-status__bar">
        <div
          className="processing-status__fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </section>
  );
}
