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
      hide_from_to,
      hide_scale,
    } = slider.state;

    expect(orientation).toBe(options.orientation);
    expect(type).toBe(options.type);
    expect(hide_from_to).toBe(options.hide_from_to);
    expect(hide_scale).toBe(options.hide_scale);
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

  test('with hide_from_to option must hide two thumb labels', () => {
    const options = { ...standardOptions };
    options.hide_from_to = true;
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

  test('with hide_scale option must hide a scale', () => {
    const options = { ...standardOptions };
    options.hide_scale = true;
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

  test('setState must change the hide_from_to option', () => {
    const options = { ...standardOptions };
    const slider: View = createSlider(options);
    const thumbLabels = slider.element.querySelectorAll('.slider__thumb-label');

    slider.setState({ hide_from_to: true });
    expect(slider.state.hide_from_to).toBe(true);
    expect(thumbLabels[0]).not.toBeVisible();
    expect(thumbLabels[1]).not.toBeVisible();

    slider.setState({ hide_from_to: true });
    expect(slider.state.hide_from_to).toBe(true);
    expect(thumbLabels[0]).not.toBeVisible();
    expect(thumbLabels[1]).not.toBeVisible();

    slider.setState({ hide_from_to: false });
    expect(slider.state.hide_from_to).toBe(false);
    expect(thumbLabels[0]).toBeVisible();
    expect(thumbLabels[1]).toBeVisible();

    slider.setState({ hide_from_to: true });
    expect(slider.state.hide_from_to).toBe(true);
    expect(thumbLabels[0]).not.toBeVisible();
    expect(thumbLabels[1]).not.toBeVisible();
  });

  test('setState must change the hide_scale option', () => {
    const options = { ...standardOptions };
    const slider: View = createSlider(options);
    const scale = slider.element.querySelector('.slider__scale');

    slider.setState({ hide_scale: true });
    expect(slider.state.hide_scale).toBe(true);
    expect(scale).not.toBeVisible();

    slider.setState({ hide_scale: true });
    expect(slider.state.hide_scale).toBe(true);
    expect(scale).not.toBeVisible();

    slider.setState({ hide_scale: false });
    expect(slider.state.hide_scale).toBe(false);
    expect(scale).toBeVisible();

    slider.setState({ hide_scale: true });
    expect(slider.state.hide_scale).toBe(true);
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
