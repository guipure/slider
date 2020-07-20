import '@testing-library/jest-dom';
import { View } from '../src/View/View';
import { ViewOptions, Values } from '../src/Presenter/Options';

const standardOptions: ViewOptions = {
  orientation: 'horizontal',
  type: 'double',
  hide_from_to: false,
  hide_scale: false,
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
    const scaleElement = slider.querySelector('.scale');

    expect(scaleElement).toBeVisible();
  });

  test('must be hidden when hide_scale=true', () => {
    view.setState({ hide_scale: true });
    const scaleElement = slider.querySelector('.scale');

    expect(scaleElement).not.toBeVisible();

    view.setState({ hide_scale: false });
    expect(scaleElement).toBeVisible();
  });

  test('must create at list two scale values', () => {
    const scaleValueElements = slider.querySelectorAll('.scale__value');

    expect(scaleValueElements.length).toBeGreaterThanOrEqual(2);
  });

  test('click on a scale value must dispatch a scaleclick event', () => {
    const scaleValueElement: HTMLElement = slider.querySelector('.scale__value') as HTMLElement;
    const value: number = Number(scaleValueElement.innerHTML);
    const checkScaleClick = jest.fn((event) => event.detail.value);
    slider.addEventListener('scaleclick', checkScaleClick);
    scaleValueElement.click();
    expect(checkScaleClick.mock.calls.length).toBe(1);
    expect(checkScaleClick.mock.results[0].value).toBe(value);
  });

  test('click on a scale value must dispatch a scaleclick event if type is single', () => {
    view.setState({ type: 'single' });
    const scaleValueElement: HTMLElement = slider.querySelector('.scale__value') as HTMLElement;
    const value: number = Number(scaleValueElement.innerHTML);
    const checkScaleClick = jest.fn((event) => event.detail.value);
    slider.addEventListener('scaleclick', checkScaleClick);
    scaleValueElement.click();
    expect(checkScaleClick.mock.calls.length).toBe(1);
    expect(checkScaleClick.mock.results[0].value).toBe(value);
  });

  test('click on a scale (not a concrete value) must not dispatch a scaleclick event', () => {
    const scaleValueElement: HTMLElement = slider.querySelector('.scale') as HTMLElement;
    const checkScaleClick = jest.fn();
    slider.addEventListener('scaleclick', checkScaleClick);
    scaleValueElement.click();
    expect(checkScaleClick.mock.calls.length).toBe(0);
  });
});
