import BaseElement from '../../base/mixins/base-element.js';
import { css } from '../../utils/template.js';
import { distance } from '../../utils/maths.js';

const M3RippleStyles = css`
:host {
  border-radius: inherit;
  display: block;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  position: absolute;
}

[part~='ripple'] {
  background-color: currentcolor;
  left: 0;
  opacity: var(--md-comp-ripple-opacity, 0.23);
  pointer-events: none;
  position: absolute;
  /* 用 filter blur 的话，在 Chromium 上显示效果不完美 */
  width: 0.01rem; /* 不能太小，否则阴影是方的 */
  height: 0.01rem;
  box-shadow: 0 0 80px var(--radius) currentcolor;
}
[part~='ripple'],
:host([circle]) {
  border-radius: 50%;
}
`;

/**
 * M3Ripple
 *
 * from https://codepen.io/dffzmxj/pen/XWVxoWE
 */
export default class M3Ripple extends BaseElement {
  override styles() { return [M3RippleStyles]; }
  
  $parent: HTMLElement;
  $ripples: Array<HTMLDivElement> = [];
  #defaultMaximumRadius = 200;
  #defaultMinimumDuration = 300;
  #boundAddRipple;
  #boundRemoveRipples;
  #boundKeydown;
  #boundKeyup;
  #keyPressed = false;

  constructor() {
    super();

    this.#boundAddRipple = this.#addRipple.bind(this);
    this.#boundRemoveRipples = this.#removeRipples.bind(this);
    this.#boundKeydown = this.#keydown.bind(this);
    this.#boundKeyup = this.#keyup.bind(this);
  }

  #addRipple(event: TouchEvent | MouseEvent = null) {
    const box = this.getBoundingClientRect();
    const boxCenter = {
      x: box.width / 2,
      y: box.height / 2,
    };
    const centered = !event || this.centered;
    let rippleCenter: { x: number; y: number } = { x: 0, y: 0 };
    if (centered) {
      rippleCenter.x = boxCenter.x;
      rippleCenter.y = boxCenter.y;
    } else {
      // @ts-ignore
      const pointer = event.targetTouches ? Array.prototype.slice.call(event.targetTouches, -1) : event;
      // @ts-ignore
      rippleCenter.x = pointer.clientX - box.left;
      // @ts-ignore
      rippleCenter.y = pointer.clientY - box.top;
    }
    const corners = [
      { x: 0, y: 0 },
      { x: box.width, y: 0 },
      { x: 0, y: box.height },
      { x: box.width, y: box.height },
    ];
    // const radius = Math.min(
    //   this.maximumRadius,
    //   Math.max(...corners.map((corner) => distance(rippleCenter, corner)))
    // );
    const radius = Math.max(...corners.map((corner) => distance(rippleCenter, corner)));
    // const translateStart = `${rippleCenter.x - radius}px, ${rippleCenter.y - radius}px`;
    // const translateEnd = (this.willRecenter && !centered) ? `${boxCenter.x - radius}px, ${boxCenter.y - radius}px` : translateStart;
    const ripple = document.createElement('div');
    ripple.setAttribute('part', 'ripple');
    // ripple.style.height = ripple.style.width = 2 * radius + 'px';
    // ripple.style.transform = `translate(${translateEnd})`;

    ripple.style.setProperty('--radius', `${radius}px`);
    ripple.style.left = `${rippleCenter.x}px`;
    ripple.style.top = `${rippleCenter.y}px`;

    this.$ripples.push(ripple);
    this.shadowRoot!.append(ripple);
    ripple.animate(
      {
        boxShadow: ['0 0 80px calc(var(--radius) * 0.2) currentcolor', '0 0 80px var(--radius) currentcolor'],
      },
      {
        duration: Math.max(this.minimumDuration) || 0,
        easing: 'cubic-bezier(0.1, 0, 0.5, 1)',
        fill: 'forwards',
      }
    );

