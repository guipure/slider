import '@testing-library/jest-dom';
import { Options } from '../src/Presenter/Options';
import { Settings } from '../src/View/Settings';

describe('Thumb', () => {
  let settings: Settings;
  let anchor: HTMLElement;
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
    document.body.append(anchor);
    settings = new Settings(anchor, options);
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
    const anotherSettings = new Settings(anchor, anotherOptions);
    expect(anotherSettings.state).toStrictEqual(anotherOptions);
  });

  test('must change the min value', () => {
    const minInput = anchor.querySelector('input[name=min]') as HTMLInputElement;
    minInput.value = '5';
    minInput.dispatchEvent(new InputEvent('change'));

    expect(settings.state.min).toBe(5);
  });

  test('if given min is greater than max, must change max', () => {
    const minInput = anchor.querySelector('input[name=min]') as HTMLInputElement;
    minInput.value = '500';
    minInput.dispatchEvent(new InputEvent('change'));

    expect(settings.state.max).toBe(500);
  });

  test('must change the max value', () => {
    const maxInput = anchor.querySelector('input[name=max]') as HTMLInputElement;
    maxInput.value = '100';
    maxInput.dispatchEvent(new InputEvent('change'));

    expect(settings.state.max).toBe(100);
  });

  test('if given max is less than min, must change min', () => {
    const maxInput = anchor.querySelector('input[name=max]') as HTMLInputElement;
    maxInput.value = '-500';
    maxInput.dispatchEvent(new InputEvent('change'));

    expect(settings.state.min).toBe(-500);
  });

  test('must change the step', () => {
    const stepInput = anchor.querySelector('input[name=step]') as HTMLInputElement;
    stepInput.value = '5';
    stepInput.dispatchEvent(new InputEvent('change'));

    expect(settings.state.step).toBe(5);
  });

  test('must not change the step to zero or less', () => {
    const stepInput: HTMLInputElement = anchor.querySelector('input[name=step]') as HTMLInputElement;
    const currentStep = settings.state.step;
    stepInput.value = '0';
    stepInput.dispatchEvent(new InputEvent('change'));

    expect(settings.state.step).toBe(currentStep);

    stepInput.value = '-1';
    stepInput.dispatchEvent(new InputEvent('change'));

    expect(settings.state.step).toBe(currentStep);
  });

  test('must change the from value', () => {
    const fromInput = anchor.querySelector('input[name=from]') as HTMLInputElement;
    fromInput.value = '-2';
    fromInput.dispatchEvent(new InputEvent('change'));

    expect(settings.state.from).toBe(-2);
  });

  test('must change the to value', () => {
    const toInput = anchor.querySelector('input[name=to]') as HTMLInputElement;
    toInput.value = '7';
    toInput.dispatchEvent(new InputEvent('change'));

    expect(settings.state.to).toBe(7);
  });

  test('must change the slider orientation', () => {
    const verticalRadioBtn = anchor.querySelector('input[value=vertical]') as HTMLInputElement;
    const horizontalRadioBtn = anchor.querySelector('input[value=horizontal]') as HTMLInputElement;
    verticalRadioBtn.dispatchEvent(new InputEvent('change'));
    expect(settings.state.orientation).toBe('vertical');
    horizontalRadioBtn.dispatchEvent(new InputEvent('change'));
    expect(settings.state.orientation).toBe('horizontal');
  });

  test('must change the slider type', () => {
    const singleRadioBtn = anchor.querySelector('input[value=single]') as HTMLInputElement;
    const doubleRadioBtn = anchor.querySelector('input[value=double]') as HTMLInputElement;
    singleRadioBtn.dispatchEvent(new InputEvent('change'));
    expect(settings.state.type).toBe('single');
    doubleRadioBtn.dispatchEvent(new InputEvent('change'));
    expect(settings.state.type).toBe('double');
  });

  test('must change the hideScale option', () => {
    const hideScaleTrueBtn = anchor.querySelector('input[name=hideScale][value=true]') as HTMLInputElement;
    const hideScaleFalseBtn = anchor.querySelector('input[name=hideScale][value=false]') as HTMLInputElement;
    hideScaleTrueBtn.dispatchEvent(new InputEvent('change'));
    expect(settings.state.hideScale).toBe(true);
    hideScaleFalseBtn.dispatchEvent(new InputEvent('change'));
    expect(settings.state.hideScale).toBe(false);
  });

  test('must change the hideFromTo option', () => {
    const hideFromToTrueBtn = anchor.querySelector('input[name=hideFromTo][value=true]') as HTMLInputElement;
    const hideFromToFalseBtn = anchor.querySelector('input[name=hideFromTo][value=false]') as HTMLInputElement;
    hideFromToTrueBtn.dispatchEvent(new InputEvent('change'));
    expect(settings.state.hideFromTo).toBe(true);
    hideFromToFalseBtn.dispatchEvent(new InputEvent('change'));
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
