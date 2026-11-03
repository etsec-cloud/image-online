import { useCallback, useEffect, useRef, useState } from "react";
import SpotifyPlayer from "./SpotifyPlayer.jsx";
import "./App.css";

const LANDSCAPE_SRC = "/assets/landscape.mp4";
const PORTRAIT_SRC = "/assets/portrait.mp4";
const SPOTIFY_TRACK_ID = "4lTux6velSRhPQ9MWR1Lfm";

// Returns true when the viewport is wider than it is tall.
function getIsLandscape() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(orientation: landscape)").matches;
}

export default function App() {
  const [isLandscape, setIsLandscape] = useState(getIsLandscape);
  const controllerRef = useRef(null);

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

  const handleControllerReady = useCallback((controller) => {
    controllerRef.current = controller;
  }, []);

  // Clicking anywhere toggles the music. The first click is the user gesture
  // the browser requires to start audio; later clicks pause/resume it.
  const handleScreenClick = useCallback(() => {
    controllerRef.current?.togglePlay();
  }, []);

  const src = isLandscape ? LANDSCAPE_SRC : PORTRAIT_SRC;

  return (
    <div className="stage" onClick={handleScreenClick}>
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

      {/* Overlay message that gently fades in and out */}
      <p className="fade-message">Bonjour mon chat ! Plus que 2 dodos </p>

      {/* Hidden Spotify player; audio only, controlled by clicking the screen */}
      <div className="music-dock" aria-hidden="true">
        <SpotifyPlayer
          trackId={SPOTIFY_TRACK_ID}
          onControllerReady={handleControllerReady}
        />
      </div>
    </div>
  );
}
