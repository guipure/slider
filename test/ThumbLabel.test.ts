import '@testing-library/jest-dom';
import { View } from '../src/View/View';
import { ViewOptions } from '../src/Presenter/Options';

describe('ThumbLabel', () => {
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

  test('must be visible', () => {
    const thumbLabels = slider.querySelectorAll('.thumb-label');

    expect(thumbLabels[0]).toBeVisible();
    expect(thumbLabels[1]).toBeVisible();
  });

  test('must be not visible if hide_from_to=true', () => {
    view.setState({ hide_from_to: true });
    const thumbLabels = slider.querySelectorAll('.thumb-label');

    expect(thumbLabels[0]).not.toBeVisible();
    expect(thumbLabels[1]).not.toBeVisible();
  });

  test('if type=single only one thumb must be visible', () => {
    view.setState({ type: 'single' });
    const thumbLabels = slider.querySelectorAll('.thumb-label');

    expect(thumbLabels[0]).toBeVisible();
    expect(thumbLabels[1]).not.toBeVisible();
  });

  test('label value must be equal to from/to value', () => {
    const thumbLabels = slider.querySelectorAll('.thumb-label');

    expect(Number(thumbLabels[0].innerHTML)).toBe(view.state.from);
    expect(Number(thumbLabels[1].innerHTML)).toBe(view.state.to);
  });
});
