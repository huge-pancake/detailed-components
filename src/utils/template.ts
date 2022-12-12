export const createTemplate = (
  strings: TemplateStringsArray,
  ...substitutions: (string | DocumentFragment)[]
): HTMLTemplateElement => {
  substitutions.map((substitution) => {
    if (typeof substitution !== 'object') return;
    let box = document.createElement('div');
    box.appendChild(substitution.cloneNode(true));
    substitutions[substitutions.indexOf(substitution)] = box.innerHTML.toString();
    box.remove();
  });
  const template = document.createElement('template');
  template.innerHTML = String.raw(strings, ...substitutions);
  return template;
};

export const html = (
  strings: TemplateStringsArray,
  ...substitutions: (string | DocumentFragment)[]
): DocumentFragment => {
  return createTemplate(strings, ...substitutions).content;
};

export const css = (
  strings: TemplateStringsArray,
  ...substitutions: (string)[]
): CSSStyleSheet => {
  let _css = new CSSStyleSheet();
  _css.replaceSync(String.raw(strings, ...substitutions));
  return _css;
};
