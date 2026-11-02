import { useEffect, useState } from "react";
import "./App.css";

const LANDSCAPE_SRC = "/assets/landscape.mp4";
const PORTRAIT_SRC = "/assets/portrait.mp4";

// Returns true when the viewport is wider than it is tall.
function getIsLandscape() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(orientation: landscape)").matches;
}

export default function App() {
  const [isLandscape, setIsLandscape] = useState(getIsLandscape);

  useEffect(() => {
    const query = window.matchMedia("(orientation: landscape)");
    const handleChange = (event) => setIsLandscape(event.matches);

    // Safari < 14 only supports addListener/removeListener.
    if (query.addEventListener) {
      query.addEventListener("change", handleChange);
    } else {
      query.addListener(handleChange);
    }

    return () => {
      if (query.removeEventListener) {
        query.removeEventListener("change", handleChange);
      } else {
        query.removeListener(handleChange);
      }
    };
  }, []);

  const src = isLandscape ? LANDSCAPE_SRC : PORTRAIT_SRC;

  return (
    <div className="stage">
      {/* key forces a remount so the correct video loads and autoplays on orientation change */}
      <video
        key={src}
        className="fullscreen-video"
        src={src}
        autoPlay
        loop
        muted
        playsInline
      />
    </div>
  );
}
