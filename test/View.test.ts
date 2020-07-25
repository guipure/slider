import '@testing-library/jest-dom';

import { View } from '../src/View/View';
import { ViewOptions } from '../src/interfaces/options';

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

beforeEach(() => {
  const anchor: HTMLElement = document.createElement('div');
  anchor.className = 'anchor';
  document.body.append(anchor);
});
afterEach(() => {
  document.body.innerHTML = '';
});

describe('View', () => {
  test('must create a slider with given options', () => {
    const options = { ...standardOptions };
    const slider: View = createSlider(options);
    const {
      orientation,
      type,
      hideFromTo,
      hideScale,
    } = slider.state;

    expect(orientation).toBe(options.orientation);
    expect(type).toBe(options.type);
    expect(hideFromTo).toBe(options.hideFromTo);
    expect(hideScale).toBe(options.hideScale);
  });

  test('must create slider element', () => {
    const options = { ...standardOptions };
    const slider: View = createSlider(options);
    const sliderClass = slider.element.className;

    expect(slider.element).toBeTruthy();
    expect(sliderClass).toBe('slider');
  });

  test('must create two thumbs with standard options', () => {
    const options = { ...standardOptions };
    const slider: View = createSlider(options);
    const thumbs = slider.element.querySelectorAll('.slider__thumb');

    expect(thumbs.length).toBe(2);
    expect(thumbs[0]).toBeVisible();
    expect(thumbs[1]).toBeVisible();
  });

  test('with standard options must create two thumb labels', () => {
    const options = { ...standardOptions };
    const slider: View = createSlider(options);
    const thumbLabels = slider.element.querySelectorAll('.slider__thumb-label');

    expect(thumbLabels.length).toBe(2);
    expect(thumbLabels[0]).toBeVisible();
    expect(thumbLabels[1]).toBeVisible();
  });

  test('with hideFromTo option must hide two thumb labels', () => {
    const options = { ...standardOptions };
    options.hideFromTo = true;
    const slider: View = createSlider(options);
    const thumbLabels = slider.element.querySelectorAll('.slider__thumb-label');

    expect(thumbLabels.length).toBe(2);
    expect(thumbLabels[0]).not.toBeVisible();
    expect(thumbLabels[1]).not.toBeVisible();
  });

  test('must create a track', () => {
    const options = { ...standardOptions };
    const slider: View = createSlider(options);
    const track = slider.element.querySelector('.slider__track');

    expect(track).toBeTruthy();
    expect(track).toBeVisible();
  });

  test('must create a bar', () => {
    const options = { ...standardOptions };
    const slider: View = createSlider(options);
    const bar = slider.element.querySelector('.slider__bar');

    expect(bar).toBeTruthy();
    expect(bar).toBeVisible();
  });

  test('with standard options must create a scale', () => {
    const options = { ...standardOptions };
    const slider: View = createSlider(options);
    const scale = slider.element.querySelector('.slider__scale');

    expect(scale).toBeTruthy();
    expect(scale).toBeVisible();
  });

  test('with hideScale option must hide a scale', () => {
    const options = { ...standardOptions };
    options.hideScale = true;
    const slider: View = createSlider(options);
    const scale = slider.element.querySelector('.slider__scale');

    expect(scale).not.toBeVisible();
  });

  test('setState must change the orientation', () => {
    const options = { ...standardOptions };
    const slider: View = createSlider(options);

    slider.setState({ orientation: 'vertical' });
    expect(slider.state.orientation).toBe('vertical');

    slider.setState({ orientation: 'vertical' });
    expect(slider.state.orientation).toBe('vertical');

    slider.setState({ orientation: 'horizontal' });
    expect(slider.state.orientation).toBe('horizontal');

    slider.setState({ orientation: 'vertical' });
    expect(slider.state.orientation).toBe('vertical');
  });

  test('setState must change the type', () => {
    const options = { ...standardOptions };
    const slider: View = createSlider(options);

    slider.setState({ type: 'single' });
    expect(slider.state.type).toBe('single');

    slider.setState({ type: 'single' });
    expect(slider.state.type).toBe('single');

    slider.setState({ type: 'double' });
    expect(slider.state.type).toBe('double');

    slider.setState({ type: 'single' });
    expect(slider.state.type).toBe('single');
  });

  test('setState must change the hideFromTo option', () => {
    const options = { ...standardOptions };
    const slider: View = createSlider(options);
    const thumbLabels = slider.element.querySelectorAll('.slider__thumb-label');

    slider.setState({ hideFromTo: true });
    expect(slider.state.hideFromTo).toBe(true);
    expect(thumbLabels[0]).not.toBeVisible();
    expect(thumbLabels[1]).not.toBeVisible();

    slider.setState({ hideFromTo: true });
    expect(slider.state.hideFromTo).toBe(true);
    expect(thumbLabels[0]).not.toBeVisible();
    expect(thumbLabels[1]).not.toBeVisible();

    slider.setState({ hideFromTo: false });
    expect(slider.state.hideFromTo).toBe(false);
    expect(thumbLabels[0]).toBeVisible();
    expect(thumbLabels[1]).toBeVisible();

    slider.setState({ hideFromTo: true });
    expect(slider.state.hideFromTo).toBe(true);
    expect(thumbLabels[0]).not.toBeVisible();
    expect(thumbLabels[1]).not.toBeVisible();
  });

  test('setState must change the hideScale option', () => {
    const options = { ...standardOptions };
    const slider: View = createSlider(options);
    const scale = slider.element.querySelector('.slider__scale');

    slider.setState({ hideScale: true });
    expect(slider.state.hideScale).toBe(true);
    expect(scale).not.toBeVisible();

    slider.setState({ hideScale: true });
    expect(slider.state.hideScale).toBe(true);
    expect(scale).not.toBeVisible();

    slider.setState({ hideScale: false });
    expect(slider.state.hideScale).toBe(false);
    expect(scale).toBeVisible();

    slider.setState({ hideScale: true });
    expect(slider.state.hideScale).toBe(true);
    expect(scale).not.toBeVisible();
  });

  test('setState must change the from option', () => {
    const options = { ...standardOptions };
    const slider: View = createSlider(options);

    slider.setState({ from: 0 });
    expect(slider.state.from).toBe(0);

    slider.setState({ from: -2 });
    expect(slider.state.from).toBe(-2);

    slider.setState({ from: 5 });
    expect(slider.state.from).toBe(5);
  });

  test('setState must change the to option', () => {
    const options = { ...standardOptions };
    const slider: View = createSlider(options);

    slider.setState({ to: 0 });
    expect(slider.state.to).toBe(0);

    slider.setState({ to: 2 });
    expect(slider.state.to).toBe(2);

    slider.setState({ to: 5 });
    expect(slider.state.to).toBe(5);
  });

  test('thumb move must call getThumbsPosition method', () => {
    const options = { ...standardOptions };
    const slider: View = createSlider(options);
    const spy = jest.spyOn(slider, 'getThumbsPositions');
    const thumb = slider.element.querySelector('.slider__thumb') as HTMLElement;
    thumb.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    document.dispatchEvent(new MouseEvent('mousemove'));
    document.dispatchEvent(new MouseEvent('mouseup'));

    expect(spy).toBeCalled();
  });
});
