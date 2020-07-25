import { Options } from './options';

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

const sliderOrientation = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical',
};

const sliderType = {
  SINGLE: 'single',
  DOUBLE: 'double',
};

export { standardOptions, sliderOrientation, sliderType };
