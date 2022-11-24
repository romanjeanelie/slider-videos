import debounce from "lodash/debounce";
import normalizeWheel from "normalize-wheel-es";

import { lerp } from "@/utils/math";

export default class Slider {
  constructor({ container }) {
    this.container = container;
    this.slides = this.container.childNodes;

    this.heightSlide = this.slides[0].offsetHeight;
    this.fullHeight = this.heightSlide * (this.slides.length - 1);

    this.scroll = {
      ease: 0.1,
      current: 0,
      target: 0,
      last: 0,
    };

    this.onCheckDebounce = debounce(this.onCheck, 20);

    this.addEventListeners();
    this.update();
  }

  /**
   * Events
   */
  onTouchDown(e) {
    this.isDown = true;

    this.scroll.position = this.scroll.current;
    this.start = e.touches ? e.touches[0].clientY : e.clientY;
  }

  onTouchMove(e) {
    if (!this.isDown) return;

    const y = e.touches ? e.touches[0].clientY : e.clientY;
    const distance = (this.start - y) * 1.5;

    this.scroll.target = this.scroll.position + distance;
  }

  onTouchUp() {
    this.isDown = false;

    this.onCheck();
  }

  onWheel(e) {
    const normalized = normalizeWheel(e);
    const speed = normalized.pixelY;

    this.scroll.target += speed * 0.3;

    this.onCheckDebounce();
  }

  onCheck() {
    const itemIndex = Math.round(Math.abs(this.scroll.target) / this.heightSlide);
    const item = this.heightSlide * itemIndex;

    // Snap
    if (this.scroll.target < 0) {
      this.scroll.target = 0;
    } else if (this.scroll.target > this.fullHeight) {
      this.scroll.target = this.fullHeight;
    } else {
      this.scroll.target = item;
    }
  }

  /**
   * Update.
   */
  update() {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);

    this.scroll.last = this.scroll.current;

    // Update slides
    this.slides.forEach((slide, i) => {
      const positionY = this.heightSlide * i - this.scroll.current;
      slide.style.transform = `translateY(${positionY}px)`;
    });

    window.requestAnimationFrame(this.update.bind(this));
  }

  /**
   * Resize.
   */
  onResize() {
    this.heightSlide = this.slides[0].offsetHeight;
    this.fullHeight = this.heightSlide * (this.slides.length - 1);
  }

  /**
   * Listeners.
   */
  addEventListeners() {
    window.addEventListener("resize", this.onResize.bind(this));

    this.container.addEventListener("mousewheel", this.onWheel.bind(this));
    this.container.addEventListener("wheel", this.onWheel.bind(this));

    this.container.addEventListener("mousedown", this.onTouchDown.bind(this));
    this.container.addEventListener("mousemove", this.onTouchMove.bind(this));
    this.container.addEventListener("mouseup", this.onTouchUp.bind(this));
    this.container.addEventListener("mouseleave", this.onTouchUp.bind(this));

    this.container.addEventListener("touchstart", this.onTouchDown.bind(this));
    this.container.addEventListener("touchmove", this.onTouchMove.bind(this));
    this.container.addEventListener("touchend", this.onTouchUp.bind(this));
  }
}
