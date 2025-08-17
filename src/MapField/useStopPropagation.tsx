"use-client";

import { useEffect, useRef } from "react";
import { DomEvent } from "leaflet";

const useStopPropagation = () => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;
    DomEvent.disableClickPropagation(elementRef.current);
  }, [elementRef.current]);

  return elementRef;
};

export default useStopPropagation;
