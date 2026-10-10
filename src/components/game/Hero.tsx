"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Coins,
  Gamepad2,
  Maximize2,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import { checkpoints, profile, type CheckpointId } from "@/data/portfolio";
import type { QuestHandle, QuestStatus, TouchAction } from "@/lib/quest-types";
import { QuestPanel } from "./QuestPanel";
import { GameErrorBoundary } from "./GameErrorBoundary";

const QuestGame = dynamic(() => import("./QuestGame"), { ssr: false });

export function Hero() {
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  const [panel, setPanel] = useState<CheckpointId | null>(null);
  const [status, setStatus] = useState<QuestStatus>({
    coins: 0,
    checkpoint: "Welcome Meadows",
    prompt: null,
  });
  const handle = useRef<QuestHandle | null>(null);
  const shell = useRef<HTMLDivElement>(null);
  const mutedRef = useRef(true);
  const panelRef = useRef<CheckpointId | null>(null);
  const pausedRef = useRef(false);
  const onReady = useCallback((api: QuestHandle) => {
    handle.current = api;
    api.mute(mutedRef.current);
    api.pause(pausedRef.current || !!panelRef.current);
    setReady(true);
  }, []);
  const onInteraction = useCallback((id: CheckpointId) => {
    handle.current?.pause(true);
    panelRef.current = id;
    setPanel(id);
  }, []);
  const onError = useCallback(() => {
    setFailed(true);
    setPlaying(false);
    setReady(false);
    handle.current = null;
  }, []);
  const closePanel = useCallback(() => {
    panelRef.current = null;
    setPanel(null);
    handle.current?.pause(pausedRef.current);
  }, []);
  useEffect(() => {
    if (!playing || ready) return;
    const timeout = window.setTimeout(onError, 25000);
    return () => window.clearTimeout(timeout);
  }, [playing, ready, onError]);
  useEffect(() => {
    if (!playing) return;
    const onWindowBlur = () => {
      pausedRef.current = true;
      setPaused(true);
      handle.current?.pause(true);
    };
    window.addEventListener("blur", onWindowBlur);
    return () => window.removeEventListener("blur", onWindowBlur);
  }, [playing]);
  const pause = (value: boolean) => {
    pausedRef.current = value;
    setPaused(value);
    handle.current?.pause(value);
  };
  const start = () => {
    setFailed(false);
    setReady(false);
    pausedRef.current = false;
    setPaused(false);
    setPlaying(true);
  };
  const quick = () => {
    if (playing) pause(true);
  };
  const focusGame = () =>
    shell.current
      ?.querySelector<HTMLElement>(".game-canvas")
      ?.focus({ preventScroll: true });
  const touch = (action: TouchAction, value: boolean) =>
    handle.current?.touch(action, value);

  return (
    <section
      className={`hero ${playing ? "is-playing" : ""}`}
      aria-label="Welcome to Rohit Quest"
    >
      <div
        className="hero-viewport"
        ref={shell}
        onKeyDown={(event) => {
          if (event.key === "Escape" && playing && !panel) {
            pause(!paused);
            event.preventDefault();
          }
        }}
        onBlur={(event) => {
          if (
            playing &&
            !event.currentTarget.parentElement?.contains(event.relatedTarget) &&
            !panelRef.current
          )
            pause(true);
        }}
      >
        <div className="hero-scenery" aria-hidden="true" />
        <div className="hero-wash" aria-hidden="true" />
        <div className="hero-hud">
          <div className="hud-world">
            <span className="world-icon" aria-hidden="true">
              ✦
            </span>
            <span className="pixel">
              WORLD 01<small>{status.checkpoint.toUpperCase()}</small>
            </span>
          </div>
          <div className="hud-actions">
            <span className="hud-stars" aria-label="Three decorative stars">
              ★ ★ ★
            </span>
            {playing && (
              <span className="coin-count">
                <Coins size={17} />
                {status.coins.toString().padStart(2, "0")}
              </span>
            )}
            {playing && (
              <>
                <button
                  className="hud-button"
                  aria-label={muted ? "Enable sound" : "Mute sound"}
                  onClick={() => {
                    mutedRef.current = !muted;
                    setMuted(!muted);
                    handle.current?.mute(!muted);
                  }}
                  title={muted ? "Sound off" : "Sound on"}
                >
                  {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <button
                  className="hud-button"
                  aria-label={paused ? "Resume adventure" : "Pause adventure"}
                  onClick={() => {
                    pause(!paused);
                    focusGame();
                  }}
                >
                  {paused ? <Play size={17} /> : <Pause size={17} />}
                </button>
              </>
            )}
            <a href="#quick-portfolio" className="skip-game" onClick={quick}>
              SKIP GAME <ChevronRight size={14} />
            </a>
          </div>
        </div>
        {!playing && (
          <>
            <div className="hero-copy">
              <span className="hero-kicker">
                <span /> A PORTFOLIO WITH A SIDE OF ADVENTURE
              </span>
              <h1>
                HI, I’M
                <br />
                <span>
                  ROHIT<span className="title-period">.</span>
                </span>
              </h1>
              <p className="hero-role">{profile.role}</p>
              <p className="hero-description">{profile.heroDescription}</p>
              <div className="hero-buttons">
                <button
                  className="button button-gold start-desktop"
                  onClick={start}
                >
                  <Play size={16} fill="currentColor" /> Start exploring
                </button>
                <button
                  className="button button-gold start-mobile"
                  onClick={start}
                >
                  <Gamepad2 size={19} /> Play mini game
                </button>
                <a className="button button-light" href="#quick-portfolio">
                  Quick portfolio <ArrowDown size={16} />
                </a>
              </div>
              <p className="hero-footnote">
                A little exploration. A lot of engineering.
              </p>
            </div>
            <div className="hero-landmarks">
              <Link
                href="/projects/clinzo360"
                className="hero-landmark hero-castle"
              >
                <span className="landmark-label">
                  CLINZO360 <ArrowUpRightIcon />
                </span>
                <Image
                  src="/assets/clinzo-castle.webp"
                  alt="Explore Clinzo360 castle"
                  width={420}
                  height={310}
                  sizes="(max-width: 767px) 180px, 30vw"
                />
              </Link>
              <Link
                href="/projects/openforms"
                className="hero-landmark hero-workshop"
              >
                <span className="landmark-label">
                  OPENFORMS <ArrowUpRightIcon />
                </span>
                <Image
                  src="/assets/openforms-workshop.webp"
                  alt="Explore OpenForms workshop"
                  width={290}
                  height={250}
                  sizes="(max-width: 767px) 140px, 22vw"
                />
              </Link>
            </div>
            <div className="hero-player" aria-hidden="true">
              <span className="player-label">
                PLAYER 01<span>▼</span>
              </span>
              <Image
                src="/assets/rohit-avatar.webp"
                alt=""
                width={40}
                height={100}
              />
            </div>
            <div className="static-ground" aria-hidden="true" />
          </>
        )}
        {playing && (
          <GameErrorBoundary onError={onError}>
            <QuestGame
              onReady={onReady}
              onInteraction={onInteraction}
              onStatus={setStatus}
              onError={onError}
            />
          </GameErrorBoundary>
        )}
        {playing && !ready && (
          <div className="game-loading" role="status">
            <Gamepad2 size={32} />
            <strong>Preparing your adventure…</strong>
            <p>The portfolio is ready to explore below.</p>
            <a href="#quick-portfolio" className="text-link" onClick={quick}>
              Go to the projects <ArrowDown size={16} />
            </a>
          </div>
        )}
        {playing && ready && paused && !panel && (
          <div className="pause-overlay">
            <span className="pixel">TAKE A BREATHER</span>
            <button
              className="button button-gold"
              onClick={() => {
                pause(false);
                focusGame();
              }}
            >
              <Play size={16} /> Resume adventure
            </button>
            <button
              className="text-link"
              onClick={() => {
                setPlaying(false);
                setReady(false);
                handle.current = null;
              }}
            >
              Exit game
            </button>
          </div>
        )}
        {playing && ready && status.prompt && !paused && !panel && (
          <button
            className="interaction-prompt"
            onClick={() => handle.current?.interact()}
          >
            <kbd>E</kbd> Explore{" "}
            {checkpoints.find((item) => item.id === status.prompt)?.short}
            <ChevronRight size={16} />
          </button>
        )}
      </div>
      <div className="controls-bar" id="game-controls">
        <span>
          <span className="live-dot" />{" "}
          {playing
            ? "YOUR ADVENTURE, YOUR PACE"
            : "A DIFFERENT KIND OF DEVELOPER PORTFOLIO"}
        </span>
        <div className="keyboard-hints">
          <span>
            <kbd>←</kbd> <kbd>→</kbd> MOVE
          </span>
          <span>
            <kbd>SPACE</kbd> JUMP
          </span>
          <span>
            <kbd>E</kbd> INTERACT
          </span>
        </div>
        <span className="touch-hint">
          <Gamepad2 size={15} /> EXPLORE AT YOUR OWN PACE
        </span>
        <span className="controls-extra">
          <Maximize2 size={13} /> BUILT TO EXPLORE
        </span>
      </div>
      {failed && (
        <p className="game-error" role="alert">
          The game couldn’t load. All projects and profile details are available
          below. <button onClick={start}>Try again</button>
        </p>
      )}
      {playing && ready && (
        <div className="checkpoint-bar">
          <span className="small-label">JUMP TO</span>
          {checkpoints.map((point) => (
            <button
              key={point.id}
              onClick={() => {
                pause(false);
                handle.current?.travel(point.id);
                focusGame();
              }}
            >
              {point.short}
            </button>
          ))}
          <div className="touch-controls">
            {(["left", "right", "jump"] as const).map((action) => (
              <button
                key={action}
                aria-label={`${action} in game`}
                onPointerDown={(event) => {
                  event.currentTarget.setPointerCapture(event.pointerId);
                  touch(action, true);
                }}
                onPointerUp={() => touch(action, false)}
                onPointerCancel={() => touch(action, false)}
                onLostPointerCapture={() => touch(action, false)}
              >
                {action === "left" ? (
                  <ArrowLeft size={19} />
                ) : action === "right" ? (
                  <ArrowRight size={19} />
                ) : (
                  "Jump"
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      {panel && <QuestPanel key={panel} id={panel} onClose={closePanel} />}
    </section>
  );
}

function ArrowUpRightIcon() {
  return <span aria-hidden="true">↗</span>;
}
