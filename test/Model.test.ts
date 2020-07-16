import { Model } from '../src/Model/Model';
import { ModelOptions } from '../src/Presenter/Options';

const defaultOptions: ModelOptions = {
  min: -5,
  max: 10,
  step: 1,
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
      min: 10,
      max: 10,
      step: 0,
    };
    const model = new Model(badOptions);
    expect(model.state.step).toBe(1);
  });

  test('must correct a step equals -5', () => {
    const badOptions: ModelOptions = {
      min: 10,
      max: 10,
      step: -5,
    };
    const model = new Model(badOptions);
    expect(model.state.step).toBe(1);
  });

  test('must correct a step equals -100', () => {
    const badOptions: ModelOptions = {
      min: 10,
      max: 10,
      step: -100,
    };
    const model = new Model(badOptions);
    expect(model.state.step).toBe(1);
  });

  test('must correct a step equals -0.01', () => {
    const badOptions: ModelOptions = {
      min: 10,
      max: 10,
      step: -0.01,
    };
    const model = new Model(badOptions);
    expect(model.state.step).toBe(1);
  });

  test('must create a correct values from -3 to 5 with step=1', () => {
    const options: ModelOptions = {
      min: -3,
      max: 5,
      step: 1,
    };
    const correctValues = [-3, -2, -1, 0, 1, 2, 3, 4, 5];
    const model = new Model(options);
    expect(model.state.values).toEqual(correctValues);
  });

  test('must create a correct values from -1 to 2 with step=0.5', () => {
    const options: ModelOptions = {
      min: -1,
      max: 2,
      step: 0.5,
    };
    const correctValues = [-1, -0.5, 0, 0.5, 1, 1.5, 2];
    const model = new Model(options);
    expect(model.state.values).toEqual(correctValues);
  });
});
