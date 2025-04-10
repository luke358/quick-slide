import { windowRuntime } from './../store';
import { screen } from 'electron';
import { Animator, Easing } from './animation';
import { BOUNDARY_GAP, TRIGGER_SHOW_OFFSET } from '../constants';
import { store } from '../store';

const windowAnimator = new Animator();

let isAnimating = false
let timer: NodeJS.Timeout | null = null
let canAnimate = true
export const startMouseTracking = () => {
  const cursorPoint = screen.getCursorScreenPoint();
  const currentDisplay = screen.getDisplayNearestPoint(cursorPoint);
  const { x } = cursorPoint;

  canAnimate = !(x >= currentDisplay.workArea.x + currentDisplay.workArea.width - 2)
  if (timer) {
    clearInterval(timer)
    timer = null
  }

  timer = setInterval(() => {
    const cursorPoint = screen.getCursorScreenPoint();
    const currentDisplay = screen.getDisplayNearestPoint(cursorPoint);
    const { x } = cursorPoint;

    if (canAnimate) {
      // 鼠标靠近当前屏幕右侧触发窗口滑出
      if (x >= currentDisplay.workArea.x + currentDisplay.workArea.width - TRIGGER_SHOW_OFFSET && !windowRuntime.isShow) {
        showFromRight()
        canAnimate = false
      } else if (x >= currentDisplay.workArea.x + currentDisplay.workArea.width - TRIGGER_SHOW_OFFSET && windowRuntime.isShow) {
        hideToRight()
        canAnimate = false
      }
    } else {
      if (x < currentDisplay.workArea.x + currentDisplay.workArea.width - TRIGGER_SHOW_OFFSET) {
        canAnimate = true
      }
    }
  }, 100);
}
export const showFromRight = () => {
  const mainWindow = globalThis["windows"].mainWindow
  if (!mainWindow) return;
  if (windowRuntime.isShow) return
  if (isAnimating) return
  isAnimating = true

  const cursorPoint = screen.getCursorScreenPoint();
  const currentDisplay = screen.getDisplayNearestPoint(cursorPoint);
  const windowState = store.get('windowState') || {}
  let { width, height } = windowState
  const maxWidth = Math.min(width, currentDisplay.workArea.width * 0.9);
  const maxHeight = Math.min(height, currentDisplay.workArea.height * 0.9);


  if (width > maxWidth || height > maxHeight) {
    width = Math.min(width, maxWidth);
    height = Math.min(height, maxHeight);
    store.set('windowState', {
      ...windowState,
      width,
      height,
    });
    mainWindow?.setSize(maxWidth, maxHeight)
  }

  mainWindow?.setPosition(
    currentDisplay.workArea.x + currentDisplay.workArea.width - width,
    Math.round((currentDisplay.workArea.height - height) / 2) + currentDisplay.workArea.y
  );
  const bounds = mainWindow.getBounds();

  // 起始位置（屏幕右侧外）
  const startX = currentDisplay.workArea.x + currentDisplay.workArea.width;
  // 目标位置
  const endX = currentDisplay.workArea.x + currentDisplay.workArea.width - bounds.width - BOUNDARY_GAP;

  // 先将窗口移到起始位置并显示
  mainWindow.setBounds({
    ...bounds,
    x: startX,
  });
  mainWindow.show();
  setTimeout(() => {
    mainWindow.focus()
  }, 0)

  const isPin = store.get('settings.isPin')
  if (!isPin) {
    showOverlayWindow()
  }

  // 开始动画
  windowAnimator.animate(
    startX,
    endX,
    350, // 动画持续时间（毫秒）
    (x) => {
      mainWindow?.setBounds({
        ...bounds,
        x: Math.round(x),
      }, false);
    },
    () => {
      isAnimating = false
      windowRuntime.isShow = true
    },
    Easing.easeOut
  );
}

export const hideToRight = () => {
  const mainWindow = globalThis["windows"].mainWindow
  if (!mainWindow) return;
  if (isAnimating) return
  if (!windowRuntime.isShow) return
  isAnimating = true
  const currentDisplay = screen.getDisplayNearestPoint(screen.getCursorScreenPoint())
  const bounds = mainWindow.getBounds();

  // 起始位置（当前位置）
  const startX = bounds.x;
  // 目标位置（屏幕右侧外）
  const endX = currentDisplay.workArea.x + currentDisplay.workArea.width;

  // 开始动画
  windowAnimator.animate(
    startX,
    endX,
    350, // 动画持续时间（毫秒）
    (x) => {
      mainWindow?.setBounds({
        ...bounds,
        x: Math.round(x),
      }, false);
    },
    () => {
      mainWindow.hide()
      isAnimating = false
      windowRuntime.isShow = false
    },
    Easing.easeOut
  );
}


export const showOverlayWindow = () => {
  const overlayWindow = globalThis["windows"].overlayWindow
  if (!overlayWindow) return;
  const size = screen.getDisplayNearestPoint(screen.getCursorScreenPoint())
  overlayWindow.setBounds({
    width: size.bounds.width,
    height: size.bounds.height,
    x: 0,
    y: 0,
  });
  overlayWindow.show()
}

export const hideOverlayWindow = () => {
  const overlayWindow = globalThis["windows"].overlayWindow
  if (!overlayWindow) return;
  overlayWindow.setBounds({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });
  overlayWindow.hide()
}
