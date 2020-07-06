interface Options {
  orientation: 'horizontal' | 'vertical',
  type: 'single' | 'double',
  min: number,
  max: number,
  step: number,
}

interface ViewOptions {
  orientation: 'horizontal' | 'vertical',
  type: 'single' | 'double',
  values?: number[],
}

interface ModelOptions {
  min: number,
  max: number,
  step: number,
}

export { Options, ViewOptions, ModelOptions };
