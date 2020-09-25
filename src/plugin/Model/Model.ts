import bind from 'bind-decorator';

import { Options } from '../interfaces/interfaces';
import { Observable } from '../Observable/Observable';

class Model {
  public state: Options;

  public events: Observable;

  constructor(options: Options) {
    this.events = new Observable();
    this.state = this.init(options);
  }

  @bind
  public setState(options: Options): void {
    const correctedOptions: Options = this.correctOptions(options);
    this.state = { ...correctedOptions };

    this.events.notify('newModelState', this.state);
  }

  private init(options: Options): Options {
    this.setState(options);
    return this.state;
  }

  private correctOptions(options: Options): Options {
    const { min, max, step } = options;

    const correctedStep = this.correctStep(step);
    const correctedMinMax = this.correctMinMax(min, max, correctedStep.step);
    const currentOptions: Options = { ...options, ...correctedMinMax, ...correctedStep };
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

  private correctFromAndTo(options: Options): { from: number, to: number } {
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

    const realStep = max - min < step ? max - min : step;

    if (isToEqualsFrom) {
      if (correctedTo === max) {
        correctedFrom = max - lastStep;
      } else {
        correctedTo = correctedFrom === min
          ? min + realStep
          : correctedFrom + realStep;
      }
    }

    if (correctedFrom < min) {
      correctedFrom = min;
      if (correctedTo <= min) {
        correctedTo = min + realStep;
        return { from: correctedFrom, to: correctedTo };
      }
    }

    return { from: correctedFrom, to: correctedTo };
  }
}

export { Model };
