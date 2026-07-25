// Facebook-style messenger UI state (desktop): popup list + docked chat windows.
type State = {
  popupOpen: boolean;
  openChats: string[]; // thread ids, newest last
  minimized: string[];
};

let state: State = { popupOpen: false, openChats: [], minimized: [] };
const listeners = new Set<() => void>();

function emit() {
  state = { ...state };
  listeners.forEach((l) => l());
}

export function getMessengerState(): State {
  return state;
}

export function subscribeMessenger(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function toggleMessengerPopup() {
  state.popupOpen = !state.popupOpen;
  emit();
}

export function closeMessengerPopup() {
  if (!state.popupOpen) return;
  state.popupOpen = false;
  emit();
}

export function openChatWindow(threadId: string) {
  state.minimized = state.minimized.filter((id) => id !== threadId);
  if (!state.openChats.includes(threadId)) {
    state.openChats = [...state.openChats, threadId].slice(-3);
  }
  state.popupOpen = false;
  emit();
}

export function closeChatWindow(threadId: string) {
  state.openChats = state.openChats.filter((id) => id !== threadId);
  state.minimized = state.minimized.filter((id) => id !== threadId);
  emit();
}

export function toggleMinimizeChat(threadId: string) {
  state.minimized = state.minimized.includes(threadId)
    ? state.minimized.filter((id) => id !== threadId)
    : [...state.minimized, threadId];
  emit();
}
