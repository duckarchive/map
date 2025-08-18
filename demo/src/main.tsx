import "./global.css";

import React from "react";
import ReactDOM from "react-dom/client";
import Map from "../../src/components/Map";
import { HeroUIProvider } from "@heroui/system";
import { Card, CardBody } from "@heroui/card";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HeroUIProvider>
      <main className="container mx-auto max-w-7xl p-6 flex-grow flex flex-col min-h-[100vh]">
        <Card className="w-full h-[calc(100vh-3rem)]">
          <CardBody className="p-0">
            <Map
              position={[48.21, 31.1]}
              onPositionChange={(pos) =>
                console.log("Position changed:", pos)
              }
            />
          </CardBody>
        </Card>
      </main>
    </HeroUIProvider>
  </React.StrictMode>
);
