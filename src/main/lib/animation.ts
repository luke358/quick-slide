type EaseFunction = (t: number) => number;

// 常用缓动函数
const Easing = {
  // 缓出
  easeOut: (t: number): number => 1 - Math.pow(1 - t, 3),
  // 缓入缓出
  easeInOut: (t: number): number => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
}

class Animator {
  private animationHandle: NodeJS.Immediate | null = null;
  private startTime: number = 0;
  private startValue: number = 0;
  private endValue: number = 0;
  private duration: number = 0;
  private onUpdate: (value: number) => void = () => {};
  private onComplete: () => void = () => {};
  private easeFunc: EaseFunction = Easing.easeOut;

  animate(
    from: number,
    to: number,
    duration: number,
    onUpdate: (value: number) => void,
    onComplete?: () => void,
    easeFunc: EaseFunction = Easing.easeOut
  ) {
    this.stop();
    
    this.startValue = from;
    this.endValue = to;
    this.duration = duration;
    this.onUpdate = onUpdate;
    this.onComplete = onComplete || (() => {});
    this.easeFunc = easeFunc;
    this.startTime = Date.now();
    
    this.update();
  }

  private update = () => {
    const elapsed = Date.now() - this.startTime;
    const progress = Math.min(elapsed / this.duration, 1);
    
    const easedProgress = this.easeFunc(progress);
    const currentValue = this.startValue + (this.endValue - this.startValue) * easedProgress;
    
    this.onUpdate(currentValue);

    if (progress < 1) {
      this.animationHandle = setImmediate(this.update);
    } else {
      this.onComplete();
      this.stop();
    }
  }

  stop() {
    if (this.animationHandle != null) {
      clearImmediate(this.animationHandle);
      this.animationHandle = null;
    }
  }
}

export { Animator, Easing };
