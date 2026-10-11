"use client";

import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { QuestScene } from "./QuestScene";
import type { QuestCallbacks } from "@/lib/quest-types";

export default function QuestGame({
  onReady,
  onInteraction,
  onStatus,
  onError,
}: QuestCallbacks) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let game: Phaser.Game | undefined;
    const scene = new QuestScene({ onReady, onInteraction, onStatus, onError });
    try {
      game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: element,
        backgroundColor: "#79d3ff",
        pixelArt: true,
        scale: {
          mode: Phaser.Scale.RESIZE,
          width: element.clientWidth,
          height: element.clientHeight,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        physics: {
          default: "arcade",
          arcade: { gravity: { x: 0, y: 1100 }, debug: false },
        },
        input: { keyboard: { target: element, capture: [] } },
        scene,
        audio: { noAudio: true },
        callbacks: {
          postBoot: () => {
            game?.canvas.setAttribute(
              "aria-label",
              "Playable Rohit Quest world. Use the checkpoint buttons to navigate without movement controls.",
            );
            game?.canvas.setAttribute("role", "img");
            element.focus({ preventScroll: true });
          },
        },
      });
    } catch {
      onError();
    }
    // Browser chrome and orientation changes can resize the CSS viewport without
    // a reliable window resize event. Observe the actual canvas host instead.
    const resize = new ResizeObserver(() => {
      if (!game?.isBooted) return;
      const width = element.clientWidth;
      const height = element.clientHeight;
      if (
        width > 0 &&
        height > 0 &&
        (game.scale.width !== width || game.scale.height !== height)
      )
        game.scale.resize(width, height);
    });
    resize.observe(element);
    const resetKeys = () => {
      scene.input?.keyboard?.resetKeys();
    };
    element.addEventListener("blur", resetKeys);
    return () => {
      resize.disconnect();
      element.removeEventListener("blur", resetKeys);
      game?.destroy(true);
    };
  }, [onReady, onInteraction, onStatus, onError]);

  return (
    <div
      className="game-canvas"
      ref={host}
      tabIndex={0}
      role="region"
      aria-label="Adventure controls"
      aria-describedby="game-controls"
      onPointerDown={(event) =>
        event.currentTarget.focus({ preventScroll: true })
      }
      onKeyDown={(event) => {
        if (
          ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(
            event.key,
          )
        )
          event.preventDefault();
      }}
    />
  );
}
