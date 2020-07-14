import { ViewState } from '../Presenter/Options';
import { View } from './View';
import { ThumbLabel } from './ThumbLabel';
import { EventManager } from '../EventManager/EventManager';

class Thumb {
  public element: HTMLElement;

  public events: EventManager;

  constructor(private slider: View) {
    this.events = new EventManager();
    this.element = this.createThumb();
    this.init();
  }

  public getCurrentValue(): number {
    const side: 'left' | 'top' = this.getSide(this.slider.state.orientation);
    const sliderStart: number = this.slider.getSliderPosition();
    const thumbStart: number = this.element.getBoundingClientRect()[side];
    const thumbHalfWidth: number = this.element.getBoundingClientRect().width / 2;
    const position: number = thumbStart - sliderStart + thumbHalfWidth;
    const index = this.closestIndex(this.slider.state.pxValues, position);
    return this.slider.state.values[index];
  }

  public moveThumbAt(coordinate: number): void {
    const thumbHalfWidth: number = this.element.getBoundingClientRect().width / 2;
    const side: 'left' | 'top' = this.getSide(this.slider.state.orientation);
    const sliderStart: number = this.slider.getSliderPosition();
    this.element.style[side] = `${this.fixCoordinate(coordinate - sliderStart) - thumbHalfWidth}px`;

    this.events.notify('thumbMove');
  }

  public moveThumbAtValue(value: number): void {
    this.moveThumbAt(this.valueToPx(value));
  }

  private init(): void {
    this.createLabel();
    this.update(this.slider.state);
    this.slider.events.subscribe('newViewState', this.update.bind(this));
  }

  private createLabel(): void {
    const { orientation, hide_from_to } = this.slider.state;
    const label = new ThumbLabel(this, orientation, hide_from_to);
  }

  private createThumb(): HTMLElement {
    const thumb = document.createElement('div');
    const doesOtherThumbExist = !!this.slider.element.querySelector('.thumb');
    const thumbNumber: 'first' | 'second' = doesOtherThumbExist ? 'second' : 'first';
    thumb.className = `thumb thumb-${this.slider.state.orientation} thumb-${thumbNumber}`;
    thumb.addEventListener('mousedown', this.onMouseDown.bind(this));
    thumb.ondragstart = function () {
      return false;
    };
    this.slider.element.append(thumb);
    return thumb;
  }

  private update(newState: ViewState): void {
    this.toggleThumb(newState.type);
    this.placeThumb(newState.from, newState.to);
    this.events.notify('thumbUpdate');
  }

  private toggleThumb(type: 'single' | 'double'): void {
    if (this.element.classList.contains('thumb-second')) {
      if (type === 'single') {
        this.hideThumb();
      } else {
        this.showThumb();
      }
    }
  }

  private placeThumb(from: number, to: number): void {
    if (this.element.classList.contains('thumb-first')) {
      if (this.getCurrentValue() !== from) {
        this.moveThumbAtValue(from);
      }
    } else if (this.getCurrentValue() !== to) {
      this.moveThumbAtValue(to);
    }
  }

  private showThumb(): void {
    this.element.style.display = 'block';
  }

  private hideThumb(): void {
    this.element.style.display = 'none';
  }

  private fixCoordinate(coordinate: number): number {
    const index = this.closestIndex(this.slider.state.pxValues, coordinate);
    return this.slider.state.pxValues[index];
  }

  private closestIndex(array: number[], value: number) {
    const diffArray = array.map((x) => Math.abs(x - value));
    const minDiff = Math.min(...diffArray);
    return diffArray.findIndex((x) => x === minDiff);
  }

  private valueToPx(value: number): number {
    const { values, pxValues } = this.slider.state;
    const sliderStart = this.slider.getSliderPosition();
    const index = values.findIndex((x) => x === value);
    return pxValues[index] + sliderStart;
  }

  private onMouseDown(event: any) {
    const mouseDownEvent = new CustomEvent('thumbmousedown', { bubbles: true, detail: event });
    this.element.dispatchEvent(mouseDownEvent);
  }

  private getSide(orientation: string): 'left' | 'top' {
    if (orientation === 'horizontal') {
      return 'left';
    }

    return 'top';
  }
}

export { Thumb };
