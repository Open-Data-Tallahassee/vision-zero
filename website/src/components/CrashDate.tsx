interface CrashDateFilterProps {
  toDate: Date;
  fromDate: Date;
  handleToDateChange: (date: Date) => void;
  handleFromDateChange: (date: Date) => void;
}

import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const CrashDate = (props: CrashDateFilterProps) => {
  return (
    <div className="flex flex-col">
      <label htmlFor="from_date" className="text-lg font-bold">
        Start Date:
      </label>
      {/* <input
        type="date"
        value={props.fromDate.toISOString().substr(0, 10)}
        onChange={(event) =>
          props.handleFromDateChange(new Date(event.target.value))
        }
        className="border rounded px-2 py-2"
      /> */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className="w-full pl-3 text-left font-normal"
          >
            {props.fromDate ? (
              format(props.fromDate, "PPP")
            ) : (
              <span>Pick a date</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={props.fromDate}
            onSelect={(day) => day && props.handleFromDateChange(day)}
            disabled={(date) =>
              date > new Date() || date < new Date("1900-01-01")
            }
            initialFocus
            defaultMonth={props.fromDate}
          />
        </PopoverContent>
      </Popover>

      <label htmlFor="to_date" className="text-lg font-bold mt-2">
        End Date:
      </label>
      {/* <input
        type="date"
        value={props.toDate.toISOString().substr(0, 10)}
        onChange={(event) =>
          props.handleToDateChange(new Date(event.target.value))
        }
        className="border rounded px-2 py-2 mb-2"
      /> */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className="w-full pl-3 text-left font-normal"
          >
            {props.toDate ? (
              format(props.toDate, "PPP")
            ) : (
              <span>Pick a date</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={props.toDate}
            onSelect={(day) => day && props.handleToDateChange(day)}
            disabled={(date) =>
              date > new Date() || date < new Date("1900-01-01")
            }
            initialFocus
            defaultMonth={props.toDate}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CrashDate;
