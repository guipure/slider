import { View } from './View';

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
    const bar = this.createBar();
    this.placeBar(bar);
    this.slider.events.subscribe('newViewState', this.placeBar.bind(this, bar));
  }

  private createBar(): HTMLElement {
    const bar = document.createElement('div');
    bar.className = `bar bar-${this.slider.state.orientation}`;
    this.element.append(bar);
    return bar;
  }

  private placeBar(bar: HTMLElement) {
    const isHorizontal: boolean = this.slider.state.orientation === 'horizontal';
    const side: 'left' | 'top' = isHorizontal ? 'left' : 'top';
    const dimension: 'width' | 'height' = isHorizontal ? 'width' : 'height';
    const thumbsPositions = this.slider.getThumbsPositions();
    const sliderPosition = this.slider.getSliderPosition();

    if (this.slider.state.type === 'single') {
      bar.style[side] = '0px';
      bar.style[dimension] = `${thumbsPositions[1] - sliderPosition}px`;
    } else {
      bar.style[side] = `${thumbsPositions[0] - sliderPosition - 10}px`;
      bar.style[dimension] = `${thumbsPositions[1] - thumbsPositions[0]}px`;
    }
  }

  private onClick(event: any): void {
    const customEvent = new CustomEvent('trackclick', { bubbles: true, detail: event });
    this.element.dispatchEvent(customEvent);
  }
}

export { Track };
