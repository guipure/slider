import { View } from './View';

class Bar {
  private element: HTMLElement;

  constructor(track: HTMLElement, private slider: View) {
    this.element = this.createBar(track);
    this.initBar();
  }

  private initBar(): void {
    this.placeBar(this.element);
    this.slider.events.subscribe('newViewState', this.placeBar.bind(this, this.element));
  }

  private createBar(track: HTMLElement): HTMLElement {
    const bar = document.createElement('div');
    bar.className = `bar bar-${this.slider.state.orientation}`;
    track.append(bar);
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
}

export { Bar };
