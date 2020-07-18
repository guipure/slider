import { ModelOptions } from '../Presenter/Options';
import { EventManager } from '../EventManager/EventManager';

class Model {
  public state: ModelOptions;

  public events: EventManager;

  constructor(options: ModelOptions) {
    this.events = new EventManager();
    this.state = this.init(options);
  }

  public setState(options: ModelOptions): void {
    const correctedOptions = this.correctOptions(options);
    this.state = { ...correctedOptions };
    this.events.notify('newModelState', this.state);
  }

  private init(options: ModelOptions): ModelOptions {
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
}

export { Model };
