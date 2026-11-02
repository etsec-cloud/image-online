import { useEffect, useRef } from "react";

const IFRAME_API_SRC = "https://open.spotify.com/embed/iframe-api/v1";

// Loads the Spotify IFrame API once and resolves when it's ready.
let apiPromise = null;
function loadSpotifyApi() {
  if (apiPromise) return apiPromise;

  apiPromise = new Promise((resolve) => {
    // If it's somehow already present, resolve immediately.
    if (window.SpotifyIframeApi) {
      resolve(window.SpotifyIframeApi);
      return;
    }

    window.onSpotifyIframeApiReady = (IFrameAPI) => {
      window.SpotifyIframeApi = IFrameAPI;
      resolve(IFrameAPI);
    };

    const script = document.createElement("script");
    script.src = IFRAME_API_SRC;
    script.async = true;
    document.body.appendChild(script);
  });

  return apiPromise;
}

/**
 * Renders the Spotify embed for `trackId` and hands the playback controller
 * back to the parent via `onControllerReady` so it can start playback on a
 * user gesture (browsers block autoplay with sound otherwise).
 */
export default function SpotifyPlayer({ trackId, onControllerReady }) {
  const hostRef = useRef(null);
  const controllerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    loadSpotifyApi().then((IFrameAPI) => {
      if (cancelled || !hostRef.current) return;

      IFrameAPI.createController(
        hostRef.current,
        {
          uri: `spotify:track:${trackId}`,
          width: "100%",
          height: 80,
        },
        (controller) => {
          controllerRef.current = controller;
          onControllerReady?.(controller);
        }
      );
    });

    return () => {
      cancelled = true;
      if (controllerRef.current) {
        controllerRef.current.destroy();
        controllerRef.current = null;
      }
    };
  }, [trackId, onControllerReady]);

  // Spotify replaces this element with its iframe.
  return <div ref={hostRef} />;
}
