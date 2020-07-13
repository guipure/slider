import { ViewOptions } from '../Presenter/Options';
import { View } from './View';
import { ThumbLabel } from './ThumbLabel';
import { EventManager } from '../EventManager/EventManager';

class Thumb {
  public element: HTMLElement;

  public events: EventManager;

  constructor(private slider: View) {
    this.events = new EventManager();
    this.element = this.createThumb();
    this.update(slider.state);

    const label = new ThumbLabel(this, slider);
    this.slider.events.subscribe('newViewState', this.update.bind(this));
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

  private update(newState: ViewOptions): void {
    if (this.element.classList.contains('thumb-second')) {
      if (newState.type === 'single') {
        this.hideThumb();
      } else {
        this.showThumb();
      }
    }

    if (this.element.classList.contains('thumb-first')) {
      if (this.getPosition() !== this.slider.state.from) {
        this.moveThumbAtValue(this.slider.state.from);
      }
    } else if (this.getPosition() !== this.slider.state.to) {
      this.moveThumbAtValue(this.slider.state.to);
    }

    this.events.notify('thumbUpdate');
  }

  private showThumb(): void {
    this.element.style.display = 'block';
  }

  private hideThumb(): void {
    this.element.style.display = 'none';
  }

  public getPosition(): number {
    let thumbProp: 'left' | 'top';

    if (this.slider.state.orientation === 'horizontal') {
      thumbProp = 'left';
    } else {
      thumbProp = 'top';
    }

    const sliderStart: number = this.slider.getSliderPosition()[thumbProp];
    const thumbStart: number = this.element.getBoundingClientRect()[thumbProp];
    const thumbHalfWidth: number = this.element.getBoundingClientRect().width / 2;
    const position: number = thumbStart - sliderStart + thumbHalfWidth;
    if (!this.slider.state.pxValues || !this.slider.state.values) throw Error('Values not found');
    const index = this.closestIndex(this.slider.state.pxValues, position);
    return this.slider.state.values[index];
  }

  private hasCollision(): boolean {
    const allThumbs = this.slider.element.querySelectorAll('.thumb');

    if (allThumbs.length === 1) return false;

    let thumbProp: {start: 'left' | 'top', end: 'right' | 'bottom'};

    if (this.slider.state.orientation === 'horizontal') {
      thumbProp = { start: 'left', end: 'right' };
    } else {
      thumbProp = { start: 'top', end: 'bottom' };
    }

    const firstThumb = allThumbs[0];
    const secondThumb = allThumbs[1];
    const firstThumbStart = firstThumb.getBoundingClientRect()[thumbProp.start];
    const firstThumbEnd = firstThumb.getBoundingClientRect()[thumbProp.end];
    const secondThumbStart = secondThumb.getBoundingClientRect()[thumbProp.start];
    const secondThumbEnd = secondThumb.getBoundingClientRect()[thumbProp.end];

    if (firstThumbStart === secondThumbStart) return true;
    if (firstThumbStart < secondThumbStart) {
      return firstThumbEnd >= secondThumbStart;
    }
    return secondThumbEnd >= firstThumbStart;
  }

  public moveThumbAt(coordinate: number): void {
    const thumbHalfWidth: number = this.element.getBoundingClientRect().width / 2;
    let thumbProp: 'left' | 'top';

    if (this.slider.state.orientation === 'horizontal') {
      thumbProp = 'left';
    } else {
      thumbProp = 'top';
    }

    const sliderStart: number = this.slider.getSliderPosition()[thumbProp];
    // const prevPosition: number = this.element.getBoundingClientRect()[thumbProp] - sliderStart;
    this.element.style[thumbProp] = `${this.fixCoordinate(coordinate - sliderStart) - thumbHalfWidth}px`;

    // if (this.hasCollision()) {
    //   this.element.style[thumbProp] = `${prevPosition}px`;
    // }

    this.events.notify('thumbMove');
  }

  public moveThumbAtValue(value: number): void {
    this.moveThumbAt(this.valueToPx(value));
  }

  private fixCoordinate(coordinate: number): number {
    if (!this.slider.state.pxValues) throw new Error('Values not found');
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
    if (!values || !pxValues) throw Error('Values not found');
    const sliderPosition = this.slider.getSliderPosition();
    let sliderStart;

    if (this.slider.state.orientation === 'horizontal') {
      sliderStart = sliderPosition.left;
    } else {
      sliderStart = sliderPosition.top;
    }

    const index = values.findIndex((x) => x === value);

    return pxValues[index] + sliderStart;
  }

  private onMouseDown(event: any) {
    const mouseDownEvent = new CustomEvent('thumbmousedown', { bubbles: true, detail: event });
    this.element.dispatchEvent(mouseDownEvent);
  }
}

export { Thumb };
