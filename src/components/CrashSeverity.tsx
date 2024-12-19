interface CrashTypeProps {
  selectedOption: string;
  handleOptionClick: (option: string) => void;
}

import { Button } from "@/components/ui/button";

const CrashSeverity = (props: CrashTypeProps) => {
  return (
    <div className="w-full flex justify-between">
      <Button
        className={`w-full h-9 text-lg px-3 py-2 rounded-none rounded-l-sm border border-r-0 border-blue-500  ${
          props.selectedOption === "INJURY"
            ? "bg-blue-500 text-white"
            : "bg-white text-blue-500 hover:bg-blue-500 hover:text-white"
        }`}
        onClick={() => props.handleOptionClick("INJURY")}
      >
        INJURIES
      </Button>
      <Button
        className={`w-full h-9 text-lg px-3 py-2 rounded-none rounded-r-sm border border-l-0 border-blue-500 ${
          props.selectedOption === "FATAL"
            ? "bg-blue-500 text-white"
            : "bg-white text-blue-500 hover:bg-blue-500 hover:text-white"
        }`}
        onClick={() => props.handleOptionClick("FATAL")}
      >
        FATALITIES
      </Button>
    </div>
  );
};

export default CrashSeverity;
