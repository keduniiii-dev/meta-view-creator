import { ReactNode } from "react";

interface RenderToStringOptions {
  url?: string;
}

let renderToString: (node: ReactNode, options?: RenderToStringOptions) => string;

if (typeof window === "undefined") {
  // Server-side
  const { renderToString: rts } = require("react-dom/server");
  renderToString = rts;
} else {
  // Client-side fallback (should not happen in SSR)
  renderToString = () => "";
}

export { renderToString };
