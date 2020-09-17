import { Model } from './Model';
import { ModelOptions } from '../interfaces/interfaces';

const defaultOptions: ModelOptions = {
  min: -5,
  max: 10,
  step: 1,
  from: -2,
  to: 5,
  type: 'double',
};

describe('Model', () => {
  test('must be initialized', () => {
    const model: Model = new Model(defaultOptions);
    expect(model.state.min).toBe(defaultOptions.min);
    expect(model.state.max).toBe(defaultOptions.max);
    expect(model.state.step).toBe(defaultOptions.step);
  });

  test('must swap min=10 and max=9', () => {
    const badOptions: ModelOptions = {
      ...defaultOptions,
      min: 10,
      max: 9,
      step: 1,
    };
    const model = new Model(badOptions);
    expect(model.state.min).toBe(badOptions.max);
    expect(model.state.max).toBe(badOptions.min);
  });

  test('must swap min=10 and max=-11', () => {
    const badOptions: ModelOptions = {
      ...defaultOptions,
      min: 10,
      max: -11,
      step: 1,
    };
    const model = new Model(badOptions);
    expect(model.state.min).toBe(badOptions.max);
    expect(model.state.max).toBe(badOptions.min);
  });

  test('must swap min=-10 and max=-11', () => {
    const badOptions: ModelOptions = {
      ...defaultOptions,
      min: -10,
      max: -11,
      step: 1,
    };
    const model = new Model(badOptions);
    expect(model.state.min).toBe(badOptions.max);
    expect(model.state.max).toBe(badOptions.min);
  });

  test('must correct max=min=10 and increase max by step', () => {
    const badOptions: ModelOptions = {
      ...defaultOptions,
      min: 10,
      max: 10,
      step: 1,
    };
    const model = new Model(badOptions);
    expect(model.state.min).toBe(badOptions.min);
    expect(model.state.max).toBe(badOptions.min + model.state.step);
  });

  test('must correct a zero step', () => {
    const badOptions: ModelOptions = {
      ...defaultOptions,
      min: 10,
      max: 10,
      step: 0,
    };
    const model = new Model(badOptions);
    expect(model.state.step).toBe(1);
  });

  test('must correct a step equals -5', () => {
    const badOptions: ModelOptions = {
      ...defaultOptions,
      min: 10,
      max: 10,
      step: -5,
    };
    const model = new Model(badOptions);
    expect(model.state.step).toBe(1);
  });

  test('must correct a step equals -100', () => {
    const badOptions: ModelOptions = {
      ...defaultOptions,
      min: 10,
      max: 10,
      step: -100,
    };
    const model = new Model(badOptions);
    expect(model.state.step).toBe(1);
  });

  test('must correct a step equals -0.01', () => {
    const badOptions: ModelOptions = {
      ...defaultOptions,
      min: 10,
      max: 10,
      step: -0.01,
    };
    const model = new Model(badOptions);
    expect(model.state.step).toBe(1);
  });

  test('must swap from=5 and to=4', () => {
    const badOptions: ModelOptions = {
      ...defaultOptions,
      from: 5,
      to: 4,
    };
    const model = new Model(badOptions);
    expect(model.state.to).toBe(badOptions.from);
    expect(model.state.from).toBe(badOptions.to);
  });

  test('must correct from=to=5!=max(min) and increase "to" by step', () => {
    const from = 5;
    const to = from;
    const step = 2;
    const badOptions: ModelOptions = {
      ...defaultOptions,
      from,
      to,
      step,
    };
    const model = new Model(badOptions);
    expect(model.state.to).toBe(to + step);
    expect(model.state.from).toBe(from);
  });

  test('must correct from=to=10=max and decrease "from" by last step', () => {
    const max = 10;
    const from = max;
    const to = max;
    const step = 2;
    const badOptions: ModelOptions = {
      ...defaultOptions,
      from,
      to,
      step,
      max,
    };
    const { min } = badOptions;
    const lastStep = (max - min) % step ? (max - min) % step : step;
    const model = new Model(badOptions);
    expect(model.state.to).toBe(to);
    expect(model.state.from).toBe(from - lastStep);
  });

  test('must correct from=to=-50<min', () => {
    const min = -5;
    const from = -60;
    const to = from;
    const step = 2;
    const badOptions: ModelOptions = {
      ...defaultOptions,
      from,
      to,
      step,
      min,
    };
    const model = new Model(badOptions);
    expect(model.state.to).toBe(min + step);
    expect(model.state.from).toBe(min);
  });

  test('must correct from=to=max on one-step slider', () => {
    const min = -5;
    const max = 5;
    const step = 15;
    const from = 5;
    const to = from;
    const badOptions: ModelOptions = {
      ...defaultOptions,
      from,
      to,
      step,
      min,
      max,
    };
    const model = new Model(badOptions);
    expect(model.state.to).toBe(max);
    expect(model.state.from).toBe(min);
  });
});
