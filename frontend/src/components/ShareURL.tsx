import type { FunctionComponent } from "react";
import Button from "./Button";

interface ShareURLProps {
  url: string;
}

const ShareURL: FunctionComponent<ShareURLProps> = ({ url }) => {
  return (
    <div className="flex space-x-2 py-4">
      <input
        type="text"
        className="text-cyan-400 text-2xl"
        value={url}
        readOnly
      />
      <Button
        label="Copy URL"
        onClick={() => navigator.clipboard.writeText(url)}
      />
    </div>
  );
};

export default ShareURL;
