import '@testing-library/jest-dom';

import { View } from '../View/View';
import { ViewOptions } from '../../interfaces/interfaces';

const standardOptions: ViewOptions = {
  min: -10,
  max: 10,
  step: 5,
  from: -5,
  to: 5,
  orientation: 'horizontal',
  type: 'double',
  hideFromTo: false,
  hideScale: false,
};

function createSlider(options: ViewOptions): View {
  const anchor = document.querySelector('.anchor') as HTMLElement;
  const slider: View = new View(anchor, options);
  return slider;
}

describe('Thumb', () => {
  let view: View;
  let slider: HTMLElement;

  beforeEach(() => {
    const anchor: HTMLElement = document.createElement('div');
    anchor.className = 'anchor';
    document.body.append(anchor);
    view = createSlider(standardOptions);
    slider = view.element;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('must be visible', () => {
    const thumbs = slider.querySelectorAll('.slider__thumb');

    expect(thumbs[0]).toBeVisible();
    expect(thumbs[1]).toBeVisible();
  });

  test('if type=single only one thumb must be visible', () => {
    view.setState({ type: 'single' });
    const thumbs = slider.querySelectorAll('.slider__thumb');

    expect(thumbs[0]).toBeVisible();
    expect(thumbs[1]).not.toBeVisible();
  });
});
