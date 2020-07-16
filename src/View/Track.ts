import { View } from './View';
import { Bar } from './Bar';

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
    element.className = `track track-${this.slider.state.orientation}`;
    element.addEventListener('click', this.onClick.bind(this));
    return element;
  }

  private initBar(): void {
    const bar = new Bar(this.element, this.slider);
  }

  private onClick(event: any): void {
    const customEvent = new CustomEvent('trackclick', { bubbles: true, detail: event });
    this.element.dispatchEvent(customEvent);
  }
}

export { Track };
