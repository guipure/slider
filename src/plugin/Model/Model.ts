import bind from 'bind-decorator';

import { ModelOptions } from '../interfaces/interfaces';
import { Observable } from '../Observable/Observable';

class Model {
  public state: ModelOptions;

  public events: Observable;

  constructor(options: ModelOptions) {
    this.events = new Observable();
    this.state = this.init(options);
  }

  @bind
  public setState(options: ModelOptions): void {
    const correctedOptions: ModelOptions = this.correctOptions(options);
    this.state = { ...correctedOptions };

    this.events.notify('newModelState', this.state);
  }

  private init(options: ModelOptions): ModelOptions {
    this.setState(options);
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

    min > max
      && ([correctedMinMax.min, correctedMinMax.max] = [max, min]);

    min === max
      && (correctedMinMax.max = min + step);

    return correctedMinMax;
  }

  private correctStep(step: number): { step: number } {
    let correctedStep = Math.round(step);

    correctedStep < 1 && (correctedStep = 1);

    return { step: correctedStep };
  }

  private correctFromAndTo(options: ModelOptions): { from: number, to: number } {
    const {
      min,
      max,
      step,
      from,
      to,
    } = options;
    let lastStep = (max - min) % step;

    lastStep === 0 && (lastStep = step);

    let correctedFrom: number = correct(from);
    let correctedTo: number = correct(to);

    function correct(num: number): number {
      const isNumGreaterThanMax = num >= max - lastStep / 2;
      if (isNumGreaterThanMax) return max;

      return Math.round((num - min) / step) * step + min;
    }

    const isDouble = options.type === 'double';
    const isToLessThanFrom = correctedTo < correctedFrom && isDouble;
    const isToEqualsFrom = correctedTo === correctedFrom && isDouble;

    isToLessThanFrom
      && ([correctedTo, correctedFrom] = [correctedFrom, correctedTo]);

    if (isToEqualsFrom) {
      if (correctedTo === max) (correctedFrom = max - lastStep);
      else {
        if (this.state) {
          return { from: this.state.from, to: this.state.to };
        }

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
