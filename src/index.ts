import './index.scss';
import './plugin';

$('.slider-wrapper').slider({
  orientation: 'horizontal',
  type: 'double',
  min: 1,
  max: 10,
  step: 1,
});

$('.another').slider({
  orientation: 'vertical',
  type: 'double',
  min: 1,
  max: 10,
  step: 1.2,
});
