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
      const sliderPosition = slider.getBoundingClientRect();
      return sliderPosition;
    }

    function moveThumbAt(coordinate: number) {
      const thumbWidth: number = Number.parseInt(getComputedStyle(thumb).width);
      if (orientation === 'horizontal') {
        thumb.style.left = `${coordinate - getSliderPosition().x - pageXOffset - thumbWidth / 2}px`;
      } else {
        thumb.style.top = `${coordinate - getSliderPosition().y - pageYOffset - thumbWidth / 2}px`;
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
