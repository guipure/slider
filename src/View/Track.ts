import { ViewOptions } from '../Presenter/Options';
import Slider from './Slider';

class Track {
  private element: HTMLElement;

  constructor(private slider: Slider, private options: ViewOptions) {
    this.element = this.createTrack();
    slider.element.append(this.element);
  }

  private createTrack() {
    const element = document.createElement('div');
    element.className = `track track-${this.options.orientation}`;
    element.addEventListener('click', this.onClick.bind(this));
    return element;
  }

  private onClick(event: any) {
    const customEvent = new CustomEvent('trackclick', {bubbles: true, detail: event});
    this.element.dispatchEvent(customEvent);
  }
}

export default Track;
