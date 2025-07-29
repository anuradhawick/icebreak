import type { FunctionComponent } from "react";

const Loader: FunctionComponent = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <span
        className="inline-block w-64 h-64 border-8 border-blue-500 border-t-transparent rounded-full animate-spin shadow-[0_0_40px_10px_rgba(59,130,246,0.7)]"
        style={{
          boxShadow:
            "0 0 40px 10px rgba(59,130,246,0.7), inset 0 0 40px 10px rgba(59,130,246,0.5)",
        }}
      ></span>
    </div>
  );
};

export default Loader;
