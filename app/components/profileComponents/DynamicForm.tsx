import React, { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Clipboard, Copy, Pencil, Save } from "lucide-react";
import { Translate } from "../global/Translate";

// Helper to render dynamic form fields recursively
const renderFields = (
  obj: any,
  path: string[] = [],
  onChange: (path: string[], value: any) => void,
  isEditing: boolean
) => {
  return Object.entries(obj).map(([key, value]) => {
    const currentPath = [...path, key];

    if (typeof value === "string") {
      return (
        <div
          key={currentPath.join(".")}
          className="mb-4 overflow-auto  max-w-full border-l-2 pl-2"
        >
          <div className="flex items-center justify-between gap-2 mb-1">
            <Label className="block text-sm font-medium">{key}</Label>
            {isEditing && (
              <Button
                variant="outline"
                className="!py-0 !px-2 cursor-pointer"
                onClick={() => {
                  navigator.clipboard.readText().then((text) => {
                    onChange(currentPath, text);
                  });
                }}
              >
                <Clipboard />
              </Button>
            )}
          </div>
          {isEditing ? (
            <Textarea
              value={value}
              onChange={(e) => onChange(currentPath, e.target.value)}
              className="w-full max-w-[95%] !resize-none "
            />
          ) : (
            <p className="bg-gray-50  rounded-lg p-2 text-sm max-w-full max-h-[300px] whitespace-pre-wrap break-words overflow-auto">
              {value || "-"}
            </p>
          )}
        </div>
      );
    } else if (Array.isArray(value)) {
      return (
        <div key={currentPath.join(".")} className="mb-4">
          <label className="block text-sm font-medium mb-2">{key}</label>
          {value.map((item, index) => (
            <div key={index} className="ml-4 border p-2 rounded mb-2">
              {renderFields(
                item,
                [...currentPath, String(index)],
                onChange,
                isEditing
              )}
            </div>
          ))}
        </div>
      );
    } else if (typeof value === "object" && value !== null) {
      return (
        <div key={currentPath.join(".")} className="mb-4">
          <label className="block text-md font-semibold mb-2">{key}</label>
          <div className="ml-4">
            {renderFields(value, currentPath, onChange, isEditing)}
          </div>
        </div>
      );
    } else {
      return null;
    }
  });
};

// Helper to update nested value based on path
const updateNestedValue = (obj: any, path: string[], value: any): any => {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  const index = Number(head);
  if (!isNaN(index) && Array.isArray(obj)) {
    const updatedArr = [...obj];
    updatedArr[index] = updateNestedValue(obj[index], rest, value);
    return updatedArr;
  }
  return {
    ...obj,
    [head]: updateNestedValue(obj[head], rest, value),
  };
};

interface DynamicNoteFormProps {
  initialData: any;
  onUpdate: (updated: any) => Promise<void>;
}

const DynamicNoteForm: React.FC<DynamicNoteFormProps> = ({
  initialData,
  onUpdate,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (path: string[], value: any) => {
    setFormData((prev: any) => updateNestedValue(prev, path, value));
  };

  const handleToggleEdit = async () => {
    if (isEditing) {
      await onUpdate(formData);
    }
    setIsEditing(!isEditing);
  };

  useEffect(() => {
    console.log("Initial data", initialData);
    setFormData(initialData);
  }, [initialData]);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button
          className="bg-gradient-to-r from-[#2C6BAC] to-[#38B2AC] text-white rounded-[10px] py-[20px] px-[16px]"
          onClick={handleToggleEdit}
        >
          {isEditing ? <Save /> : <Pencil />}
          <span className="text-[14px] leading-[20px] font-semibold">
            <Translate>{isEditing ? "Save" : "Edit"}</Translate>
          </span>
        </Button>
      </div>
      <div id="dynamic-form">
        {renderFields(formData, [], handleChange, isEditing)}
      </div>
    </div>
  );
};

export default DynamicNoteForm;
