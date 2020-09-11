import { View } from '../View/View';
import { Bar } from '../Bar/Bar';

class Track {
  private element: HTMLElement;

  constructor(private slider: View) {
    this.element = this.createTrack();
    this.initTrack();
    this.initBar();
  }

  private initTrack(): void {
    this.slider.element.append(this.element);
  }

  private createTrack(): HTMLElement {
    const element = document.createElement('div');
    element.className = `slider__track slider__track_${this.slider.state.orientation}`;
    return element;
  }

  private initBar(): void {
    // eslint-disable-next-line no-new
    new Bar(this.element, this.slider);
  }
}

export { Track };
