import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertCircleIcon } from "lucide-react";
import { useState } from "react";

interface ConfirmationDialogProps {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel?: () => void;
  children: React.ReactNode;
  type: "warning" | "error" | "info" | "success";
}

export function ConfirmationDialog({
  title,
  description,
  onConfirm,
  onCancel,
  children,
  type,
}: ConfirmationDialogProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  const handleCancel = () => {
    onCancel?.();
    setOpen(false);
  };

  const iconClasses = {
    warning: "text-orange-600 bg-orange-100",
    error: "text-red-500 bg-red-50",
    info: "text-blue-500 bg-blue-50",
    success: "text-green-500 bg-green-50",
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertCircleIcon
            className={`p-2 rounded-lg ${iconClasses[type]} mx-auto sm:mx-0`}
            size={50}
            type={type}
          />
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} className="h-[40px] ">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className=" h-[40px]  bg-gradient-to-r from-[#2C6BAC] to-[#38B2AC] py-[8px] font-semibold text-[15px] leading-[22px]"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
