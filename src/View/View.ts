import Slider from './Slider';
import { ViewOptions } from '../Presenter/Options';

class View {
  private slider: Slider;

  constructor(private anchor: HTMLElement, private options: ViewOptions) {
    this.slider = new Slider(this.anchor, this.options);
  }
}

export default View;
