import React from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { Title } from "@mantine/core";
import appStrings from "../../utils/strings";

export default function FileViewer({ url }) {
  const fileExtension = url.split(".").pop().toLowerCase(); // Chuyển đổi về chữ thường để dễ so sánh

  if (fileExtension === "pdf") {
    return (
      <iframe
        src={url}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
        title="PDF Viewer"
      />
    );
  } else if (fileExtension === "docx") {
    return (
      <DocViewer
        documents={[{ uri: url, fileType: "docx" }]}
        pluginRenderers={DocViewerRenderers}
      />
    );
  } else if (fileExtension === "txt") {
    return (
      <iframe
        src={url}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
        title="Text File Viewer"
      />
    );
  } else {
    return (
      <Title order={4} p="md">
        {appStrings.language.utils.unsupportFile}
      </Title>
    );
  }
}
