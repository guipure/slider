import '@testing-library/jest-dom';

import { View } from '../View/View';
import { Options } from '../../interfaces/interfaces';

const standardOptions: Options = {
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

function createSlider(options: Options): View {
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
    const thumbs = slider.querySelectorAll('.js-slider__thumb');

    expect(thumbs[0]).toBeVisible();
    expect(thumbs[1]).toBeVisible();
  });

  test('if type=single only one thumb must be visible', () => {
    view.setState({ type: 'single' });
    const thumbs = slider.querySelectorAll('.js-slider__thumb');

    expect(thumbs[0]).toBeVisible();
    expect(thumbs[1]).not.toBeVisible();
  });

  test('labels must be visible', () => {
    const thumbLabels = slider.querySelectorAll('.js-slider__thumb-label');

    expect(thumbLabels[0]).toBeVisible();
    expect(thumbLabels[1]).toBeVisible();
  });

  test('labels must be not visible if hideFromTo=true', () => {
    view.setState({ hideFromTo: true });
    const thumbLabels = slider.querySelectorAll('.js-slider__thumb-label');

    expect(thumbLabels[0]).not.toBeVisible();
    expect(thumbLabels[1]).not.toBeVisible();
  });

  test('if type=single only one thumb must be visible', () => {
    view.setState({ type: 'single' });
    const thumbLabels = slider.querySelectorAll('.js-slider__thumb-label');

    expect(thumbLabels[0]).toBeVisible();
    expect(thumbLabels[1]).not.toBeVisible();
  });

  test('label value must be equal to from/to value', () => {
    const thumbLabels = slider.querySelectorAll('.js-slider__thumb-label');

    expect(Number(thumbLabels[0].innerHTML)).toBe(view.state.from);
    expect(Number(thumbLabels[1].innerHTML)).toBe(view.state.to);
  });
});
