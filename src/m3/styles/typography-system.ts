// Typography System
// Do NOT just import things from this file,
// import from src/m3/styles/index.ts instead.

export type types =
  | 'display-large'
  | 'display-medium'
  | 'display-small'
  | 'headline-large'
  | 'headline-medium'
  | 'headline-small'
  | 'title-large'
  | 'title-medium'
  | 'title-small'
  | 'label-large'
  | 'label-medium'
  | 'label-small'
  | 'body-large'
  | 'body-medium'
  | 'body-small';

export function generateStyle(variantName: types) {
  return [
    `font-family: var(--md-sys-typescale-${variantName}-font-family-name);`,
    `font-weight: var(--md-sys-typescale-${variantName}-font-weight);`,
    `font-size: var(--md-sys-typescale-${variantName}-font-size);`,
    `letter-spacing: var(--md-sys-typescale-${variantName}-letter-spacing);`,
    `line-height: var(--md-sys-typescale-${variantName}-line-height);`,
  ].join('');
}
