import { Model } from '../Model/Model';
import { View } from '../View/View';
import {
  Options,
  ViewOptions,
  ViewState,
  ModelOptions,
  Values,
} from './Options';
import { Settings } from '../View/Settings';

class Presenter {
  private view: View;

  private model: Model;

  private settings: Settings;

  constructor(anchor: HTMLElement, options: Options) {
    const modelOptions: ModelOptions = options as ModelOptions;
    const viewOptions: ViewOptions = options as ViewOptions;

    this.model = new Model(modelOptions);
    const { min, max, step } = this.model.state;
    const values = { min, max, step };
    this.view = new View(anchor, viewOptions, values);
    this.settings = new Settings(anchor, options);
    this.subscribe();
  }

  private subscribe(): void {
    this.subscribeOnNewValues();
    this.subscribeOnNewSettings();
    this.subscribeOnNewViewState();
  }

  private subscribeOnNewValues(): void {
    this.model.events.subscribe('newModelState', this.handleNewValues.bind(this));
  }

  private handleNewValues(modelState: ModelOptions): void {
    const { min, max, step } = modelState;
    const values: Values = { min, max, step };
    this.view.setState({ ...this.view.state, values });
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
}

export { Presenter };
