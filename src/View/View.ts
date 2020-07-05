import Track from './Track';
import Thumb from './Thumb';
import Slider from './Slider';
import { ViewOptions } from '../Presenter/Options';

class View {
  public slider?: Slider;

  constructor(private anchor: HTMLElement, private options: ViewOptions) {
    this.render();
  }

  private render(): void {
    this.slider = new Slider(this.anchor);
    new Track(this.slider, this.options);
    new Thumb(this.slider, this.options);
    new Thumb(this.slider, this.options);
  }
}

export default View;
