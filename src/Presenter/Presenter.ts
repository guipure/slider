import Model from '../Model/Model';
import View from '../View/View';

class Presenter {
  private view: View

  private model: Model

  constructor() {
    this.view = new View();
    this.model = new Model({
      min: 0,
      max: 10,
      step: 1,
    });
  }
}

export default Presenter;
