import Model from '../Model/Model';
import View from '../View/View';
import { Options, ViewOptions, ModelOptions } from './Options';
import { Settings } from '../View/Settings';

class Presenter {
  private view: View

  private model: Model

  private settings: Settings;

  constructor(anchor: HTMLElement, options: Options) {
    const modelOptions: ModelOptions = options as ModelOptions;
    const viewOptions: ViewOptions = options as ViewOptions;

    this.model = new Model(modelOptions);
    viewOptions.values = this.model.state.values;
    this.view = new View(anchor, viewOptions);
    this.settings = new Settings(anchor, options);
    this.model.events.subscribe('values', (values) => {
      this.view.setState({ ...this.view.state, values });
    });
    this.settings.events.subscribe('newSettings', (newOptions: Options) => {
      this.view.setState(newOptions as ViewOptions);
      this.model.setState(newOptions as ModelOptions);
    });
    this.view.events.subscribe('newViewState', (newState: ViewOptions) => {
      this.settings.updateFromTo(newState);
    })
  }
}

export default Presenter;
