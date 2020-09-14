import bind from 'bind-decorator';

import { Model } from '../Model/Model';
import { View } from '../View/View/View';
import {
  Options,
  ViewOptions,
  ViewState,
  ModelOptions,
} from '../interfaces/interfaces';
import { standardOptions } from '../interfaces/constants';
import { Observable } from '../Observable/Observable';

class Presenter {
  public events: Observable;

  private view: View;

  private model: Model;

  constructor(public anchor: HTMLElement, options: Options) {
    this.events = new Observable();
    this.model = this.createModel(options);
    this.view = this.createView(anchor, options, this.model.state);
    this.subscribe();
  }

  public setOptions(options: Partial<Options>): void {
    const newOptions: Options = { ...standardOptions, ...options };
    this.handleNewSettings(newOptions);
  }

  public getOptions(): Options {
    const { pxMax, pxStep, ...options } = { ...this.model.state, ...this.view.state };
    return options;
  }

  private createModel(options: Options): Model {
    const modelOptions: ModelOptions = options as ModelOptions;
    return new Model(modelOptions);
  }

  private createView(anchor: HTMLElement, options: Options, modelOptions: ModelOptions): View {
    const viewOptions: ViewOptions = this.createViewOptions(options, modelOptions);
    return new View(anchor, viewOptions);
  }

  private createViewOptions(options: Options, modelOptions: ModelOptions): ViewOptions {
    const correctOptions: Options = { ...options, ...modelOptions };
    return correctOptions as ViewOptions;
  }

  private subscribe(): void {
    this.subscribeOnNewModelState();
    this.subscribeOnNewViewState();
    this.subscribeOnNewFromTo();
  }

  private subscribeOnNewModelState(): void {
    this.model.events.subscribe('newModelState', this.handleNewModelState);
  }

  @bind
  private handleNewModelState(modelState: ModelOptions): void {
    const {
      min, max, step, from, to,
    } = modelState;
    this.view.setState({
      ...this.view.state, min, max, step, from, to,
    });
  }

  private handleNewSettings(settings: Options): void {
    this.view.setState(settings as ViewOptions);
    this.model.setState(settings as ModelOptions);
  }

  private subscribeOnNewViewState(): void {
    this.view.events.subscribe('newViewState', this.handleNewViewState);
  }

  @bind
  private handleNewViewState(state: ViewState): void {
    this.events.notify('newViewState', state);
  }

  private subscribeOnNewFromTo(): void {
    this.view.events.subscribe('newFromTo', this.handleNewFromTo);
  }

  @bind
  private handleNewFromTo(newFromTo: Partial<ModelOptions>): void {
    const modelState: ModelOptions = this.model.state;
    const newModelState: ModelOptions = { ...modelState, ...newFromTo };
    this.model.setState(newModelState);
  }
}

export { Presenter };
