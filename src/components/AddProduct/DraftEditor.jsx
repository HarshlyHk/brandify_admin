// filepath: c:\Users\nisha\OneDrive\Documents\PersonalGit\Drip\admin\src\components\DraftEditor.jsx

import React, { useEffect, useState } from "react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

const DraftEditor = ({ value, onChange }) => {
  const [markdown, setMarkdown] = useState(value || "");

  const handleChange = (val) => {
    setMarkdown(val);
    onChange(val);
  };

  return (
    <div className="border border-gray-300 rounded-md p-2">
      <SimpleMDE value={markdown} onChange={handleChange} />
    </div>
  );
};

export default DraftEditor;
