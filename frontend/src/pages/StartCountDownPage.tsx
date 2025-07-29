import { useState, type FunctionComponent } from "react";
import DigitalClockEditor from "../components/digital-clockface/DigitalClockEditor";
import Button from "../components/Button";
import ErrorAlert from "../components/Error";

interface StartCountDownPageAPIResponse {
  id?: string;
  error?: string;
}

const StartCountDownPage: FunctionComponent = () => {
  const [countDownTime, setCountDownTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [disabled, setDisabled] = useState<boolean>(true);
  const handleCreateCountdown = async () => {
    setError(null);

    const fromTimeMillis = Date.now();
    const durationMillis =
      countDownTime.hours * 60 * 60 * 1000 +
      countDownTime.minutes * 60 * 1000 +
      countDownTime.seconds * 1000;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/timer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromTimeMillis,
          duration: durationMillis,
        }),
      });

      const responseData =
        (await response.json()) as StartCountDownPageAPIResponse;

      if (response.ok) {
        const countdownId = responseData.id;
        console.log("Countdown started successfully:", countdownId);
      } else {
        setError(responseData.error || "Failed to start countdown");
        console.error("Failed to start countdown");
      }
    } catch (err) {
      console.error("Error starting countdown:", err);
      setError("Failed to start countdown. Please try again.");
    }
  };
  const onChange = (hours: number, minutes: number, seconds: number) => {
    if (hours <= 0 && minutes <= 0 && seconds <= 0) {
      setDisabled(true);
      return;
    } else {
      setDisabled(false);
      setCountDownTime({ hours, minutes, seconds });
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-4 items-center justify-center bg-black h-screen">
        <h2 className="text-cyan-400 text-6xl drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]">
          Create Countdown
        </h2>
        <DigitalClockEditor onChange={onChange} />
        <Button
          label="Start Countdown"
          onClick={handleCreateCountdown}
          disabled={disabled}
        />
        {error && <ErrorAlert message={error} closed={() => setError(null)} />}
        {disabled && (
          <div className="text-cyan-400 italic text-sm">
            Countdown cannot be started with zero time.
          </div>
        )}
      </div>
    </>
  );
};

export default StartCountDownPage;
