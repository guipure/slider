import './index.scss';
import './plugin';

$('.slider-wrapper').slider({
  orientation: 'horizontal',
  type: 'double',
  min: 1,
  max: 10,
  step: 1,
  from: 3,
  to: 6,
  hide_from_to: false,
  hide_scale: false,
});

$('.another').slider({
  orientation: 'vertical',
  type: 'double',
  min: 1,
  max: 10,
  step: 0.5,
  from: 3.5,
  to: 6.5,
  hide_from_to: false,
  hide_scale: false,
});
