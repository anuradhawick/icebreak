import { useEffect, useState, type FunctionComponent } from "react";
import DigitalClock from "../components/digital-clockface/DigitalClock";
import { useParams } from "react-router";
import Loader from "../components/Loader";
import ShareURL from "../components/ShareURL";
import ErrorAlert from "../components/Error";

interface GetTimeAPIResponse {
  from: number;
  duration: number;
}

const CountDownPage: FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [expired, setExpired] = useState(false);
  const [countDown, setCountDown] = useState<GetTimeAPIResponse>({
    from: 0,
    duration: 0,
  });

  useEffect(() => {
    const fetchCountDown = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/timer/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch countdown data");
        }
        const data = (await response.json()) as GetTimeAPIResponse;
        setCountDown(data);
      } catch (error) {
        console.error("Error fetching countdown:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountDown();
  }, [id]);
  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <>
          <div className="flex flex-col space-y-4 items-center justify-center bg-black text-cyan-300 h-screen">
            <h1 className="text-xl md:text-4xl font-bold mb-4">Countdown</h1>
            <p className="text-sm md:text-lg mb-8 px-5 text-center">
              Counting down to the last second of it!
            </p>
            <DigitalClock
              fromEpochMillis={countDown.from}
              durationMillis={countDown.duration}
              expired={() => setExpired(true)}
            />
            <ShareURL url={`${window.location.origin}/${id}`} />
            {expired && <ErrorAlert message="Countdown has expired." />}
          </div>
        </>
      )}
    </>
  );
};

export default CountDownPage;
