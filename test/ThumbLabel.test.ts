import '@testing-library/jest-dom';
import { View } from '../src/View/View';
import { ViewOptions } from '../src/Presenter/Options';

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

describe('ThumbLabel', () => {
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
    const thumbLabels = slider.querySelectorAll('.slider__thumb-label');

    expect(thumbLabels[0]).toBeVisible();
    expect(thumbLabels[1]).toBeVisible();
  });

  test('must be not visible if hideFromTo=true', () => {
    view.setState({ hideFromTo: true });
    const thumbLabels = slider.querySelectorAll('.slider__thumb-label');

    expect(thumbLabels[0]).not.toBeVisible();
    expect(thumbLabels[1]).not.toBeVisible();
  });

  test('if type=single only one thumb must be visible', () => {
    view.setState({ type: 'single' });
    const thumbLabels = slider.querySelectorAll('.slider__thumb-label');

    expect(thumbLabels[0]).toBeVisible();
    expect(thumbLabels[1]).not.toBeVisible();
  });

  test('label value must be equal to from/to value', () => {
    const thumbLabels = slider.querySelectorAll('.slider__thumb-label');

    expect(Number(thumbLabels[0].innerHTML)).toBe(view.state.from);
    expect(Number(thumbLabels[1].innerHTML)).toBe(view.state.to);
  });
});
