import { useEffect, useState, type FunctionComponent } from "react";

interface DigitalClockProps {
  fromEpochMillis: number;
  durationMillis: number;
  expired?: () => void;
}

const DigitalClock: FunctionComponent<DigitalClockProps> = ({
  fromEpochMillis,
  durationMillis,
  expired,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(
    Math.max(0, fromEpochMillis + durationMillis - Date.now())
  );
  useEffect(() => {
    // Update timer every second
    const interval = setInterval(() => {
      const now = Date.now();
      const end = fromEpochMillis + durationMillis;
      const remaining = Math.max(0, end - now);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        expired?.();
      }
    }, 1000);

    // Clean up
    return () => clearInterval(interval);
  }, [fromEpochMillis, durationMillis, expired]);

  const hours = Math.floor(timeLeft / 3600000);
  const minutes = Math.floor((timeLeft % 3600000) / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  const formattedTime =
    hours > 0
      ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
          2,
          "0"
        )}:${String(seconds).padStart(2, "0")}`
      : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
          2,
          "0"
        )}`;
  const digits = formattedTime.split("");

  return (
    <div className="flex items-center justify-center bg-black">
      <div className="text-lg md:text-5xl lg:text-9xl font-mono text-center text-white tracking-widest">
        {digits.map((char, index) => (
          <span
            key={index}
            className={
              char === ":"
                ? "mx-0.5 sm:mx-2 text-gray-500"
                : "px-4 py-2 mx-1 rounded-xl bg-gray-900 text-cyan-400 shadow-[0_0_10px_#22d3ee]"
            }
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
};

export default DigitalClock;
