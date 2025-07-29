import type { FunctionComponent } from "react";

const AboutPage: FunctionComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <img
        src="/icebreak-logo.png"
        alt="IceBreak Logo"
        className="mt-4 max-w-1/2 max-h-1/2 aspect-square rounded-2xl"
      />
      <p className="text-cyan-300 mt-4">
        IceBreak is a group countdown timer application built with React.
      </p>
      <p className="text-cyan-300 mt-4">
        Anuradha Wickramarachchi &copy; {new Date().getFullYear()}. All rights
        reserved.
      </p>
      <p className="text-cyan-300 mt-4">
        Source code is available on{" "}
        <a
          href="https://github.com/anuradhawick/icebreak"
          className="text-cyan-400 underline"
        >
          GitHub
        </a>
      </p>
    </div>
  );
};

export default AboutPage;
