import '@testing-library/jest-dom';
import { View } from '../src/View/View';
import { ViewOptions } from '../src/Presenter/Options';

describe('Scale', () => {
  let view: View;
  let slider: HTMLElement;

  beforeEach(() => {
    const options: ViewOptions = {
      from: -1,
      to: 0,
      orientation: 'horizontal',
      type: 'double',
      hide_from_to: false,
      hide_scale: false,
    };
    const anchor = document.createElement('div');
    anchor.className = 'anchor';
    document.body.append(anchor);
    const values: number[] = [-1, 0];
    view = new View(anchor, options, values);
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

    scaleValueElement.click();
    expect(checkScaleClick.mock.calls.length).toBe(2);
  });

  test('click on a scale (not a concrete value) must not dispatch a scaleclick event', () => {
    const scaleValueElement: HTMLElement = slider.querySelector('.scale') as HTMLElement;
    const checkScaleClick = jest.fn();
    slider.addEventListener('scaleclick', checkScaleClick);
    scaleValueElement.click();
    expect(checkScaleClick.mock.calls.length).toBe(0);
  });

  test('if values.length = 10 must create equal number of scale__value', () => {
    const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    view.setState({ values });
    const scaleValueElements = slider.querySelectorAll('.scale__value');

    expect(scaleValueElements.length).toBe(10);
  });

  test('if values.length = 2 must create equal number of scale__value', () => {
    const values = [1, 2];
    view.setState({ values });
    const scaleValueElements = slider.querySelectorAll('.scale__value');

    expect(scaleValueElements.length).toBe(2);
  });

  test('if values.length = 15 must create 10 or less scale__value', () => {
    const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    view.setState({ values });
    const scaleValueElements = slider.querySelectorAll('.scale__value');

    expect(scaleValueElements.length).not.toBeGreaterThan(10);
  });

  test('if values.length = 11 must create 10 or less scale__value', () => {
    const values = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100];
    view.setState({ values });
    const scaleValueElements = slider.querySelectorAll('.scale__value');

    expect(scaleValueElements.length).not.toBeGreaterThan(10);
  });
});
