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

interface ViewState extends Options {
  pxStep: number,
  pxMax: number,
}

export {
  Options, ViewState, Orientation, SliderType,
};
