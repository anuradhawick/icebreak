import type { FunctionComponent } from "react";
import { useNavigate } from "react-router";

const AboutIcon: FunctionComponent = () => {
  const navigate = useNavigate();
  const activeRoute = window.location.pathname;
  const inAboutPage = activeRoute.endsWith("/about");

  const handleClick = () => {
    if (!inAboutPage) {
      navigate("/about");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center 
      text-cyan-900 font-semibold 
      text-2xl justify-center rounded-full 
      bg-cyan-400 hover:bg-cyan-500 focus:outline-none 
      w-10 h-10 shadow-md transition-colors cursor-pointer 
      hover:shadow-cyan-400/60 hover:shadow-[0_0_16px_4px_rgba(34,211,238,0.6)]"
      aria-label="Help"
      type="button"
    >
      ?
    </button>
  );
};

export default AboutIcon;
