interface CrashTypeProps {
  selectedOption: string;
  handleOptionClick: (option: string) => void;
}
import { Button } from "@/components/ui/button";
import { FaBicycle, FaCar, FaStreetView } from "react-icons/fa";

const CrashType = (props: CrashTypeProps) => {
  return (
    <div className="w-full flex justify-between h-9 ">
      <Button
        className={`w-full py-1 rounded-none rounded-l-sm border border-r-0 border-blue-500 ${
          props.selectedOption === "MOTOR VEHICLE"
            ? "bg-blue-500 text-white"
            : "bg-white text-blue-500 hover:bg-blue-500 hover:text-white"
        }`}
        onClick={() => props.handleOptionClick("MOTOR VEHICLE")}
      >
        <FaCar />
      </Button>
      <Button
        className={`w-full py-1 rounded-none border border-x-0 border-blue-500 ${
          props.selectedOption === "PEDESTRIAN"
            ? "bg-blue-500 text-white"
            : "bg-white text-blue-500 hover:bg-blue-500 hover:text-white"
        }`}
        onClick={() => props.handleOptionClick("PEDESTRIAN")}
      >
        <FaStreetView />
      </Button>
      <Button
        className={`w-full py-1 rounded-none border border-x-0 border-blue-500 ${
          props.selectedOption === "BICYCLIST"
            ? "bg-blue-500 text-white"
            : "bg-white text-blue-500 hover:bg-blue-500 hover:text-white"
        }`}
        onClick={() => props.handleOptionClick("BICYCLIST")}
      >
        <FaBicycle style={{ width: "24px", height: "24px" }} />
      </Button>
      <Button
        size="default"
        className={`w-full py-1 rounded-none rounded-r-sm border border-l-0 border-blue-500 ${
          props.selectedOption === "ALL"
            ? "bg-blue-500 text-white"
            : "bg-white text-blue-500 hover:bg-blue-500 hover:text-white"
        }`}
        onClick={() => props.handleOptionClick("ALL")}
      >
        ALL
      </Button>
    </div>
  );
};

export default CrashType;
