"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const defaultDate = {
  from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  to: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
};

interface Props {
  className?: string;
  value: DateRange | undefined;
  onChange: (date: DateRange | undefined) => void;
}

export function DatePickerWithRange({
  className,
  value = defaultDate,
  onChange,
}: Props) {
  const [date, setDate] = React.useState<DateRange | undefined>(value);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              " w-full md:w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from || date?.from}
            selected={date}
            onSelect={(range) => {
              if (range) {
                setDate(range);
                onChange(range);
              }
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
