import Model from '../Model/Model';
import View from '../View/View';
import { Options, ViewOptions, ModelOptions } from './Options';

class Presenter {
  private view: View

  private model: Model

  constructor(anchor: HTMLElement, options: Options) {
    const viewOptions: ViewOptions = options as ViewOptions;
    const modelOptions: ModelOptions = options as ModelOptions;

    this.view = new View(anchor, viewOptions);
    this.model = new Model(modelOptions);
  }
}

export default Presenter;
