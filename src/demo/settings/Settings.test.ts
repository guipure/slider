import '@testing-library/jest-dom';

import { Options } from '../../plugin/interfaces/interfaces';
import { Settings } from './Settings';
import { Presenter } from '../../plugin/Presenter/Presenter';

describe('Settings', () => {
  let settings: Settings;
  let anchor: HTMLElement;
  let form: HTMLFormElement;
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
    anchor.className = 'anchor';

    const demo = document.createElement('main');
    demo.classList.add('demo', 'js-demo');

    document.body.append(demo);
    demo.append(anchor);

    const presenter = new Presenter(anchor, options);
    settings = new Settings(presenter);

    form = anchor.nextSibling
      ? anchor.nextSibling as HTMLFormElement
      : document.createElement('form');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('must initialize settings with standard options', () => {
    expect(settings.state).toStrictEqual(options);
  });

  test('must initialize settings with another options', () => {
    const anotherOptions: Options = {
      ...options,
      orientation: 'vertical',
      type: 'single',
      hideFromTo: true,
      hideScale: true,
    };
    const anotherPresenter: Presenter = new Presenter(anchor, anotherOptions);
    const anotherSettings: Settings = new Settings(anotherPresenter);
    expect(anotherSettings.state).toStrictEqual(anotherOptions);
  });

  test('must change the min value', () => {
    const minInput = form.querySelector('input[name=min]') as HTMLInputElement;
    minInput.value = '5';
    minInput.dispatchEvent(new InputEvent('change'));

    expect(settings.state.min).toBe(5);
  });

  test('if given min is greater than max, must change max', () => {
    const minInput = form.querySelector('input[name=min]') as HTMLInputElement;
    minInput.value = '500';
    minInput.dispatchEvent(new InputEvent('change'));

    expect(settings.state.max).toBe(500);
  });

  test('must change the max value', () => {
    const maxInput = form.querySelector('input[name=max]') as HTMLInputElement;
    maxInput.value = '100';
    maxInput.dispatchEvent(new InputEvent('change'));

    expect(settings.state.max).toBe(100);
  });

  test('if given max is less than min, must change min', () => {
    const maxInput = form.querySelector('input[name=max]') as HTMLInputElement;
    maxInput.value = '-500';
    maxInput.dispatchEvent(new InputEvent('change'));

    expect(settings.state.min).toBe(-500);
  });

  test('must change the step', () => {
    const stepInput = form.querySelector('input[name=step]') as HTMLInputElement;
    stepInput.value = '5';
    stepInput.dispatchEvent(new InputEvent('change'));

    expect(settings.state.step).toBe(5);
  });

  test('must not change the step to zero or less', () => {
    const stepInput: HTMLInputElement = form.querySelector('input[name=step]') as HTMLInputElement;
    const currentStep = settings.state.step;
    stepInput.value = '0';
    stepInput.dispatchEvent(new InputEvent('change'));

    expect(settings.state.step).toBe(currentStep);

    stepInput.value = '-1';
    stepInput.dispatchEvent(new InputEvent('change'));

    expect(settings.state.step).toBe(currentStep);
  });

  test('must change the from value', () => {
    const fromInput = form.querySelector('input[name=from]') as HTMLInputElement;
    fromInput.value = '-2';
    fromInput.dispatchEvent(new InputEvent('change'));

    expect(settings.state.from).toBe(-2);
  });

  test('must change the to value', () => {
    const toInput = form.querySelector('input[name=to]') as HTMLInputElement;
    toInput.value = '7';
    toInput.dispatchEvent(new InputEvent('change'));

    expect(settings.state.to).toBe(7);
  });

  test('must change the slider orientation', () => {
    const verticalRadioBtn = form.querySelector('input[value=vertical]') as HTMLInputElement;
    const horizontalRadioBtn = form.querySelector('input[value=horizontal]') as HTMLInputElement;
    verticalRadioBtn.dispatchEvent(new InputEvent('change'));
    expect(settings.state.orientation).toBe('vertical');
    horizontalRadioBtn.dispatchEvent(new InputEvent('change'));
    expect(settings.state.orientation).toBe('horizontal');
  });

  test('must change the slider type', () => {
    const singleRadioBtn = form.querySelector('input[value=single]') as HTMLInputElement;
    const doubleRadioBtn = form.querySelector('input[value=double]') as HTMLInputElement;
    singleRadioBtn.dispatchEvent(new InputEvent('change'));
    expect(settings.state.type).toBe('single');
    doubleRadioBtn.dispatchEvent(new InputEvent('change'));
    expect(settings.state.type).toBe('double');
  });

  test('must change the hideScale option', () => {
    const hideScaleCheckbox = form.querySelector('input[name=hideScale]') as HTMLInputElement;

    hideScaleCheckbox.checked = true;
    hideScaleCheckbox.dispatchEvent(new InputEvent('change'));
    expect(settings.state.hideScale).toBe(true);

    hideScaleCheckbox.checked = false;
    hideScaleCheckbox.dispatchEvent(new InputEvent('change'));
    expect(settings.state.hideScale).toBe(false);
  });

  test('must change the hideFromTo option', () => {
    const hideFromToCheckbox = form.querySelector('input[name=hideFromTo]') as HTMLInputElement;

    hideFromToCheckbox.checked = true;
    hideFromToCheckbox.dispatchEvent(new InputEvent('change'));
    expect(settings.state.hideFromTo).toBe(true);

    hideFromToCheckbox.checked = false;
    hideFromToCheckbox.dispatchEvent(new InputEvent('change'));
    expect(settings.state.hideFromTo).toBe(false);
  });

  test('updateFromTo method must update the settings', () => {
    settings.updateFromTo({ from: -5 });
    expect(settings.state.from).toBe(-5);

    settings.updateFromTo({ to: 8 });
    expect(settings.state.to).toBe(8);

    settings.updateFromTo({ from: -4, to: 4 });
    expect(settings.state.to).toBe(4);
    expect(settings.state.from).toBe(-4);
  });
});
