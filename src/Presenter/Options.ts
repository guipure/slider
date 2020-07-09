interface Options {
  orientation: 'horizontal' | 'vertical',
  type: 'single' | 'double',
  min: number,
  max: number,
  step: number,
  from: number,
  to: number,
  hide_from_to: boolean,
}

interface ViewOptions {
  from: number,
  to: number,
  orientation: 'horizontal' | 'vertical',
  type: 'single' | 'double',
  values?: number[],
  hide_from_to: boolean,
}

interface ModelOptions {
  min: number,
  max: number,
  step: number,
  values?: number[],
}

export { Options, ViewOptions, ModelOptions };
