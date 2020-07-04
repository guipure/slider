import Track from './Track';
import Thumb from './Thumb';
import Slider from './Slider';
import { ViewOptions } from '../Presenter/Options';

class View {
  constructor(private anchor: HTMLElement, private options: ViewOptions) {
    this.render();
  }

  private render(): void {
    new Slider(this.anchor);
    new Track(this.anchor, this.options);
    new Thumb(this.anchor, this.options);
    new Thumb(this.anchor, this.options);
  }
}

export default View;
