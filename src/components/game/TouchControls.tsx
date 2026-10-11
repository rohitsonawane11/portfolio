"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";
import { contentLabels } from "@/data/portfolio";
import type { TouchAction } from "@/lib/quest-types";

type Direction = "left" | "right";

export function TouchControls({
  disabled,
  onTouch,
}: {
  disabled: boolean;
  onTouch: (action: TouchAction, pressed: boolean) => void;
}) {
  const pointer = useRef<number | null>(null);
  const [direction, setDirection] = useState<Direction | null>(null);
  const [jumping, setJumping] = useState(false);
  const move = (next: Direction | null) => {
    onTouch("left", next === "left");
    onTouch("right", next === "right");
    setDirection(next);
  };
  const steer = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const offset = event.clientX - bounds.left - bounds.width / 2;
    move(Math.abs(offset) < 8 ? null : offset < 0 ? "left" : "right");
  };
  const release = (event: PointerEvent<HTMLDivElement>) => {
    if (pointer.current !== event.pointerId) return;
    pointer.current = null;
    move(null);
  };
  useEffect(
    () => () => {
      onTouch("left", false);
      onTouch("right", false);
      onTouch("jump", false);
    },
    [onTouch],
  );

  return (
    <div className="touch-controls">
      <div className="thumb-group">
        <div
          className="touch-dpad"
          role="group"
          aria-label={contentLabels.move}
          onPointerDown={(event) => {
            if (disabled || pointer.current !== null) return;
            event.preventDefault();
            pointer.current = event.pointerId;
            event.currentTarget.setPointerCapture(event.pointerId);
            steer(event);
          }}
          onPointerMove={(event) => {
            if (pointer.current === event.pointerId) steer(event);
          }}
          onPointerUp={release}
          onPointerCancel={release}
          onLostPointerCapture={release}
        >
          {(["left", "right"] as const).map((action) => (
            <button
              key={action}
              disabled={disabled}
              aria-label={`${action} in game`}
              data-active={direction === action}
              onKeyDown={(event) => {
                if ([" ", "Enter"].includes(event.key)) {
                  event.preventDefault();
                  move(action);
                }
              }}
              onKeyUp={(event) => {
                if ([" ", "Enter"].includes(event.key)) move(null);
              }}
              onBlur={() => {
                if (pointer.current === null) move(null);
              }}
            >
              {action === "left" ? (
                <ArrowLeft size={30} />
              ) : (
                <ArrowRight size={30} />
              )}
            </button>
          ))}
        </div>
        <span className="thumb-label">{contentLabels.moveHint}</span>
      </div>
      <div className="thumb-group jump-group">
        <button
          className="touch-jump"
          disabled={disabled}
          aria-label="jump in game"
          data-active={jumping}
          onPointerDown={(event) => {
            event.preventDefault();
            event.currentTarget.setPointerCapture(event.pointerId);
            setJumping(true);
            onTouch("jump", true);
          }}
          onPointerUp={() => {
            setJumping(false);
            onTouch("jump", false);
          }}
          onPointerCancel={() => {
            setJumping(false);
            onTouch("jump", false);
          }}
          onLostPointerCapture={() => {
            setJumping(false);
            onTouch("jump", false);
          }}
          onKeyDown={(event) => {
            if ([" ", "Enter"].includes(event.key)) {
              event.preventDefault();
              setJumping(true);
              onTouch("jump", true);
            }
          }}
          onKeyUp={() => {
            setJumping(false);
            onTouch("jump", false);
          }}
          onBlur={() => {
            setJumping(false);
            onTouch("jump", false);
          }}
        >
          <ArrowUp size={30} />
          <span>{contentLabels.jump}</span>
        </button>
        <span className="thumb-label">{contentLabels.jumpHint}</span>
      </div>
    </div>
  );
}
