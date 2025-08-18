import "./global.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { HeroUIProvider } from "@heroui/system";
import Demo from "./Demo";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HeroUIProvider>
      <main className="container mx-auto max-w-7xl p-6 flex-grow flex flex-col min-h-[100vh]">
        <Demo />
      </main>
    </HeroUIProvider>
  </React.StrictMode>
);
