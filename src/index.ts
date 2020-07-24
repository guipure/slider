import './assets/favicons/favicons';
import './slider.scss';
import './slider';

$('.js-first-anchor').slider();

$('.js-second-anchor').slider({
  orientation: 'horizontal',
  type: 'single',
  min: -100000,
  max: 100000,
  step: 10,
  from: -1000,
  hideFromTo: false,
  hideScale: false,
});

$('.js-third-anchor').slider({
  orientation: 'vertical',
  type: 'double',
  min: 0,
  max: 5000,
  step: 2,
  from: 500,
  to: 1500,
  hideFromTo: false,
  hideScale: false,
});

$('.js-fourth-anchor').slider({
  orientation: 'vertical',
  type: 'single',
  min: 0,
  max: 500,
  step: 25,
  from: 175,
  hideFromTo: false,
  hideScale: false,
});
