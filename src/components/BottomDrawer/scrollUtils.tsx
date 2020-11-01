// https://stackoverflow.com/questions/4770025/how-to-disable-scrolling-temporarily
// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
export const keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

export const wheelEvent =
  "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";

export function preventDefault(e: Event) {
  e.preventDefault();
}
export function preventDefaultForScrollKeys(e: KeyboardEvent) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}
// call this to Disable
export function disableScroll() {
  window.addEventListener("DOMMouseScroll", preventDefault, false); // older FF
  window.addEventListener(wheelEvent, preventDefault); // modern desktop
  window.addEventListener("touchmove", preventDefault); // mobile
  window.addEventListener("keydown", preventDefaultForScrollKeys, false);
}

// call this to Enable
export function enableScroll() {
  window.removeEventListener("DOMMouseScroll", preventDefault, false);
  window.removeEventListener(wheelEvent, preventDefault);
  window.removeEventListener("touchmove", preventDefault);
  window.removeEventListener("keydown", preventDefaultForScrollKeys, false);
}
