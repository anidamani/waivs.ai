"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Heading from "@tiptap/extension-heading";
import { SOAPNote } from "@/gemini/summary-types";

function TiptapMenuBar({ editor }: { editor: any }) {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-2">
      {/* Bold */}
      <Button
        variant="outline"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
      >
        Bold
      </Button>
      {/* Italic */}
      <Button
        variant="outline"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
      >
        Italic
      </Button>
      {/* Underline */}
      <Button
        variant="outline"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
      >
        Underline
      </Button>
      {/* Bullet List */}
      <Button
        variant="outline"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        Bullet List
      </Button>
      {/* Numbered List */}
      <Button
        variant="outline"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        Numbered List
      </Button>
    </div>
  );
}

//
// 3) The Rich Text Editor with the Menu Bar
//
export function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      BulletList,
      OrderedList,
      ListItem,
      Heading,
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="border rounded p-2">
      {/* Our toolbar of styling options */}
      <TiptapMenuBar editor={editor} />

      {/* The actual editor content */}
      <EditorContent editor={editor} className="min-h-[200px] mt-2" />
    </div>
  );
}

//
// 4) Main Component for 4 sections: Subjective, Objective, Assessment, Plan
//
export default function EditableNotes({ summary }: { summary: SOAPNote }) {
  // Store the data in local state so user edits persist
  const [localData, setLocalData] = useState<SOAPNote | null>(summary);

  // Which section is currently being edited?
  const [editingSection, setEditingSection] = useState<keyof SOAPNote | null>(
    null
  );

  // Temporary text for Tiptap
  const [sectionContent, setSectionContent] = useState<string>("");

  // Sync if parent changes the data
  useEffect(() => {
    setLocalData(summary);
  }, [summary]);

  // Start editing a particular section
  const startEditing = (section: keyof SOAPNote) => {
    setEditingSection(section);
    setSectionContent(localData?.Objective.Vitals || "");
  };

  // Save the updated HTML back to local state
  const saveEdit = () => {
    if (!editingSection) return;
    // setLocalData((prev) => ({
    //   ...prev,
    //   [editingSection]: sectionContent,
    // }));
    setEditingSection(null);
  };

  // Render a single section (Objective, Subjective, etc.)
  const renderSection = (section: keyof SOAPNote) => {
    const htmlContent = localData?.[section] || "";
    const isEditing = editingSection === section;

    return (
      <Card key={section} className="border-none shadow-none">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-[18px] leading-[28px] text-[#2B3674] font-bold uppercase">
              {section}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => startEditing(section)}
            >
              <Pencil className="w-4 h-4" />
            </Button>
          </div>

          {/* If editing, show Tiptap. Otherwise, read-only HTML */}
          {isEditing ? (
            <div className="space-y-2">
              <RichTextEditor
                value={sectionContent}
                onChange={setSectionContent}
              />
              <div className="flex gap-2 mt-2">
                <Button onClick={saveEdit}>Save</Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingSection(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div
              className="prose prose-sm max-w-none text-muted-foreground"
              // dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 custom-shadow">
      {renderSection("Objective")}
      {renderSection("Subjective")}
      {renderSection("Assessment")}
      {renderSection("Plan")}
    </div>
  );
}
