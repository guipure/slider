import '../assets/favicons/favicons';
import { Options } from '../plugin/interfaces/interfaces';
import { Settings } from './settings/Settings';
import './index.scss';

const firstOptions: Partial<Options> = {};

const secondOptions: Partial<Options> = {
  orientation: 'horizontal',
  type: 'single',
  min: -100000,
  max: 100000,
  step: 10,
  from: -1000,
  hideFromTo: false,
  hideScale: false,
};

const thirdOptions: Partial<Options> = {
  orientation: 'vertical',
  type: 'double',
  min: 0,
  max: 5000,
  step: 2,
  from: 500,
  to: 1500,
  hideFromTo: false,
  hideScale: false,
};

const fourthOptions: Partial<Options> = {
  orientation: 'vertical',
  type: 'single',
  min: 0,
  max: 500,
  step: 25,
  from: 175,
  hideFromTo: false,
  hideScale: false,
};

const options = [firstOptions, secondOptions, thirdOptions, fourthOptions];

const $anchors = $('.js-anchor');

$.each($anchors, (key, anchor) => (
  new Settings($(anchor).slider(options[key]))
));
