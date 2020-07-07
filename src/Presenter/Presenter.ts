import Model from '../Model/Model';
import View from '../View/View';
import { Options, ViewOptions, ModelOptions } from './Options';
import EventListener from '../EventManager/EventListener';

class Presenter implements EventListener {
  private view: View

  private model: Model

  constructor(anchor: HTMLElement, options: Options) {
    const modelOptions: ModelOptions = options as ModelOptions;
    const viewOptions: ViewOptions = options as ViewOptions;

    this.model = new Model(modelOptions);
    this.model.events.subscribe('values', this);
    viewOptions.values = this.model.values;
    this.view = new View(anchor, viewOptions);
  }

  public update(data: object) {
    console.log(`update! ${data}`);
  }
}

export default Presenter;
