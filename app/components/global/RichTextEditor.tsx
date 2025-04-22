"use client";
import React, { useRef, useImperativeHandle, forwardRef, Ref } from "react";
import { Editor } from "@tinymce/tinymce-react";
import useGlobals from "@/app/contexts/GlobalContext";

interface Props {
  initialHTML?: string;
  onChange?: (html: string) => void;
  height?: number;
  uid: string;
}
const RichTextEditor = ({
  initialHTML = "",
  onChange,
  height = 400,
  uid,
}: Props) => {
  const initialHTMLRef = useRef(initialHTML);
  const { setRef } = useGlobals();
  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
      onInit={(evt, editor) => {
        setRef(uid, editor);
      }}
      initialValue={initialHTMLRef.current}
      init={{
        height: height,
        menubar: true,
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "anchor",
          "searchreplace",
          "visualblocks",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "wordcount",
          "print", // ✅ Required for print
        ],
        toolbar:
          "undo redo | blocks | bold italic underline strikethrough | " +
          "link image media | alignleft aligncenter alignright alignjustify | " +
          "bullist numlist outdent indent | removeformat | print",
        content_style:
          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
      }}
      onEditorChange={(content) => {
        onChange?.(content);
      }}
    />
  );
};

export default RichTextEditor;
