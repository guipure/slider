import Model from '../Model/Model';
import View from '../View/View';
import Options from './Options';

class Presenter {
  private view: View

  private model: Model

  constructor(anchor: HTMLElement, options: Options) {
    this.view = new View(anchor);
    this.model = new Model({
      min: 0,
      max: 10,
      step: 1,
    });
  }
}

export default Presenter;
