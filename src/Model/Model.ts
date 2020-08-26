import { ModelOptions } from '../interfaces/interfaces';
import { EventManager } from '../EventManager/EventManager';

class Model {
  public state: ModelOptions;

  public events: EventManager;

  constructor(options: ModelOptions) {
    this.events = new EventManager();
    this.state = this.init(options);
  }

  public setState(options: ModelOptions): void {
    const correctedOptions: ModelOptions = this.correctOptions(options);
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

    const correctedStep = this.correctStep(step);
    const correctedMinMax = this.correctMinMax(min, max, correctedStep.step);
    const currentOptions: ModelOptions = { ...options, ...correctedMinMax, ...correctedStep };
    const correctedFromTo = this.correctFromAndTo(currentOptions);

    return { ...currentOptions, ...correctedFromTo };
  }

  private correctMinMax(min: number, max: number, step: number): { min: number, max: number } {
    const correctedMinMax = { min, max };

    if (min > max) {
      [correctedMinMax.min, correctedMinMax.max] = [max, min];
    }

    if (min === max) {
      correctedMinMax.max = min + step;
    }

    return correctedMinMax;
  }

  private correctStep(step: number): { step: number } {
    let correctedStep: number = Math.round(step);

    if (correctedStep < 1) {
      correctedStep = 1;
    }

    return { step: correctedStep };
  }

  private correctFromAndTo(options: ModelOptions): { from: number, to: number } {
    const {
      min, max, step, from, to,
    } = options;
    let lastStep: number = (max - min) % step;

    if (lastStep === 0) {
      lastStep = step;
    }

    let correctedFrom: number = correct(from);
    let correctedTo: number = correct(to);

    function correct(num: number): number {
      if (num >= max - lastStep / 2) {
        return max;
      }

      return Math.round((num - min) / step) * step + min;
    }

    const isDouble: boolean = options.type === 'double';
    const isToLessThanFrom: boolean = correctedTo < correctedFrom && isDouble;
    const isToEqualsFrom: boolean = correctedTo === correctedFrom && isDouble;

    if (isToLessThanFrom) {
      [correctedTo, correctedFrom] = [correctedFrom, correctedTo];
    }

    if (isToEqualsFrom) {
      if (correctedTo === max) {
        correctedFrom = max - lastStep;
      } else {
        correctedTo = correctedFrom === min
          ? min + step
          : correctedFrom + step;
      }
    }

    if (correctedFrom < min) {
      correctedFrom = min;
      if (correctedTo <= min) {
        correctedTo = min + step;
        return { from: correctedFrom, to: correctedTo };
      }
    }

    return { from: correctedFrom, to: correctedTo };
  }
}

export { Model };
