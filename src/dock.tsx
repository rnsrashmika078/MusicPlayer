import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import DockProfiling from "./components/app/sidebar/tabs/DockProfiling.tsx";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
ReactDOM.createRoot(document.getElementById("dock-root")!).render(
  <div className="flex overflow-hidden">
    <React.StrictMode>
      <DockProfiling searchVal={undefined} />
    </React.StrictMode>
    ,
  </div>
);

// Use contextBridge
window.ipcRenderer.on("main-process-message", (_event, message) => {
  console.log(message);
});
