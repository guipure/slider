import '@testing-library/jest-dom';
import { View } from '../src/View/View';
import { ViewOptions } from '../src/Presenter/Options';

const standardOptions: ViewOptions = {
  from: -1,
  to: 6,
  orientation: 'horizontal',
  type: 'double',
  hide_from_to: false,
  hide_scale: false,
};

function createSlider(options: ViewOptions): View {
  const anchor = document.querySelector('.anchor') as HTMLElement;
  const values: number[] = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8];
  const slider: View = new View(anchor, options, values);
  return slider;
}

beforeEach(() => {
  const anchor: HTMLElement = document.createElement('div');
  anchor.className = 'anchor';
  document.body.append(anchor);
});
afterEach(() => {
  document.body.innerHTML = '';
});

describe('View', () => {
  test('should create a slider with given options', () => {
    const options = standardOptions;
    const slider: View = createSlider(options);
    const {
      from, to, orientation, type, hide_from_to, hide_scale
    } = slider.state;

    expect(from).toBe(options.from);
    expect(to).toBe(options.to);
    expect(orientation).toBe(options.orientation);
    expect(type).toBe(options.type);
    expect(hide_from_to).toBe(options.hide_from_to);
    expect(hide_scale).toBe(options.hide_scale);
  });

  test('should create slider element', () => {
    const options = standardOptions;
    const slider: View = createSlider(options);
    const sliderClass = slider.element.className;

    expect(slider.element).toBeTruthy();
    expect(sliderClass).toBe('slider');
  });

  test('should create two thumbs with standard options', () => {
    const options = standardOptions;
    const slider: View = createSlider(options);
    const thumbs = slider.element.querySelectorAll('.thumb');

    expect(thumbs.length).toBe(2);
    expect(thumbs[0]).toBeVisible();
    expect(thumbs[1]).toBeVisible();
  });

  test('with standard options should create two thumb labels', () => {
    const options = standardOptions;
    const slider: View = createSlider(options);
    const thumbLabels = slider.element.querySelectorAll('.thumb-label');

    expect(thumbLabels.length).toBe(2);
    expect(thumbLabels[0]).toBeVisible();
    expect(thumbLabels[1]).toBeVisible();
  });

  test('with hide_from_to option should hide two thumb labels', () => {
    const options = standardOptions;
    options.hide_from_to = true;
    const slider: View = createSlider(options);
    const thumbLabels = slider.element.querySelectorAll('.thumb-label');

    expect(thumbLabels.length).toBe(2);
    expect(thumbLabels[0]).not.toBeVisible();
    expect(thumbLabels[1]).not.toBeVisible();
  });

  test('should create a track', () => {
    const options = standardOptions;
    const slider: View = createSlider(options);
    const track = slider.element.querySelector('.track');

    expect(track).toBeTruthy();
    expect(track).toBeVisible();
  });

  test('should create a bar', () => {
    const options = standardOptions;
    const slider: View = createSlider(options);
    const bar = slider.element.querySelector('.bar');

    expect(bar).toBeTruthy();
    expect(bar).toBeVisible();
  });

  test('with standard options should create a scale', () => {
    const options = standardOptions;
    const slider: View = createSlider(options);
    const scale = slider.element.querySelector('.scale');

    expect(scale).toBeTruthy();
    expect(scale).toBeVisible();
  });

  test('with hide_scale option should hide a scale', () => {
    const options = standardOptions;
    options.hide_scale = true;
    const slider: View = createSlider(options);
    const scale = slider.element.querySelector('.scale');

    expect(scale).not.toBeVisible();
  });

  test('should swap from and to when from > to', () => {
    const options = standardOptions;
    options.from = 6;
    options.to = 2;
    const slider: View = createSlider(options);

    expect(slider.state.from).toBe(2);
    expect(slider.state.to).toBe(6);
  });

  test('from and to should not be equal', () => {
    const options = standardOptions;
    options.from = 3;
    options.to = 3;
    const slider: View = createSlider(options);

    expect(slider.state.from).toBe(slider.state.to);
  });
});
