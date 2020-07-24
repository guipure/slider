import '@testing-library/jest-dom';
import { View } from '../src/View/View';
import { ViewOptions, Values } from '../src/Presenter/Options';

const standardOptions: ViewOptions = {
  orientation: 'horizontal',
  type: 'double',
  hideFromTo: false,
  hideScale: false,
};

function createSlider(options: ViewOptions): View {
  const anchor = document.querySelector('.anchor') as HTMLElement;
  const values: Values = {
    min: -10,
    max: 10,
    step: 5,
  };
  const from: number = -5;
  const to: number = 5;
  const slider: View = new View(anchor, options, values, from, to);
  return slider;
}

describe('Bar', () => {
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
    const bar = slider.querySelector('.slider__bar') as HTMLElement;

    expect(bar).toBeVisible();
  });
});
