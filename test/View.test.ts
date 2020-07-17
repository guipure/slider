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
  test('must create a slider with given options', () => {
    const options = { ...standardOptions };
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
    const thumbs = slider.element.querySelectorAll('.thumb');

    expect(thumbs.length).toBe(2);
    expect(thumbs[0]).toBeVisible();
    expect(thumbs[1]).toBeVisible();
  });

  test('with standard options must create two thumb labels', () => {
    const options = { ...standardOptions };
    const slider: View = createSlider(options);
    const thumbLabels = slider.element.querySelectorAll('.thumb-label');

    expect(thumbLabels.length).toBe(2);
    expect(thumbLabels[0]).toBeVisible();
    expect(thumbLabels[1]).toBeVisible();
  });

  test('with hide_from_to option must hide two thumb labels', () => {
    const options = { ...standardOptions };
    options.hide_from_to = true;
    const slider: View = createSlider(options);
    const thumbLabels = slider.element.querySelectorAll('.thumb-label');

    expect(thumbLabels.length).toBe(2);
    expect(thumbLabels[0]).not.toBeVisible();
    expect(thumbLabels[1]).not.toBeVisible();
  });

  test('must create a track', () => {
    const options = { ...standardOptions };
    const slider: View = createSlider(options);
    const track = slider.element.querySelector('.track');

    expect(track).toBeTruthy();
    expect(track).toBeVisible();
  });

  test('must create a bar', () => {
    const options = { ...standardOptions };
    const slider: View = createSlider(options);
    const bar = slider.element.querySelector('.bar');

    expect(bar).toBeTruthy();
    expect(bar).toBeVisible();
  });

  test('with standard options must create a scale', () => {
    const options = { ...standardOptions };
    const slider: View = createSlider(options);
    const scale = slider.element.querySelector('.scale');

    expect(scale).toBeTruthy();
    expect(scale).toBeVisible();
  });

  test('with hide_scale option must hide a scale', () => {
    const options = { ...standardOptions };
    options.hide_scale = true;
    const slider: View = createSlider(options);
    const scale = slider.element.querySelector('.scale');

    expect(scale).not.toBeVisible();
  });

  test('must swap from and to when from > to', () => {
    const options = { ...standardOptions };
    options.from = 6;
    options.to = 2;
    const slider: View = createSlider(options);

    expect(slider.state.from).toBe(2);
    expect(slider.state.to).toBe(6);
  });

  test('from and to must not be equal', () => {
    const options = { ...standardOptions };
    options.from = 3;
    options.to = 3;
    const slider: View = createSlider(options);

    expect(slider.state.from).not.toBe(slider.state.to);
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
    const thumbLabels = slider.element.querySelectorAll('.thumb-label');

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
    const scale = slider.element.querySelector('.scale');

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

  test('setState must swap from and to when from > to', () => {
    const options = { ...standardOptions };
    const slider: View = createSlider(options);

    slider.setState({ from: 2, to: 0 });
    expect(slider.state.from).toBe(0);
    expect(slider.state.to).toBe(2);

    slider.setState({ from: -1, to: -2 });
    expect(slider.state.from).toBe(-2);
    expect(slider.state.to).toBe(-1);

    slider.setState({ from: 5, to: 4 });
    expect(slider.state.from).toBe(4);
    expect(slider.state.to).toBe(5);
  });

  test('setState must change from or to when from = to != boundary values', () => {
    const options = { ...standardOptions };
    const slider: View = createSlider(options);

    slider.setState({ from: 2, to: 2 });
    expect(slider.state.from).toBe(2);
    expect(slider.state.to).toBe(3);
  });

  test('setState must increase to when from = to = min', () => {
    const options = { ...standardOptions };
    const slider: View = createSlider(options);

    slider.setState({ from: -2, to: -2 });
    expect(slider.state.from).toBe(-2);
    expect(slider.state.to).toBe(-1);
  });

  test('setState must reduce from when from = to = max', () => {
    const options = { ...standardOptions };
    const slider: View = createSlider(options);

    slider.setState({ from: 8, to: 8 });
    expect(slider.state.from).toBe(7);
    expect(slider.state.to).toBe(8);
  });

  test('must convert values [0, 1, 2] to pxValues [0, 100, 200] if anchor width = 200px', () => {
    const options = { ...standardOptions };
    const anchor: HTMLElement = document.createElement('div');
    anchor.className = 'anchor';
    document.body.append(anchor);
    const values: number[] = [0, 1, 2];
    const slider: View = new View(anchor, options, values);
    slider.element.getBoundingClientRect = jest.fn(() => ({
      x: 0,
      y: 0,
      width: 200,
      height: 50,
      top: 0,
      right: 200,
      bottom: 50,
      left: 0,
      toJSON: () => null,
    }));
    slider.setState({ values });
    expect(slider.state.pxValues).toStrictEqual([0, 100, 200]);

    slider.setState({ values: [-2, 0, 2, 4, 6] });
    expect(slider.state.pxValues).toStrictEqual([0, 50, 100, 150, 200]);
  });

  test('thumb move must call getThumbsPosition method', () => {
    const options = { ...standardOptions };
    const slider: View = createSlider(options);
    const spy = jest.spyOn(slider, 'getThumbsPositions');
    const thumb = slider.element.querySelector('.thumb') as HTMLElement;
    thumb.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    document.dispatchEvent(new MouseEvent('mousemove'));
    document.dispatchEvent(new MouseEvent('mouseup'));

    expect(spy).toBeCalled();
  });
});
