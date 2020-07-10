import { ViewOptions } from '../Presenter/Options';
import View from './View';

class Track {
  private element: HTMLElement;
  private bar: HTMLElement;

  constructor(private slider: View) {
    this.element = this.createTrack();
    slider.element.append(this.element);
    this.bar = this.createBar();
    this.placeBar = this.placeBar.bind(this);
    this.placeBar();
    this.slider.events.subscribe('newViewState', this.placeBar);
  }

  private createBar() {
    const bar = document.createElement('div');
    bar.className = `bar bar-${this.slider.state.orientation}`;
    this.element.append(bar);
    return bar;
  }

  private placeBar() {
    const isHorizontal: boolean = this.slider.state.orientation === 'horizontal';
    const side: 'left' | 'top' = isHorizontal ? 'left' : 'top';
    const dimension: 'width' | 'height' = isHorizontal ? 'width' : 'height';
    const thumbsPositions = this.slider.getThumbsPositions();
    const sliderPosition = this.slider.getSliderPosition()[side];

    if (this.slider.state.type === 'single') {
      this.bar.style[side] = '0px';
      this.bar.style[dimension] = `${thumbsPositions[1] - sliderPosition}px`;
    } else {
      this.bar.style[side] = `${thumbsPositions[0] - sliderPosition - 10}px`;
      this.bar.style[dimension] = `${thumbsPositions[1] - thumbsPositions[0]}px`;
    }
  }

  private createTrack() {
    const element = document.createElement('div');
    element.className = `track track-${this.slider.state.orientation}`;
    element.addEventListener('click', this.onClick.bind(this));
    return element;
  }

  private onClick(event: any) {
    const customEvent = new CustomEvent('trackclick', { bubbles: true, detail: event });
    this.element.dispatchEvent(customEvent);
  }
}

export default Track;
