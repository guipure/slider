import './index.scss';
import './plugin';

$('.js-slider-wrapper').slider({
  orientation: 'horizontal',
  type: 'double',
  min: -5,
  max: 10,
  step: 2,
  from: -50,
  to: -50,
  hide_from_to: false,
  hide_scale: false,
});

$('.js-another').slider({
  orientation: 'vertical',
  type: 'double',
  min: 1,
  max: 10,
  step: 2,
  from: 1,
  to: 5,
  hide_from_to: false,
  hide_scale: false,
});
