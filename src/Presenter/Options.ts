interface Options {
  orientation?: 'horizontal' | 'vertical',
  min?: number,
  max?: number,
  step?: number,
}

interface ViewOptions {
  orientation?: 'horizontal' | 'vertical',
}

interface ModelOptions {
  max?: number,
  step?: number,
}

export { Options, ViewOptions, ModelOptions };
