import { ModelOptions } from '../Presenter/Options';
import EventManager from '../EventManager/EventManager';

class Model {
  public state: ModelOptions;

  public events: EventManager;

  constructor(private options: ModelOptions) {
    this.events = new EventManager();
    this.checkOptions();
    this.state = {...options};
    this.state.values = this.calculateValues();
    this.setState = this.setState.bind(this);
  }

  public setState(newState: ModelOptions) {
    this.state = {...this.state, ...newState};
    this.state.values = this.calculateValues();
  }

  private checkOptions(): void {
    const { min, max, step } = this.options;

    if (min > max) {
      [this.options.max, this.options.min] = [min, max];
    }

    if (step <= 0) {
      throw 'Step must be positive number';
    }
  }

  private calculateValues(): number[] {
    const { min, max, step } = this.state;
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

export default Model;
