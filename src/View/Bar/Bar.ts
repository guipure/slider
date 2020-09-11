import { sliderOrientation, sliderType } from '../../interfaces/constants';
import { View } from '../View/View';

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
    bar.className = `slider__bar slider__bar_${this.slider.state.orientation}`;
    track.append(bar);
    return bar;
  }

  private placeBar(bar: HTMLElement) {
    const isHorizontal = this.slider.state.orientation === sliderOrientation.HORIZONTAL;
    const side: 'left' | 'top' = isHorizontal ? 'left' : 'top';
    const dimension: 'width' | 'height' = isHorizontal ? 'width' : 'height';

    const thumbsPositions = this.slider.getThumbsPositions();
    const sliderPosition = this.slider.getSliderPosition();

    const convert = this.slider.convertPxToPercent.bind(this.slider);

    const isSingle = this.slider.state.type === sliderType.SINGLE;

    if (isSingle) {
      const length: number = convert(Math.abs(thumbsPositions[1] - sliderPosition));
      bar.style[side] = '0%';
      bar.style[dimension] = `${length}%`;
    } else {
      const start = convert(Math.abs(thumbsPositions[0] - sliderPosition));
      const length: number = convert(Math.abs(thumbsPositions[1] - thumbsPositions[0]));
      bar.style[side] = `${start}%`;
      bar.style[dimension] = `${length}%`;
    }
  }
}

export { Bar };
