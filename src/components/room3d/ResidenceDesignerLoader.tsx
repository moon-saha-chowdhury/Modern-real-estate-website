"use client";

import dynamic from "next/dynamic";

/** three.js and the designer are fetched in the browser only, when this page opens. */
const ResidenceDesigner = dynamic(() => import("./ResidenceDesigner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[68svh] min-h-96 items-center justify-center bg-stone label-mono text-fg-muted">
      Loading the designer…
    </div>
  ),
});

export function ResidenceDesignerLoader() {
  return <ResidenceDesigner />;
}
