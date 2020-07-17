import '@testing-library/jest-dom';
import { View } from '../src/View/View';
import { ViewOptions } from '../src/Presenter/Options';

describe('Thumb', () => {
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
    const thumbs = slider.querySelectorAll('.thumb');

    expect(thumbs[0]).toBeVisible();
    expect(thumbs[1]).toBeVisible();
  });

  test('if type=single only one thumb must be visible', () => {
    view.setState({ type: 'single' });
    const thumbs = slider.querySelectorAll('.thumb');

    expect(thumbs[0]).toBeVisible();
    expect(thumbs[1]).not.toBeVisible();
  });
});
