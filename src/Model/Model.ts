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
    const {
      min, max, step,
    } = options;
    const correctedStep = this.correctStep(step);
    const correctedMinMax = this.correctMinMax(min, max, correctedStep.step);
    const currentOptions = { ...options, ...correctedMinMax, ...correctedStep };
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
    let correctedStep = Math.round(step);

    if (correctedStep < 1) {
      correctedStep = 1;
    }

    return { step: correctedStep };
  }

  private correctFromAndTo(options: ModelOptions): { from: number, to: number } {
    const {
      min, max, step, from, to,
    } = options;
    let correctedFrom: number = Math.round((from - min) / step) * step + min;
    let correctedTo: number = Math.round((to - min) / step) * step + min;

    if (correctedTo < correctedFrom) {
      [correctedTo, correctedFrom] = [correctedFrom, correctedTo];
    }

    if (correctedTo === correctedFrom) {
      if (correctedTo === max) {
        correctedFrom = max - step;
      } else if (correctedFrom === min) {
        correctedTo = min + step;
      } else {
        correctedTo = correctedFrom + step;
      }
    }

    if (correctedTo > max) {
      correctedTo = max;
      if (correctedFrom >= max) {
        correctedFrom = max - step;
        return { from: correctedFrom, to: correctedTo };
      }
    }

    if (correctedFrom < min) {
      correctedFrom = min;
      if (correctedTo <= min) {
        correctedFrom = min + step;
        return { from: correctedFrom, to: correctedTo };
      }
    }

    return { from: correctedFrom, to: correctedTo };
  }
}

export { Model };
