import { ModelOptions, ModelState } from '../Presenter/Options';
import { EventManager } from '../EventManager/EventManager';

class Model {
  public state: ModelState;

  public events: EventManager;

  constructor(options: ModelOptions) {
    this.events = new EventManager();
    this.state = this.init(options);
  }

  public setState(options: ModelOptions): void {
    const correctedOptions = this.correctOptions(options);
    const values = this.calculateValues(correctedOptions);
    this.state = { ...correctedOptions, values };
  }

  private init(options: ModelOptions): ModelState {
    this.setState(options);
    this.setState = this.setState.bind(this);
    return this.state;
  }

  private correctOptions(options: ModelOptions): ModelOptions {
    const { min, max, step } = options;
    const correctedOptions: ModelOptions = { ...options };

    correctedOptions.step = Math.round(step);

    if (step < 1) {
      correctedOptions.step = 1;
    }

    if (min > max) {
      [correctedOptions.min, correctedOptions.max] = [max, min];
    }

    if (min === max) {
      correctedOptions.max = min + step;
    }

    return correctedOptions;
  }

  private calculateValues(options: ModelOptions): number[] {
    const { min, max, step } = options;
    const values: number[] = [];
    let currVal = min;

    while (currVal < max) {
      values.push(currVal);
      currVal += step;
    }

    values.push(max);
    this.events.notify('values', values);

    return values;
  }
}

export { Model };
