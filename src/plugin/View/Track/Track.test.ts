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

describe('Track', () => {
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
    const track = slider.querySelector('.slider__track');

    expect(track).toBeVisible();
  });

  test('track click must call getSliderPosition method', () => {
    const spy = jest.spyOn(view, 'getSliderPosition');
    const track = slider.querySelector('.slider__track') as HTMLElement;
    track.click();

    expect(spy).toBeCalled();
  });

  test('track click must call getSliderPosition method if vertical', () => {
    view.setState({ orientation: 'vertical' });
    const spy = jest.spyOn(view, 'getSliderPosition');
    const track = slider.querySelector('.slider__track') as HTMLElement;
    track.click();

    expect(spy).toBeCalled();
  });
});