    // 雪花效果
    const scene = document.createElement('canvas');
    scene.height = box.height;
    scene.width = box.width;
    const context = scene.getContext('2d');
    context!.fillStyle = 'white';
    for (let x = 0; x < scene.width; x++)
      for (let y = 0; y < scene.height; y++) if (Math.random() < 0.005) context!.fillRect(x, y, 1, 1);
    this.shadowRoot!.append(scene);
    const { opacity } = getComputedStyle(scene);
    const animation = scene.animate(
      {
        // @ts-ignore
        opacity: [0, opacity, 0],
      },
      {
        duration: Math.max(this.minimumDuration) || 0,
        easing: 'linear',
      }
    );
    animation.onfinish = animation.oncancel = () => scene.remove();
  }
  #removeRipples() {
    for (const ripple of this.$ripples.splice(0)) {
      const { opacity } = getComputedStyle(ripple);
      if (!opacity) {
        ripple.remove();
        continue;
      }
      const animation = ripple.animate(
        {
          // @ts-ignore
          opacity: [opacity, 0],
        },
        {
          duration: 800,
          fill: 'forwards',
          easing: 'cubic-bezier(0.4, 0, 0.7, 0)',
        }
      );
      animation.onfinish = animation.oncancel = () => ripple.remove();
    }
  }

  get centered() {
    return this.hasAttribute('centered');
  }
  set centered(value) {
    const boolValue = !!value;
    boolValue ? this.centered || this.setAttribute('centered', '') : this.removeAttribute('centered');
  }

  get willRecenter() {
    return this.hasAttribute('will-recenter');
  }
  set willRecenter(value) {
    const boolValue = !!value;
    boolValue ? this.willRecenter || this.setAttribute('will-recenter', '') : this.removeAttribute('will-recenter');
  }

  get maximumRadius() {
    const maximumRadius = parseFloat(this.getAttribute('maxradius') || '');
    return isFinite(maximumRadius) ? maximumRadius : this.#defaultMaximumRadius;
  }
  set maximumRadius(value: number) {
    this.setAttribute('maxradius', value.toString());
  }

  get minimumDuration() {
    const minimumDuration = parseFloat(this.getAttribute('minduration') || '');
    return isFinite(minimumDuration) ? minimumDuration : this.#defaultMinimumDuration;
  }
  set minimumDuration(value: number) {
    this.setAttribute('minduration', value.toString());
  }

  #keydown({ key }: KeyboardEvent) {
    if (key === ' ' && !this.#keyPressed) {
      this.#keyPressed = true;
      this.#addRipple();
    }
    if (key === 'Enter') {
      this.#addRipple();
      this.#removeRipples();
    }
  }
  #keyup({ key }: KeyboardEvent) {
    if (key === ' ') {
      this.#keyPressed = false;
      this.#removeRipples();
    }
  }

  override connectedCallback() {
    // @ts-ignore
    this.$parent = this.parentNode?.nodeType === 11 ? (this.getRootNode() as ShadowRoot).host : this.parentNode;
    if (getComputedStyle(this.$parent).position === 'static') this.$parent.style.position = 'relative';
    this.$parent.addEventListener('touchstart', this.#boundAddRipple);
    this.$parent.addEventListener('mousedown', this.#boundAddRipple);
    this.$parent.addEventListener('keydown', this.#boundKeydown);
    this.$parent.addEventListener('touchend', this.#boundRemoveRipples);
    document.addEventListener('mouseup', this.#boundRemoveRipples);
    document.addEventListener('keyup', this.#boundKeyup);
  }
  override disconnectedCallback() {
    this.$parent.removeEventListener('touchstart', this.#boundAddRipple);
    this.$parent.removeEventListener('mousedown', this.#boundAddRipple);
    this.$parent.removeEventListener('keydown', this.#boundKeydown);
    this.$parent.removeEventListener('touchend', this.#boundRemoveRipples);
    document.removeEventListener('mouseup', this.#boundRemoveRipples);
    document.removeEventListener('keyup', this.#boundKeyup);
  }
}

customElements.define('md-ripple', M3Ripple);
declare global {
  interface HTMLElementTagNameMap {
    'md-ripple': M3Ripple;
  }
}
