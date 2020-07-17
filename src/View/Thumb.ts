import { ViewState, Orientation, SliderType } from '../Presenter/Options';
import { View } from './View';
import { ThumbLabel } from './ThumbLabel';
import { EventManager } from '../EventManager/EventManager';

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
    this.events.notify('changedHideFromTo', { hide_from_to: newState.hide_from_to });
  }

  private createThumb(): HTMLElement {
    const thumb = document.createElement('div');
    const doesOtherThumbExist = !!this.slider.element.querySelector('.thumb');
    const thumbNumber: 'first' | 'second' = doesOtherThumbExist ? 'second' : 'first';
    thumb.className = `thumb thumb-${this.slider.state.orientation} thumb-${thumbNumber}`;
    thumb.ondragstart = function () {
      return false;
    };
    this.slider.element.append(thumb);
    return thumb;
  }

  private createLabel(): void {
    const { orientation, hide_from_to } = this.slider.state;
    const label = new ThumbLabel(this, orientation, hide_from_to);
  }

  private toggleThumb(type: SliderType): void {
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
      this.currentValue = from;
      this.moveThumbAtValue(from);
    } else {
      this.currentValue = to;
      this.moveThumbAtValue(to);
    }
  }

  private moveThumbAtValue(value: number): void {
    const coordinate = this.valueToPx(value);
    const thumbHalfWidth: number = this.element.getBoundingClientRect().width / 2;
    const side: 'left' | 'top' = this.getSide(this.slider.state.orientation);
    this.element.style[side] = `${coordinate - thumbHalfWidth}px`;
    this.events.notify('thumbMove');
  }

  private valueToPx(value: number): number {
    const { values, pxValues } = this.slider.state;
    const index = values.findIndex((x) => x === value);
    return pxValues[index];
  }

  private showThumb(): void {
    this.element.style.display = 'block';
  }

  private hideThumb(): void {
    this.element.style.display = 'none';
  }

  private getSide(orientation: Orientation): 'left' | 'top' {
    if (orientation === 'horizontal') {
      return 'left';
    }

    return 'top';
  }
}

export { Thumb };
