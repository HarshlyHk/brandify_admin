import React, { useState } from "react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import ReactMarkdown from "react-markdown";

const DraftViewer = ({ value, onChange }) => {
   const [markdown, setMarkdown] = useState(value || "");
 
  const handleChange = (val) => {
    setMarkdown(val);
    onChange(val);
  };

  return (
    <div className="border border-gray-300 rounded-md p-4">
        <SimpleMDE value={markdown} onChange={handleChange} />

    </div>
  );
};

export default DraftViewer;