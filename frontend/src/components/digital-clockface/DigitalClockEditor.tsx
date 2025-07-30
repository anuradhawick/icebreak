import { useState, type FunctionComponent } from "react";
import "./DigitalClockEditor.css";

interface DigitalClockEditorProps {
  initialHours?: number;
  initialMinutes?: number;
  initialSeconds?: number;
  onChange?: (hours: number, minutes: number, seconds: number) => void;
}

const DigitalClockEditor: FunctionComponent<DigitalClockEditorProps> = ({
  initialHours = 0,
  initialMinutes = 0,
  initialSeconds = 0,
  onChange,
}) => {
  const [hours, setHours] = useState<number>(initialHours);
  const [minutes, setMinutes] = useState<number>(initialMinutes);
  const [seconds, setSeconds] = useState<number>(initialSeconds);

  const handleChange = (
    type: "hours" | "minutes" | "seconds",
    value: string
  ) => {
    let num = parseInt(value.replace(/\D/g, ""), 10) || 0;
    let newHours = hours;
    let newMinutes = minutes;
    let newSeconds = seconds;

    switch (type) {
      case "hours":
        num = Math.max(0, Math.min(99, num));
        setHours(num);
        newHours = num;
        break;
      case "minutes":
        num = Math.max(0, Math.min(59, num));
        setMinutes(num);
        newMinutes = num;
        break;
      case "seconds":
        num = Math.max(0, Math.min(59, num));
        setSeconds(num);
        newSeconds = num;
        break;
    }

    if (onChange) {
      onChange(newHours, newMinutes, newSeconds);
    }
  };

  return (
    <div className="flex items-center justify-center bg-black">
      <div className="text-lg md:text-5xl lg:text-9xl font-mono text-center text-white tracking-widest">
        <input
          type="number"
          min={0}
          max={99}
          value={String(hours).padStart(2, "0")}
          onChange={(e) => handleChange("hours", e.target.value)}
          className="w-[80px] md:w-[150px] lg:w-[200px] px-2 py-2 mx-1 rounded-xl bg-gray-900 text-cyan-400 shadow-[0_0_10px_#22d3ee] text-center"
        />
        <span className="mx-2 text-gray-500">:</span>
        <input
          type="number"
          min={0}
          max={59}
          value={String(minutes).padStart(2, "0")}
          onChange={(e) => handleChange("minutes", e.target.value)}
          className="w-[80px] md:w-[150px] lg:w-[200px] px-2 py-2 mx-1 rounded-xl bg-gray-900 text-cyan-400 shadow-[0_0_10px_#22d3ee] text-center"
        />
        <span className="mx-2 text-gray-500">:</span>
        <input
          type="number"
          min={0}
          max={59}
          value={String(seconds).padStart(2, "0")}
          onChange={(e) => handleChange("seconds", e.target.value)}
          className="w-[80px] md:w-[150px] lg:w-[200px] px-2 py-2 mx-1 rounded-xl bg-gray-900 text-cyan-400 shadow-[0_0_10px_#22d3ee] text-center"
        />
      </div>
    </div>
  );
};

export default DigitalClockEditor;
