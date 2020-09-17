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
  hideFromTo: boolean,
  hideScale: boolean,
}

interface ViewOptions {
  min: number,
  max: number,
  step: number,
  from: number,
  to: number,
  orientation: Orientation,
  type: SliderType,
  hideFromTo: boolean,
  hideScale: boolean,
}

interface ViewState extends ViewOptions {
  pxStep: number,
  pxMax: number,
}

interface ModelOptions {
  min: number,
  max: number,
  step: number,
  from: number,
  to: number,
  type: SliderType,
}

export {
  Options, ViewOptions, ViewState, ModelOptions, Orientation, SliderType,
};
