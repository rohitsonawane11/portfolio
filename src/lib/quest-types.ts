import type { CheckpointId } from "@/data/portfolio";

export type TouchAction = "left" | "right" | "jump";
export interface QuestStatus {
  coins: number;
  checkpoint: string;
  prompt: CheckpointId | null;
}
export interface QuestHandle {
  travel: (id: CheckpointId) => void;
  pause: (paused: boolean) => void;
  mute: (muted: boolean) => void;
  touch: (action: TouchAction, pressed: boolean) => void;
  interact: () => void;
}
export interface QuestCallbacks {
  onReady: (handle: QuestHandle) => void;
  onInteraction: (id: CheckpointId) => void;
  onStatus: (status: QuestStatus) => void;
  onError: () => void;
}
