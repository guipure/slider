import { Options } from './interfaces';

const standardOptions: Options = {
  orientation: 'horizontal',
  type: 'double',
  min: 0,
  max: 10,
  step: 1,
  from: 0,
  to: 0,
  hideFromTo: false,
  hideScale: false,
};

const sliderOrientation = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical',
};

const sliderType = {
  SINGLE: 'single',
  DOUBLE: 'double',
};

export { standardOptions, sliderOrientation, sliderType };
