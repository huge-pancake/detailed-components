import { Constructor } from '../../utils/types.js';
import BaseElement from './base-element.js';

var fromKeyboard = false;

window.addEventListener(
  'keydown',
  () => {
    fromKeyboard = true;
  },
  { capture: true }
);
window.addEventListener(
  'mousedown',
  () => {
    fromKeyboard = false;
  },
  { capture: true }
);

/**
 * @module FocusMixin
 */
export default function FocusMixin(Base: Constructor<BaseElement>) {
  return class Focus extends Base {
    #boundFocus;
    #boundBlur;

    constructor() {
      super();

      this.#boundFocus = this.#focus.bind(this);
      this.#boundBlur = this.#blur.bind(this);
    }

    #focus(_e: FocusEvent) {
      const from = fromKeyboard ? 'keyboard' : 'pointer';
      this.setAttribute('focus', from);
    }
    #blur(_e: FocusEvent) {
      this.removeAttribute('focus');
    }

    override connectedCallback() {
      super.connectedCallback?.();
      this.addEventListener('focus', this.#boundFocus);
      this.addEventListener('blur', this.#boundBlur);
    }
    override disconnectedCallback() {
      super.disconnectedCallback?.();
      this.removeEventListener('focus', this.#boundFocus);
      this.removeEventListener('blur', this.#boundBlur);
    }
  };
}
