import { ViewState, Orientation, SliderType } from '../interfaces/interfaces';
import { sliderOrientation, sliderType } from '../interfaces/constants';
import { EventManager } from '../EventManager/EventManager';
import { View } from './View';
import { ThumbLabel } from './ThumbLabel';

class Thumb {
  public element: HTMLElement;

  public events: EventManager;

  public currentValue: number = 0;

  constructor(private slider: View) {
    this.events = new EventManager();
    this.element = this.createThumb();
    this.init();
  }

  private init(): void {
    this.update(this.slider.state);
    this.createLabel();
    this.slider.events.subscribe('newViewState', this.update.bind(this));
  }

  private update(newState: ViewState): void {
    this.toggleThumb(newState.type);
    this.placeThumb(newState.from, newState.to);
    this.events.notify('changedHideFromTo', { hideFromTo: newState.hideFromTo });
  }

  private createThumb(): HTMLElement {
    const thumb = document.createElement('div');
    const doesOtherThumbExist = !!this.slider.element.querySelector('.slider__thumb');
    const thumbNumber: 'first' | 'second' = doesOtherThumbExist ? 'second' : 'first';
    thumb.className = `slider__thumb slider__thumb_${this.slider.state.orientation} slider__thumb_${thumbNumber}`;
    const handleDragStart = (event: Event) => event.preventDefault();
    thumb.addEventListener('dragstart', handleDragStart);
    this.slider.element.append(thumb);
    return thumb;
  }

  private createLabel(): void {
    const { orientation, hideFromTo } = this.slider.state;
    const label = new ThumbLabel(this, orientation, hideFromTo);
  }

  private toggleThumb(type: SliderType): void {
    if (this.element.classList.contains('slider__thumb_second')) {
      if (type === sliderType.SINGLE) {
        this.hideThumb();
      } else {
        this.showThumb();
      }
    }
  }

  private placeThumb(from: number, to: number): void {
    if (this.element.classList.contains('slider__thumb_first')) {
      this.currentValue = from;
      this.moveThumbAtValue(from);
    } else {
      this.currentValue = to;
      this.moveThumbAtValue(to);
    }
  }

  private moveThumbAtValue(value: number): void {
    const { orientation } = this.slider.state;
    const coordinate = this.convertValueToPx(value);
    const thumbHalfWidth: number = Number.parseInt(getComputedStyle(this.element).width, 10) / 2;
    const side: 'left' | 'top' = this.getSide(orientation);
    const position: number = this.slider.convertPxToPercent(coordinate - thumbHalfWidth);
    this.element.style[side] = `${position}%`;
    this.events.notify('thumbMove');
  }

  private convertValueToPx(value: number): number {
    const {
      min, max, step, pxMax, pxStep,
    } = this.slider.state;

    if (value === max) {
      return pxMax;
    }

    const pxValue = Math.round((value - min) / step) * pxStep;
    return pxValue;
  }

  private showThumb(): void {
    this.element.style.display = 'flex';
  }

  private hideThumb(): void {
    this.element.style.display = 'none';
  }

  private getSide(orientation: Orientation): 'left' | 'top' {
    if (orientation === sliderOrientation.HORIZONTAL) {
      return 'left';
    }

    return 'top';
  }
}

export { Thumb };
