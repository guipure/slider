import { ModelOptions } from '../Presenter/Options';

class Model {
  private values: number[];

  constructor(private options: ModelOptions) {
    this.checkOptions()
    this.values = this.calculateValues();
    console.log(this.values);
  }

  private checkOptions(): void {
    const { min, max, step } = this.options;

    if (min > max) {
      [this.options.max, this.options.min] = [min, max];
    }

    if (step <= 0) {
      throw 'Step must be positive number'
    }
  }

  private calculateValues(): number[] {
    const { min, max, step } = this.options;
    let values: number[] = [];
    let currVal = min;

    while (currVal < max) {
      values.push(currVal);
      currVal += step;
    }

    values.push(max);

    return values;
  }
}

export default Model;
