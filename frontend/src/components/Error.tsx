import type { FunctionComponent } from "react";

interface ErrorAlertProps {
  message: string;
  closed?: () => void;
}

const ErrorAlert: FunctionComponent<ErrorAlertProps> = ({
  message,
  closed,
}) => {
  return (
    <div className="bg-red-500 text-white p-4 rounded">
      <div className="flex items-center justify-between">
        <p>{message}</p>
        {closed && (
          <button
            type="button"
            className="ml-4 text-white hover:text-red-200 focus:outline-none cursor-pointer"
            aria-label="Close"
            onClick={() => {
              closed();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;
