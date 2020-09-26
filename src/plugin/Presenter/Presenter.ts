import bind from 'bind-decorator';

import { Model } from '../Model/Model';
import { View } from '../View/View/View';
import { Options } from '../interfaces/interfaces';
import { standardOptions } from '../interfaces/constants';
import { Observable } from '../Observable/Observable';

class Presenter {
  public events: Observable;

  private view: View;

  private model: Model;

  constructor(public anchor: HTMLElement, options: Options) {
    this.events = new Observable();
    this.model = this.createModel(options);
    this.view = this.createView(anchor, this.model.state);
    this.addSubscribtions();
  }

  public setOptions(options: Partial<Options>): void {
    const newOptions: Options = { ...standardOptions, ...options };
    this.model.setState(newOptions);
  }

  public getOptions(): Options {
    return this.model.state;
  }

  private createModel(options: Options): Model {
    return new Model(options);
  }

  private createView(anchor: HTMLElement, options: Options): View {
    return new View(anchor, options);
  }

  private addSubscribtions(): void {
    this.model.events.subscribe('newModelState', this.handleNewModelState);
    this.view.events.subscribe('newFromTo', this.handleNewFromTo);
  }

  @bind
  private handleNewModelState(modelState: Options): void {
    this.view.setState(modelState);
    this.events.notify('newModelState', modelState);
  }

  @bind
  private handleNewFromTo(newFromTo: Partial<Options>): void {
    const modelState: Options = this.model.state;
    const newModelState: Options = { ...modelState, ...newFromTo };
    this.model.setState(newModelState);
  }
}

export { Presenter };
