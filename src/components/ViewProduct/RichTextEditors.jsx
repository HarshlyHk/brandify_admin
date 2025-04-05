import React from "react";
import DraftViewer from "./DraftViewer";

const RichTextEditors = ({ formik }) => {
  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Description</label>
        <DraftViewer
          value={formik.values.description}
          onChange={(value) => formik.setFieldValue("description", value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Short Description</label>
        <DraftViewer
          value={formik.values.shortDescription}
          onChange={(value) => formik.setFieldValue("shortDescription", value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Core Features</label>
        <DraftViewer
          value={formik.values.coreFeatures}
          onChange={(value) => formik.setFieldValue("coreFeatures", value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Care Guide</label>
        <DraftViewer
          value={formik.values.careGuide}
          onChange={(value) => formik.setFieldValue("careGuide", value)}
        />
      </div>
    </div>
  );
};

export default RichTextEditors;