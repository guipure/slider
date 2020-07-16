import '@testing-library/jest-dom';
import { View } from '../src/View/View';
import { ViewOptions } from '../src/Presenter/Options';

describe('Track', () => {
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
    const bar = slider.querySelector('.bar') as HTMLElement;

    expect(bar).toBeVisible();
  });

  test('must dispatch an event when clicked', () => {
    const checkBarClick = jest.fn();
    slider.addEventListener('trackclick', checkBarClick);
    const bar = slider.querySelector('.bar') as HTMLElement;
    bar.click();

    expect(checkBarClick.mock.calls.length).toBe(1);

    bar.click();
    expect(checkBarClick.mock.calls.length).toBe(2);
  });
});
