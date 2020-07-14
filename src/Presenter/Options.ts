interface Options {
  orientation: 'horizontal' | 'vertical',
  type: 'single' | 'double',
  min: number,
  max: number,
  step: number,
  from: number,
  to: number,
  hide_from_to: boolean,
  hide_scale: boolean,
}

interface ViewOptions {
  from: number,
  to: number,
  orientation: 'horizontal' | 'vertical',
  type: 'single' | 'double',
  hide_from_to: boolean,
  hide_scale: boolean,
}

interface ViewState extends ViewOptions {
  values: number[],
  pxValues: number[],
}

interface ModelOptions {
  min: number,
  max: number,
  step: number,
}

interface ModelState extends ModelOptions {
  values: number[],
}

export {
  Options, ViewOptions, ViewState, ModelOptions, ModelState,
};
