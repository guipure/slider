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
    const track = slider.querySelector('.track') as HTMLElement;

    expect(track).toBeVisible();
  });

  test('must dispatch an event when clicked', () => {
    const checkTrackClick = jest.fn();
    slider.addEventListener('trackclick', checkTrackClick);
    const track = slider.querySelector('.track') as HTMLElement;
    track.click();

    expect(checkTrackClick.mock.calls.length).toBe(1);

    track.click();
    expect(checkTrackClick.mock.calls.length).toBe(2);
  });
});
