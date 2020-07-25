import '../assets/favicons/favicons';
import '../slider';
import '../slider.scss';
import { Settings } from './Settings';

const firstAnchor = $('.js-first-anchor');
const secondAnchor = $('.js-second-anchor');
const thirdAnchor = $('.js-third-anchor');
const fourthAnchor = $('.js-fourth-anchor');

const firstSlider = firstAnchor.slider();
const secondSlider = secondAnchor.slider({
  orientation: 'horizontal',
  type: 'single',
  min: -100000,
  max: 100000,
  step: 10,
  from: -1000,
  hideFromTo: false,
  hideScale: false,
});
const thirdSlider = thirdAnchor.slider({
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
const fourthSlider = fourthAnchor.slider({
  orientation: 'vertical',
  type: 'single',
  min: 0,
  max: 500,
  step: 25,
  from: 175,
  hideFromTo: false,
  hideScale: false,
});

[firstSlider, secondSlider, thirdSlider, fourthSlider].forEach((slider) => new Settings(slider));
