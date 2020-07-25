import '@testing-library/jest-dom';

import { View } from '../src/View/View';
import { ViewOptions } from '../src/interfaces/interfaces';

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

describe('Scale', () => {
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

  test('must create a visible element', () => {
    const scaleElement = slider.querySelector('.slider__scale');

    expect(scaleElement).toBeVisible();
  });

  test('must be hidden when hideScale=true', () => {
    view.setState({ hideScale: true });
    const scaleElement = slider.querySelector('.slider__scale');

    expect(scaleElement).not.toBeVisible();

    view.setState({ hideScale: false });
    expect(scaleElement).toBeVisible();
  });

  test('click on a scale value must dispatch a scaleclick event', () => {
    const scaleValueElement: HTMLElement = slider.querySelector('.slider__scale-value') as HTMLElement;
    const value: number = Number(scaleValueElement.innerHTML);
    const checkScaleClick = jest.fn((event) => event.detail.value);
    slider.addEventListener('scaleclick', checkScaleClick);
    scaleValueElement.click();
    expect(checkScaleClick.mock.calls.length).toBe(1);
    expect(checkScaleClick.mock.results[0].value).toBe(value);
  });

  test('click on a scale value must dispatch a scaleclick event if type is single', () => {
    view.setState({ type: 'single' });
    const scaleValueElement: HTMLElement = slider.querySelector('.slider__scale-value') as HTMLElement;
    const value: number = Number(scaleValueElement.innerHTML);
    const checkScaleClick = jest.fn((event) => event.detail.value);
    slider.addEventListener('scaleclick', checkScaleClick);
    scaleValueElement.click();
    expect(checkScaleClick.mock.calls.length).toBe(1);
    expect(checkScaleClick.mock.results[0].value).toBe(value);
  });

  test('click on a scale (not a concrete value) must not dispatch a scaleclick event', () => {
    const scaleValueElement: HTMLElement = slider.querySelector('.slider__scale') as HTMLElement;
    const checkScaleClick = jest.fn();
    slider.addEventListener('scaleclick', checkScaleClick);
    scaleValueElement.click();
    expect(checkScaleClick.mock.calls.length).toBe(0);
  });
});
