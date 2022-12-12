export type PropertyTypes = StringConstructor | BooleanConstructor | NumberConstructor;

export default class BaseElement extends HTMLElement {
  constructor() {
    super();
    this._render();
  }

  delegatesFocus? = false;
  _render() {
    const _shadowRoot = this.shadowRoot || this.attachShadow({ mode: 'open', delegatesFocus: this.delegatesFocus });
    _shadowRoot.innerHTML = ``;
    _shadowRoot.appendChild(this.render().cloneNode(true));
    _shadowRoot.adoptedStyleSheets = [...document.adoptedStyleSheets, ...this.styles()];
  }
  render?(): DocumentFragment {
    return new DocumentFragment();
  }
  styles?(): Array<CSSStyleSheet> {
    return [];
  }

  adoptedCallback?(): void;
  attributeChangedCallback?(name: string, oldValue: string | undefined, newValue: string | undefined): void;
  connectedCallback?(): void;
  disconnectedCallback?(): void;

  // Utils
  $(selectors: string): any {
    return this.shadowRoot.querySelector(selectors);
  }
  syncAttribute(target: HTMLElement, name: string, type: PropertyTypes, dataPrefix: boolean = false) {
    name = dataPrefix ? name.replace('data-', '') : name;
    let outerName = `${dataPrefix ? 'data-' : ''}${name}`;
    switch (type) {
      case String:
      case Number:
        this.hasAttribute(outerName)
          ? target.setAttribute(name, this.getAttribute(outerName))
          : target.removeAttribute(name);
        break;

      case Boolean:
        target.toggleAttribute(name, this.hasAttribute(outerName));
        break;

      default:
        break;
    }
  }
  spinLockOfAttributeRemoving = 0;
  fixUnDataPrefixedAttribute(name: string, type: PropertyTypes) {
    if (this.spinLockOfAttributeRemoving) {
      this.spinLockOfAttributeRemoving--;
      return;
    }
    this.spinLockOfAttributeRemoving++;
    switch (type) {
      case String:
      case Number:
        this.setAttribute('data-' + name, this.getAttribute(name)); // Will active this.syncAttribute
        break;

      case Boolean:
        this.toggleAttribute('data-' + name, this.hasAttribute(name)); // Will active this.syncAttribute
        break;

      default:
        break;
    }
    this.removeAttribute(name);
  }
  defaultAttributes?: object;
  fillDefaultAttributes() {
    for (let key of Object.keys(this.defaultAttributes)) {
      // @ts-ignore
      const value: string = this.defaultAttributes[key];
      !this.getAttribute(key) ? this.setAttribute(key, value) : null;
    }
  }
}
