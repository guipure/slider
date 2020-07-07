import { ViewOptions } from '../Presenter/Options';
import Slider from './Slider';

class Thumb {
  public element: HTMLElement;

  constructor(private slider: Slider, private options: ViewOptions) {
    this.element = this.createThumb();
    this.moveThumbAt(0);
    if (this.hasCollision()) {
      this.moveThumbAt(1000);
    }
  }

  private createThumb(): HTMLElement {
    const thumb = document.createElement('div');
    thumb.className = `thumb thumb-${this.options.orientation}`;
    thumb.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.slider.element.append(thumb);
    return thumb;
  }

  private hasCollision(): boolean {
    const allThumbs = this.slider.element.querySelectorAll('.thumb');

    if (allThumbs.length === 1) return false;

    let thumbProp: {start: 'left' | 'top', end: 'right' | 'bottom'};

    if (this.options.orientation === 'horizontal') {
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
    if (!this.element) throw 'Thumb not found';

    const thumbHalfWidth: number = this.element.getBoundingClientRect().width / 2;
    let thumbProp: 'left' | 'top';

    if (this.options.orientation === 'horizontal') {
      thumbProp = 'left';
    } else {
      thumbProp = 'top';
    }

    const sliderStart: number = this.slider.getSliderPosition()[thumbProp];
    const prevPosition: number = this.element.getBoundingClientRect()[thumbProp] - sliderStart;

    this.element.style[thumbProp] = `${this.fixCoordinate(coordinate) - sliderStart - thumbHalfWidth}px`;

    if (this.hasCollision()) {
      this.element.style[thumbProp] = `${prevPosition}px`;
    }
  }

  private fixCoordinate(coordinate: number): number {
    if (!this.options.values) throw 'Values not found';
    const values = this.convertValuesToPixels(this.options.values);
    const valuesDiff = values.map((value) => Math.abs(value - coordinate));
    const minDiff = Math.min(...valuesDiff);
    let closestIndex = 0;
    valuesDiff.forEach((value, index) => {
      if (value === minDiff) {
        closestIndex = index;
      }
    });
    return values[closestIndex];
  }

  private convertValuesToPixels(values: number[]): number[] {
    const sliderPosition = this.slider.getSliderPosition();
    let sliderStart;
    let sliderEnd;

    if (this.options.orientation === 'horizontal') {
      sliderStart = sliderPosition.left;
      sliderEnd = sliderPosition.right;
    } else {
      sliderStart = sliderPosition.top;
      sliderEnd = sliderPosition.bottom;
    }

    const pxValues = [];
    const pxStep = (sliderEnd - sliderStart) / (values[values.length - 1] - values[0]);
    let pxValue = sliderStart;

    while (pxValues.length < values.length) {
      pxValues.push(pxValue);
      pxValue += pxStep;
    }

    pxValues.push(sliderEnd);

    return pxValues;
  }

  private onMouseDown(event: any) {
    const thumb = this.element;
    if (!thumb) {
      throw 'Thumb not found';
    }
    const { orientation } = this.options;
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
