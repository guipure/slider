import { ViewOptions } from '../Presenter/Options';
import Slider from './Slider';

class Thumb {
  private element?: HTMLElement;

  constructor(private slider: Slider, private options: ViewOptions) {
    this.element = this.createThumb();
  }

  private createThumb(): HTMLElement {
    const thumb = document.createElement('div');
    thumb.className = `thumb thumb-${this.options.orientation}`;
    thumb.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.slider.element.append(thumb);
    const allThumbs = this.slider.element.querySelectorAll('.thumb');
    if (allThumbs.length > 1) {
      const thumbProp: 'left' | 'top' = this.options.orientation === 'horizontal' ? 'left' : 'top';
      thumb.style[thumbProp] = thumb.getBoundingClientRect().width + 'px';
    }
    return thumb;
  }

  private hasCollision(): boolean {
    const allThumbs = this.slider.element.querySelectorAll('.thumb');

    if (allThumbs.length === 1) return false;

    let thumbProp: {start: 'left' | 'top', end: 'right' | 'bottom'};

    if (this.options.orientation === 'horizontal') {
      thumbProp = {start: 'left', end: 'right'};
    } else {
      thumbProp = {start: 'top', end: 'bottom'};
    }

    const firstThumb = allThumbs[0];
    const secondThumb = allThumbs[1];
    const firstThumbStart = firstThumb.getBoundingClientRect()[thumbProp.start];
    const firstThumbEnd = firstThumb.getBoundingClientRect()[thumbProp.end];
    const secondThumbStart = secondThumb.getBoundingClientRect()[thumbProp.start];
    const secondThumbEnd = secondThumb.getBoundingClientRect()[thumbProp.end];

    if (firstThumbStart === secondThumbStart) return true;
    else if (firstThumbStart < secondThumbStart) {
      return firstThumbEnd >= secondThumbStart;
    } else {
      return secondThumbEnd >= firstThumbStart;
    }
  }

  public moveThumbAt(coordinate: number): void {
    if (!this.element) throw 'Thumb not found';

    let thumbProp: 'left' | 'top';

    if (this.options.orientation === 'horizontal') {
      thumbProp = 'left';
    } else {
      thumbProp = 'top';
    }

    const [start, end] = this.findEdges(this.element);

    if (coordinate < start) {
      this.element.style[thumbProp] = '0px';
    } else if (coordinate > end) {
      this.element.style[thumbProp] = `${end - start}px`;
    } else {
      this.element.style[thumbProp] = `${coordinate - start}px`;
    }
  }

  private findEdges(thumb: HTMLElement): [number, number] {
    const allThumbs = this.slider.element.querySelectorAll('.thumb');
    let thumbProp: {start: 'left' | 'top', end: 'right' | 'bottom'};
    let pageOffset: number;
    const thumbHalfWidth: number = allThumbs[0].getBoundingClientRect().width / 2;
    
    if (this.options.orientation === 'horizontal') {
      pageOffset = pageXOffset;
      thumbProp = {start: 'left', end: 'right'};
    } else {
      pageOffset = pageYOffset;
      thumbProp = {start: 'top', end: 'bottom'};
    }

    const sliderStart: number = this.slider.getSliderPosition()[thumbProp.start] + pageOffset + thumbHalfWidth;
    const sliderEnd: number = this.slider.getSliderPosition()[thumbProp.end] + pageOffset - thumbHalfWidth;
    
    if (allThumbs.length === 1) {
      return [sliderStart, sliderEnd];
    }

    const thumbStart = thumb.getBoundingClientRect()[thumbProp.start];
    const otherThumb = allThumbs[0] === thumb ? allThumbs[1] : allThumbs[0];
    const otherThumbStart = otherThumb.getBoundingClientRect()[thumbProp.start];
    const otherThumbEnd = otherThumb.getBoundingClientRect()[thumbProp.end];

    if (thumbStart < otherThumbStart) {
      return [sliderStart, otherThumbStart - thumbHalfWidth];
    } else {
      return [otherThumbEnd - thumbHalfWidth, sliderEnd];
    }
  }

  private onMouseDown(event: any) {
    const thumb = this.element;
    if (!thumb) {
      throw 'Thumb not found'
    }
    const orientation = this.options.orientation;
    const coordinate = getCoordinate(event);
    this.moveThumbAt(coordinate);
    const onMouseMove = (event: any) => this.moveThumbAt(getCoordinate(event));
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    function getCoordinate(event: any) {
      const coordinate = orientation === 'horizontal' ? event.pageX : event.pageY;
      return coordinate;
    }        

    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    thumb.ondragstart = function() {
      return false;
    }
  }
}

export default Thumb;
