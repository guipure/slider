import { ViewOptions } from '../Presenter/Options';
import Slider from './Slider';

class Thumb {
  constructor(private slider: Slider, private options: ViewOptions) {
    const thumb = this.createThumb();
    slider.sliderDiv && slider.sliderDiv.append(thumb);
  }

  private createThumb(): HTMLElement {
    const thumb = document.createElement('div');
    thumb.className = `thumb thumb-${this.options.orientation}`;
    thumb.addEventListener('mousedown', this.onMouseDown.bind(this));
    return thumb;
  }

  public moveThumbAt(thumb: HTMLElement, coordinate: number, orientation: string): void {
    const thumbHalfWidth: number = Number.parseInt(getComputedStyle(thumb).width) / 2;
    let startSliderPosition: number;
    let endSliderPosition: number;
    let pageOffset: number;
    let thumbProp: 'left' | 'top';

    if (orientation === 'horizontal') {
      startSliderPosition = this.slider.getSliderPosition().left;
      endSliderPosition = this.slider.getSliderPosition().right;
      pageOffset = pageXOffset;
      thumbProp = 'left';
    } else {
      startSliderPosition = this.slider.getSliderPosition().top;
      endSliderPosition = this.slider.getSliderPosition().bottom;
      pageOffset = pageYOffset;
      thumbProp = 'top';
    }

    const start: number = startSliderPosition + pageOffset + thumbHalfWidth;
    const end: number = endSliderPosition + pageOffset - thumbHalfWidth;

    if (coordinate < start) {
      thumb.style[thumbProp] = '0px';
    } else if (coordinate > end) {
      thumb.style[thumbProp] = `${end - start}px`;
    } else {
      thumb.style[thumbProp] = `${coordinate - start}px`;
    }
  }

  private onMouseDown(event: any) {
    const thumb: HTMLElement = event.currentTarget;
    const orientation = thumb.classList.contains('thumb-horizontal') ? 'horizontal' : 'vertical';
    const coordinate = getCoordinate(event);
    this.moveThumbAt(thumb, coordinate, orientation);
    const onMouseMove = (event: any) => this.moveThumbAt(thumb, getCoordinate(event), orientation);
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
