import '@testing-library/jest-dom';

import { Options } from '../interfaces/interfaces';
import { Presenter } from './Presenter';

describe('Presenter', () => {
  let anchor: HTMLElement;
  const anchorClassName = 'anchor';
  let presenter: Presenter;
  const options: Options = {
    min: -5,
    max: 10,
    step: 1,
    from: -1,
    to: 0,
    orientation: 'horizontal',
    type: 'double',
    hideFromTo: false,
    hideScale: false,
  };

  beforeEach(() => {
    anchor = document.createElement('div');
    anchor.className = anchorClassName;
    document.body.append(anchor);
    presenter = new Presenter(anchor, options);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('must have an anchor with a given class name', () => {
    expect(presenter.anchor.className).toBe(anchorClassName);
  });

  test('must get the options', () => {
    expect(presenter.getOptions()).toStrictEqual(options);
  });

  test('must set a min option', () => {
    const min = -1000;
    presenter.setOptions({ min });
    expect(presenter.getOptions().min).toBe(min);
  });

  test('must set a max option', () => {
    const max = 1000;
    presenter.setOptions({ max });
    expect(presenter.getOptions().max).toBe(max);
  });

  test('must set a step option', () => {
    const step = 4;
    presenter.setOptions({ step });
    expect(presenter.getOptions().step).toBe(step);
  });

  test('must set an orientation option', () => {
    const orientation = 'vertical';
    presenter.setOptions({ orientation });
    expect(presenter.getOptions().orientation).toBe(orientation);
  });

  test('must set a type option', () => {
    const type = 'single';
    presenter.setOptions({ type });
    expect(presenter.getOptions().type).toBe(type);
  });

  test('must set a hideFromTo option', () => {
    const hideFromTo = true;
    presenter.setOptions({ hideFromTo });
    expect(presenter.getOptions().hideFromTo).toBe(hideFromTo);
  });

  test('must set a hideScale option', () => {
    const hideScale = true;
    presenter.setOptions({ hideScale });
    expect(presenter.getOptions().hideScale).toBe(hideScale);
  });
});
