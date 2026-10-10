import Phaser from "phaser";
import { checkpoints, type CheckpointId } from "@/data/portfolio";
import type {
  QuestCallbacks,
  QuestHandle,
  TouchAction,
} from "@/lib/quest-types";

const WORLD_WIDTH = 5000;

export class QuestScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private floor = 500;
  private paused = false;
  private muted = true;
  private nearby: CheckpointId | null = null;
  private collected = new Set<number>();
  private touchState = { left: false, right: false, jump: false };
  private jumpQueued = false;
  private position = 160;
  private audioContext?: AudioContext;
  private lastStatus = "";
  private reducedMotion: boolean;

  constructor(private callbacks: QuestCallbacks) {
    super("RohitQuest");
    this.reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }

  preload() {
    this.load.image("landscape", "/assets/world-background.webp");
    this.load.image("player", "/assets/rohit-avatar.webp");
    this.load.image("castle", "/assets/clinzo-castle.webp");
    this.load.image("workshop", "/assets/openforms-workshop.webp");
    this.load.on("loaderror", () => this.callbacks.onError());
  }

  create() {
    const { width, height } = this.scale;
    this.floor = height - 62;
    this.lastStatus = "";
    this.nearby = null;
    this.paused = false;
    this.touchState = { left: false, right: false, jump: false };
    this.physics.world.setBounds(0, -300, WORLD_WIDTH, height + 300);
    const background = this.add
      .image(width / 2, height / 2, "landscape")
      .setScrollFactor(0);
    background.setScale(
      Math.max(width / background.width, height / background.height),
    );
    this.add
      .rectangle(0, 0, width, height, 0xc8efff, 0.1)
      .setOrigin(0)
      .setScrollFactor(0);

    const ground = this.add.graphics();
    ground.fillStyle(0x936344).fillRect(0, this.floor, WORLD_WIDTH, 70);
    ground.fillStyle(0x6c4838).fillRect(0, this.floor + 20, WORLD_WIDTH, 7);
    ground.fillStyle(0x246447).fillRect(0, this.floor, WORLD_WIDTH, 12);
    ground.fillStyle(0x65ce62).fillRect(0, this.floor, WORLD_WIDTH, 5);
    for (let x = 0; x < WORLD_WIDTH; x += 28) {
      ground.fillStyle(0xc08b57).fillRect(x + 5, this.floor + 36, 7, 6);
      ground.fillStyle(0x4d9d49).fillRect(x, this.floor + 5, 15, 9);
    }
    const platforms = this.physics.add.staticGroup();
    const groundBody = this.add
      .rectangle(WORLD_WIDTH / 2, this.floor + 35, WORLD_WIDTH, 70)
      .setVisible(false);
    platforms.add(groundBody);
    for (const [x, y] of [
      [670, this.floor - 130],
      [1190, this.floor - 150],
      [2200, this.floor - 125],
      [3180, this.floor - 145],
      [4140, this.floor - 135],
    ]) {
      const platform = this.add
        .rectangle(x, y, 140, 20, 0x9b704c)
        .setStrokeStyle(3, 0x425d39);
      this.add.rectangle(x, y - 10, 146, 8, 0x65c868);
      platforms.add(platform);
    }

    for (const checkpoint of checkpoints) {
      if (checkpoint.id === "clinzo360" || checkpoint.id === "openforms") {
        const building = this.add
          .image(
            checkpoint.x,
            this.floor + 1,
            checkpoint.id === "clinzo360" ? "castle" : "workshop",
          )
          .setOrigin(0.5, 1);
        building.setScale(
          Math.min(360 / building.width, (height * 0.58) / building.height),
        );
        building
          .setInteractive({ useHandCursor: true })
          .on("pointerdown", () => this.activate(checkpoint.id));
      } else {
        this.add.rectangle(checkpoint.x, this.floor - 28, 11, 56, 0x654d35);
        const sign = this.add
          .rectangle(checkpoint.x, this.floor - 74, 166, 64, 0xf9edd0)
          .setStrokeStyle(4, 0x74513c);
        sign
          .setInteractive({ useHandCursor: true })
          .on("pointerdown", () => this.activate(checkpoint.id));
        this.add
          .text(
            checkpoint.x,
            this.floor - 74,
            checkpoint.short.toUpperCase() + " →",
            {
              fontFamily: '"Press Start 2P", monospace',
              fontSize: "11px",
              color: "#273b40",
            },
          )
          .setOrigin(0.5);
      }
      this.add
        .text(checkpoint.x, this.floor + 30, checkpoint.label.toUpperCase(), {
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "9px",
          color: "#fff3d4",
        })
        .setOrigin(0.5);
    }

    for (const [index, name] of [
      "NestJS",
      "TypeScript",
      "PostgreSQL",
      "Docker",
      "AWS",
      "Next.js",
    ].entries()) {
      const x = 760 + (index % 3) * 145;
      const y = this.floor - 205 - Math.floor(index / 3) * 56;
      const badge = this.add
        .rectangle(x, y, 130, 38, 0x102842, 0.96)
        .setStrokeStyle(2, 0xc6ead1);
      badge
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => this.activate("skills"));
      this.add
        .text(x, y, name, {
          fontFamily: "monospace",
          fontSize: "15px",
          color: "#fff9e8",
        })
        .setOrigin(0.5);
    }

    this.player = this.physics.add.sprite(
      this.position,
      this.floor - 46,
      "player",
    );
    this.player
      .setScale(90 / this.player.height)
      .setDepth(5)
      .setCollideWorldBounds(true);
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body
      .setSize(this.player.width * 0.6, this.player.height * 0.95)
      .setOffset(this.player.width * 0.2, this.player.height * 0.05);
    this.physics.add.collider(this.player, platforms);
    const coins = this.physics.add.staticGroup();
    for (let i = 0; i < 28; i++) {
      if (this.collected.has(i)) continue;
      const x = 470 + i * 150;
      const coin = this.add
        .rectangle(
          x,
          this.floor - 55 - (i % 3 === 1 ? 45 : 0),
          13,
          19,
          0xf8c84e,
        )
        .setStrokeStyle(3, 0x8a5e28)
        .setData("coinId", i);
      coins.add(coin);
    }
    this.physics.add.overlap(this.player, coins, (_player, item) => {
      const coin = item as Phaser.GameObjects.Rectangle;
      this.collected.add(coin.getData("coinId") as number);
      coin.destroy();
      this.playChime();
    });

    const keyboard = this.input.keyboard!;
    this.keys = keyboard.addKeys(
      { left: "LEFT", right: "RIGHT", a: "A", d: "D" },
      false,
    ) as Record<string, Phaser.Input.Keyboard.Key>;
    // Momentary actions listen for the DOM event rather than polling JustDown:
    // Phaser clears a key's just-down flag on keyup, so a tap whose keydown and
    // keyup land in the same frame is otherwise swallowed entirely.
    keyboard.on("keydown-SPACE", () => {
      if (!this.paused) this.jumpQueued = true;
    });
    const interact = () => {
      if (this.nearby) this.activate(this.nearby);
    };
    keyboard.on("keydown-E", interact);
    keyboard.on("keydown-ENTER", interact);
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, height);
    this.cameras.main.startFollow(
      this.player,
      true,
      this.reducedMotion ? 1 : 0.12,
      1,
    );
    this.cameras.main.setDeadzone(width * 0.32, height);

    const handle: QuestHandle = {
      travel: (id) => {
        const checkpoint = checkpoints.find((item) => item.id === id);
        if (!checkpoint) return;
        this.player
          .setPosition(checkpoint.x - 85, this.floor - 50)
          .setVelocity(0);
        this.cameras.main.centerOn(this.player.x, height / 2);
      },
      pause: (paused) => {
        this.paused = paused;
        this.jumpQueued = false;
        this.player.setVelocityX(0);
        this.input.keyboard?.resetKeys();
        this.touchState = { left: false, right: false, jump: false };
        if (paused) this.physics.pause();
        else this.physics.resume();
      },
      mute: (muted) => {
        this.muted = muted;
      },
      touch: (action: TouchAction, pressed) => {
        this.touchState[action] = pressed;
      },
      interact: () => {
        if (this.nearby) this.activate(this.nearby);
      },
    };
    this.callbacks.onReady(handle);
    // Phaser emits `resize` even when the dimensions are unchanged. Restarting on
    // those drops any movement key the player is currently holding, so only rebuild
    // the scene when the layout genuinely changed.
    let lastWidth = width;
    let lastHeight = height;
    const onResize = () => {
      if (this.scale.width === lastWidth && this.scale.height === lastHeight)
        return;
      lastWidth = this.scale.width;
      lastHeight = this.scale.height;
      this.position = this.player.x;
      this.scene.restart();
    };
    this.scale.on("resize", onResize);
    this.events.once("shutdown", () => {
      this.scale.off("resize", onResize);
      void this.audioContext?.close();
      this.audioContext = undefined;
    });
  }

  private activate(id: CheckpointId) {
    if (this.paused) return;
    this.callbacks.onInteraction(id);
  }

  private playChime() {
    if (this.muted) return;
    try {
      this.audioContext ??= new AudioContext();
      void this.audioContext.resume();
      const oscillator = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(660, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        990,
        this.audioContext.currentTime + 0.1,
      );
      gain.gain.setValueAtTime(0.045, this.audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        this.audioContext.currentTime + 0.16,
      );
      oscillator.connect(gain).connect(this.audioContext.destination);
      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.17);
    } catch {
      /* Sound is optional; gameplay remains usable without Web Audio. */
    }
  }

  update(time: number) {
    if (!this.player || this.paused) return;
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    const left =
      this.keys.left.isDown || this.keys.a.isDown || this.touchState.left;
    const right =
      this.keys.right.isDown || this.keys.d.isDown || this.touchState.right;
    this.player.setVelocityX(left ? -260 : right ? 260 : 0);
    if (left || right) this.player.setFlipX(left);
    // Single-pose artwork: a subtle rotation conveys movement, without invented frames.
    this.player.setAngle(
      !this.reducedMotion && body.blocked.down && (left || right)
        ? Math.sin(time / 75) * 2
        : 0,
    );
    if ((this.jumpQueued || this.touchState.jump) && body.blocked.down) {
      this.player.setVelocityY(-600);
      this.touchState.jump = false;
    }
    this.jumpQueued = false;
    this.nearby =
      checkpoints.find((point) => Math.abs(point.x - this.player.x) < 165)
        ?.id ?? null;
    const checkpoint =
      [...checkpoints]
        .reverse()
        .find((point) => this.player.x >= point.x - 260) ?? checkpoints[0];
    const status = {
      coins: this.collected.size,
      checkpoint: checkpoint.label,
      prompt: this.nearby,
    };
    const serialized = JSON.stringify(status);
    if (serialized !== this.lastStatus) {
      this.callbacks.onStatus(status);
      this.lastStatus = serialized;
    }
    // Observable semantic state is also useful for browser smoke tests.
    this.game.canvas.dataset.playerX = String(Math.round(this.player.x));
    this.game.canvas.dataset.playerY = String(Math.round(this.player.y));
    this.game.canvas.dataset.grounded = String(body.blocked.down);
  }
}
