import { Model } from '../Model/Model';
import { View } from '../View/View';
import {
  Options,
  ViewOptions,
  ViewState,
  ModelOptions,
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
    this.view = new View(anchor, viewOptions, this.model.state.values);
    this.settings = new Settings(anchor, options);
    this.subscribe();
  }

  private subscribe(): void {
    this.subscribeOnNewValues();
    this.subscribeOnNewSettings();
    this.subscribeOnNewViewState();
  }

  private subscribeOnNewValues(): void {
    this.model.events.subscribe('values', this.handleNewValues.bind(this));
  }

  private handleNewValues(values: number[]): void {
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
