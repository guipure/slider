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
    let viewOptions: ViewOptions = options as ViewOptions;

    this.model = new Model(modelOptions);
    const {
      min, max, step, from, to,
    } = this.model.state;
    viewOptions = {
      ...viewOptions, min, max, step, from, to,
    };
    this.view = new View(anchor, viewOptions);
    this.settings = new Settings(anchor, options);
    this.subscribe();
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
