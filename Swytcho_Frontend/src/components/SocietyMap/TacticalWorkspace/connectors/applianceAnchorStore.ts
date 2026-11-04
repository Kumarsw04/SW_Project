
export interface ApplianceAnchor {
  x: number;
  y: number;
  visible: boolean;
}

type Listener = () => void;

const anchors = new Map<string, ApplianceAnchor>();
const listeners = new Set<Listener>();

let snapshot = new Map<string, ApplianceAnchor>();

function notify() {
  listeners.forEach((listener) => listener());
}

function publish() {
  snapshot = new Map(anchors);
  notify();
}

export const applianceAnchorStore = {
  getSnapshot(): Map<string, ApplianceAnchor> {
    return snapshot;
  },

  subscribe(listener: Listener) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  },

  update(id: string, anchor: ApplianceAnchor) {
    const previous = anchors.get(id);

    if (
      previous &&
      Math.abs(previous.x - anchor.x) < 0.5 &&
      Math.abs(previous.y - anchor.y) < 0.5 &&
      previous.visible === anchor.visible
    ) {
      return;
    }

    anchors.set(id, anchor);
    publish();
  },

  remove(id: string) {
    if (anchors.delete(id)) {
      publish();
    }
  },

  clear() {
    if (anchors.size > 0) {
      anchors.clear();
      publish();
    }
  },
};
