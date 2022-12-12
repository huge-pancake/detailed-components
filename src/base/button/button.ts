import BaseElement from '../mixins/base-element.js';
import FocusMixin from '../mixins/focus-mixin.js';
import { html, css } from '../../utils/template.js';
import { dataPrefixed } from '../../utils/attributes.js';

const BaseButtonStyles = css`
:host {
  display: inline-flex;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
:host([disabled]) {
  cursor: default;
  pointer-events: none;
}
:host([hidden]) {
  display: none;
}
[part~='button'] {
  align-items: center;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  display: inline-flex;
  flex: 1;
  font: inherit;
  justify-content: center;
  margin: 0;
  /* outline: none; */
  padding: 0;
  position: relative;
  text-decoration: none;
  user-select: none;
}
`;

const booleanAttributes = ['disabled'];
const stringAttributes = ['custom'];
const dataPrefixedStringAttributes = dataPrefixed([
  'role',
  'aria-label',
  'aria-labelledby',
  'aria-describedby',
  'aria-haspopup',
  'aria-expanded',
  'aria-controls',
]);

/**
 * Base Button class
 * 
 * It can be
 * - Button (https://www.w3.org/WAI/ARIA/apg/patterns/button/)
 * - Toggle Button (https://www.w3.org/WAI/ARIA/apg/patterns/button/)
 * - Menu Button (https://www.w3.org/WAI/ARIA/apg/patterns/menubutton/)
 */
export default class BaseButton extends FocusMixin(BaseElement) {
  override delegatesFocus = true;
  override render() {
    return html`
    <${this.custom || 'button'}
      part="button"
      ${this.disabled ? 'disabled' : ''}
      ${this.role ? 'role="' + this.role + '"' : ''}
      ${this.ariaLabel ? 'aria-label="' + this.ariaLabel + '"' : ''}
      ${this.ariaLabelledby ? 'aria-labelledby="' + this.ariaLabelledby + '"' : ''}
      ${this.ariaDescribedby ? 'aria-describedby="' + this.ariaDescribedby + '"' : ''}
      ${this.ariaHasPopup ? 'aria-haspopup="' + this.ariaHasPopup + '"' : ''}
      ${this.ariaExpanded ? 'aria-expanded="' + this.ariaExpanded + '"' : ''}
      ${this.ariaControls ? 'aria-controls="' + this.ariaControls + '"' : ''}
      >
      ${this.renderContents()}
    </${(this.custom || 'button').split(' ')[0]}>
    `;
  }
  renderContents() {
    return html`<slot></slot>`;
  }
  override styles() { return [BaseButtonStyles]; }
  
  get $button(): HTMLButtonElement { return this.$('[part~="button"]'); }

  static get observedAttributes() {
    return [...booleanAttributes, ...stringAttributes, ...dataPrefixedStringAttributes.all];
  }

  get disabled() { return this.hasAttribute('disabled'); }
  set disabled(value: boolean) { this.toggleAttribute('disabled', value); }

  get custom() { return this.getAttribute('custom'); }
  set custom(value: string) { this.setAttribute('custom', value); }

  // ARIA Attributes
  override get role() { return this.getAttribute('data-role'); }
  override set role(value) { this.setAttribute('data-role', value); }
  
  override get ariaLabel() { return this.getAttribute('data-aria-label'); }
  override set ariaLabel(value) { this.setAttribute('data-aria-label', value); }

  get ariaLabelledby() { return this.getAttribute('data-aria-labelledby'); }
  set ariaLabelledby(value) { this.setAttribute('data-aria-labelledby', value); }

  get ariaDescribedby() { return this.getAttribute('data-aria-describedby'); }
  set ariaDescribedby(value) { this.setAttribute('data-aria-describedby', value); }

  override get ariaHasPopup() { return this.getAttribute('data-aria-haspopup'); }
  override set ariaHasPopup(value) { this.setAttribute('data-aria-haspopup', value); }

  override get ariaExpanded() { return this.getAttribute('data-aria-expanded'); }
  override set ariaExpanded(value) { this.setAttribute('data-aria-expanded', value); }

  get ariaControls() { return this.getAttribute('data-aria-controls'); }
  set ariaControls(value) { this.setAttribute('data-aria-controls', value); }

  override attributeChangedCallback(name: string, oldValue: string | undefined, newValue: string | undefined) {
    if (oldValue === newValue) return;

    if (booleanAttributes.includes(name)) this.syncAttribute(this.$button, name, Boolean);
    else if (name === 'custom') this.render();
    else if (dataPrefixedStringAttributes.unprefixed.includes(name)) this.fixUnDataPrefixedAttribute(name, String);
    else if (dataPrefixedStringAttributes.prefixed.includes(name)) this.syncAttribute(this.$button, name, String, true);
  }

  override focus() {
    this.$button.focus();
  }
  override blur() {
    this.$button.blur();
  }
  override click() {
    this.$button.click();
  }
}
