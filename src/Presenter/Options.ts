type Orientation = 'horizontal' | 'vertical';
type SliderType = 'single' | 'double';

interface Options {
  orientation: Orientation,
  type: SliderType,
  min: number,
  max: number,
  step: number,
  from: number,
  to: number,
  hide_from_to: boolean,
  hide_scale: boolean,
}

interface ViewOptions {
  orientation: Orientation,
  type: SliderType,
  hide_from_to: boolean,
  hide_scale: boolean,
}

interface Values {
  min: number,
  max: number,
  step: number,
}

interface ViewState extends ViewOptions {
  values: Values,
  pxStep: number,
  pxMax: number,
  from: number,
  to: number,
}

interface ModelOptions {
  min: number,
  max: number,
  step: number,
  from: number,
  to: number,
}

export {
  Options, ViewOptions, ViewState, Values, ModelOptions, Orientation, SliderType,
};
