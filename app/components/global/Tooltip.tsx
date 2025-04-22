import React from "react";
import {
  Tooltip as ShadcnTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
const Tooltip = ({
  children,
  text,
}: {
  children: React.ReactNode;
  text: string;
}) => {
  return (
    <TooltipProvider>
      <ShadcnTooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent className="capitalize">{text}</TooltipContent>
      </ShadcnTooltip>
    </TooltipProvider>
  );
};

export default Tooltip;
