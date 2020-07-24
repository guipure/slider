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
  orientation: Orientation,
  type: SliderType,
  hideFromTo: boolean,
  hideScale: boolean,
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
  type: SliderType,
}

const standardOptions: Options = {
  orientation: 'horizontal',
  type: 'double',
  min: 0,
  max: 10,
  step: 1,
  from: 2,
  to: 8,
  hideFromTo: false,
  hideScale: false,
};

export {
  Options, ViewOptions, ViewState, Values, ModelOptions, Orientation, SliderType, standardOptions,
};
