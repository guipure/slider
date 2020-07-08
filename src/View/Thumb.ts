import { ViewOptions } from '../Presenter/Options';
import View from './View';
import { ThumbLabel } from './ThumbLabel';
import EventManager from '../EventManager/EventManager';

class Thumb {
  public element: HTMLElement;
  public events: EventManager;
  private pxValues?: number[];

  constructor(private slider: View) {
    this.events = new EventManager();
    if (this.slider.state.values) {
      this.pxValues = this.convertValuesToPixels(this.slider.state.values);
    }
    this.element = this.createThumb();
    this.update(slider.state);
    this.moveThumbAt(0);
    if (this.hasCollision()) {
      this.moveThumbAt(10000);
    }
    const label = new ThumbLabel(this, slider);
    this.slider.events.subscribe('newViewState', this.update.bind(this));
  }

  private createThumb(): HTMLElement {
    const thumb = document.createElement('div');
    const doesOtherThumbExist = this.slider.element.querySelector('.thumb') ? true : false;
    const thumbNumber: 'first' | 'second' = doesOtherThumbExist ? 'second' : 'first';
    thumb.className = `thumb thumb-${this.slider.state.orientation} thumb-${thumbNumber}`;
    thumb.addEventListener('mousedown', this.onMouseDown.bind(this));
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
  
    if (this.slider.state.values) {
      this.pxValues = this.convertValuesToPixels(this.slider.state.values);
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
    let pageOffset;
    const thumbHalfWidth: number = this.element.getBoundingClientRect().width / 2;

    if (this.slider.state.orientation === 'horizontal') {
      thumbProp = 'left';
      pageOffset = pageXOffset;
    } else {
      thumbProp = 'top';
      pageOffset = pageYOffset;
    }

    const position: number = this.element.getBoundingClientRect()[thumbProp] + pageOffset + thumbHalfWidth;
    if (!this.pxValues || !this.slider.state.values) throw Error('Values not found');
    const index = this.closestIndex(this.pxValues, position);
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
    let pageOffset;

    if (this.slider.state.orientation === 'horizontal') {
      thumbProp = 'left';
      pageOffset = pageXOffset;
    } else {
      thumbProp = 'top';
      pageOffset = pageYOffset;
    }

    const sliderStart: number = this.slider.getSliderPosition()[thumbProp];
    const prevPosition: number = this.element.getBoundingClientRect()[thumbProp] - sliderStart;
    const correction: number = pageOffset + sliderStart + thumbHalfWidth;
    this.element.style[thumbProp] = `${this.fixCoordinate(coordinate + pageOffset) - correction}px`;

    if (this.hasCollision()) {
      this.element.style[thumbProp] = `${prevPosition}px`;
    }

    this.events.notify('thumbMove');
  }

  private fixCoordinate(coordinate: number): number {
    if (!this.pxValues) throw 'Values not found';
    const index = this.closestIndex(this.pxValues, coordinate);
    return this.pxValues[index];
  }

  private closestIndex(array: number[], value: number) {
    const diffArray = array.map((x) => Math.abs(x - value));
    const minDiff = Math.min(...diffArray);
    return diffArray.findIndex((x) => x === minDiff);
  }

  private convertValuesToPixels(values: number[]): number[] {
    const sliderPosition = this.slider.getSliderPosition();
    let sliderStart;
    let sliderEnd;

    if (this.slider.state.orientation === 'horizontal') {
      sliderStart = sliderPosition.left + pageXOffset;
      sliderEnd = sliderPosition.right + pageXOffset;
    } else {
      sliderStart = sliderPosition.top + pageYOffset;
      sliderEnd = sliderPosition.bottom + pageYOffset;
    }

    const pxValues = [];
    const pxStep = (sliderEnd - sliderStart) / (values.length - 1);
    let pxValue = sliderStart;

    while (pxValues.length < values.length) {
      pxValues.push(pxValue);
      pxValue += pxStep;
    }
    
    return pxValues;
  }

  private onMouseDown(event: any) {
    const thumb = this.element;
    if (!thumb) {
      throw 'Thumb not found';
    }
    const { orientation } = this.slider.state;
    const coordinate = getCoordinate(event);
    this.moveThumbAt(coordinate);
    const onMouseMove = (event: any) => this.moveThumbAt(getCoordinate(event));
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    function getCoordinate(event: any) {
      const coordinate = orientation === 'horizontal' ? event.clientX : event.clientY;
      return coordinate;
    }

    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    thumb.ondragstart = function () {
      return false;
    };
  }
}

export default Thumb;
