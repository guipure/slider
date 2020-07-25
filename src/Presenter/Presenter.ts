import { Model } from '../Model/Model';
import { View } from '../View/View';
import {
  Options,
  ViewOptions,
  ViewState,
  ModelOptions,
} from '../interfaces/options';
import { Settings } from '../View/Settings';

class Presenter {
  private view: View;

  private model: Model;

  private settings: Settings;

  constructor(anchor: HTMLElement, options: Options) {
    this.model = this.createModel(options);
    this.view = this.createView(anchor, options, this.model.state);
    this.settings = new Settings(anchor, options);
    this.subscribe();
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
    this.subscribeOnNewValues();
    this.subscribeOnNewSettings();
    this.subscribeOnNewViewState();
    this.subscribeOnNewFromTo();
  }

  private subscribeOnNewValues(): void {
    this.model.events.subscribe('newModelState', this.handleNewValues.bind(this));
  }

  private handleNewValues(modelState: ModelOptions): void {
    const {
      min, max, step, from, to,
    } = modelState;
    this.view.setState({
      ...this.view.state, min, max, step, from, to,
    });
  }

  private subscribeOnNewSettings(): void {
    this.settings.events.subscribe('newSettings', this.handleNewSettings.bind(this));
  }

  private handleNewSettings(settings: Options): void {
    this.view.setState(settings as ViewOptions);
    this.model.setState(settings as ModelOptions);
  }

  private subscribeOnNewViewState(): void {
    this.view.events.subscribe('newViewState', this.handleNewViewState.bind(this));
  }

  private handleNewViewState(state: ViewState): void {
    this.settings.updateFromTo(state);
  }

  private subscribeOnNewFromTo(): void {
    this.view.events.subscribe('newFromTo', this.handleNewFromTo.bind(this));
  }

  private handleNewFromTo(newFromTo: any): void {
    const modelState: ModelOptions = this.model.state;
    const newModelState: ModelOptions = { ...modelState, ...newFromTo };
    this.model.setState(newModelState);
  }
}

export { Presenter };
