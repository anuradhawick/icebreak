import type { FunctionComponent } from "react";
import { Link } from "react-router";

interface HomePageProps {
  title: string;
}

const HomePage: FunctionComponent<HomePageProps> = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-cyan-300">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <p className="text-lg mb-8">Welcome to the IceBreak Group Count Down!</p>
      <img
        src="/icebreak-logo.png"
        alt="IceBreak Logo"
        className="mb-8 max-w-1/2 max-h-1/2 aspect-square rounded-2xl shadow-[0_0_16px_4px_rgba(34,211,238,1)]"
      />
      <Link
        to="/start"
        className="px-6 py-3 bg-cyan-400 
        text-cyan-900 font-semibold rounded shadow-lg 
        hover:shadow-[0_0_16px_4px_rgba(34,211,238,0.6)] transition duration-300"
      >
        Get Started...
      </Link>
    </div>
  );
};

export default HomePage;
