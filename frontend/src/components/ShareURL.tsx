import type { FunctionComponent } from "react";
import Button from "./Button";

interface ShareURLProps {
  url: string;
}

const ShareURL: FunctionComponent<ShareURLProps> = ({ url }) => {
  return (
    <div className="flex flex-col space-y-2 sm:flex-row md:space-x-2 py-4 max-w-full mx-auto items-center">
      <div className="text-cyan-400 text-lg sm:text-2xl">{url}</div>
      <Button
        label="Copy URL"
        onClick={() => navigator.clipboard.writeText(url)}
      />
    </div>
  );
};

export default ShareURL;
