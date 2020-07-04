import { ViewOptions } from '../Presenter/Options';

class Thumb {
  constructor(anchor: HTMLElement, private options: ViewOptions) {
    const slider = anchor.querySelector('.slider');
    const thumb = this.createThumb();
    slider && slider.append(thumb);
  }

  private createThumb(): HTMLElement {
    const thumb = document.createElement('div');
    thumb.className = `thumb thumb-${this.options.orientation}`;
    thumb.addEventListener('mousedown', this.thumbHandler);
    return thumb;
  }

  private thumbHandler(event: any) {
    const thumb: HTMLElement = event.currentTarget;
    const orientation = thumb.classList.contains('thumb-horizontal') ? 'horizontal' : 'vertical';
    const coordinate = getCoordinate(event);
    moveThumbAt(coordinate);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    function getCoordinate(event: any) {
      const coordinate = orientation === 'horizontal' ? event.pageX : event.pageY;
      return coordinate;
    }

    function getSliderPosition() {
      if (!thumb.parentElement) {
        throw 'Thumb has no parent element';
      }
      const slider: HTMLElement = thumb.parentElement;
      return slider.getBoundingClientRect();
    }

    function moveThumbAt(coordinate: number) {
      const thumbHalfWidth: number = Number.parseInt(getComputedStyle(thumb).width) / 2;
      let startSliderPosition: number;
      let endSliderPosition: number;
      let pageOffset: number;
      let thumbProp: 'left' | 'top';

      if (orientation === 'horizontal') {
        startSliderPosition = getSliderPosition().left;
        endSliderPosition = getSliderPosition().right;
        pageOffset = pageXOffset;
        thumbProp = 'left';
      } else {
        startSliderPosition = getSliderPosition().top;
        endSliderPosition = getSliderPosition().bottom;
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

    function onMouseMove(event: any) {
      moveThumbAt(getCoordinate(event));
    }

    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
  }
}

export default Thumb;
