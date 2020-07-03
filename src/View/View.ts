import Track from './Track';
import Thumb from './Thumb';
import Slider from './Slider';

class View {
  constructor(public anchor: HTMLElement) {
    this.render();
  }

  private render(): void {
    new Slider(this.anchor);
    new Track(this.anchor);
    new Thumb(this.anchor);
    new Thumb(this.anchor);
  }
}

export default View;
