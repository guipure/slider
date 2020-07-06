import { ViewOptions } from "../Presenter/Options";
import Track from "./Track";
import Thumb from "./Thumb";

class Slider {
  public element: HTMLElement;
  private track: Track;
  private thumb: Thumb;
  private otherThumb?: Thumb;

  constructor(private anchor: HTMLElement, private options: ViewOptions) {
    this.element = this.createSlider();
    this.track = new Track(this, options);
    this.thumb = new Thumb(this, options);
    if (options.type === 'double') {
      this.otherThumb = new Thumb(this, options);
    }
  }

  private createSlider(): HTMLElement {
    const slider = document.createElement('div');
    slider.className = 'slider';
    slider.addEventListener('trackclick', this.onTrackClick.bind(this));
    this.anchor.append(slider);
    return slider;
  }

  private onTrackClick(event: any) {
    if (this.options.orientation === 'horizontal') {
      this.closestThumb(event.detail.clientX).moveThumbAt(event.detail.pageX);
    } else {
      this.closestThumb(event.detail.clientY).moveThumbAt(event.detail.pageY);
    }
  }

  private closestThumb(coordinate: number): Thumb {
    if (!this.otherThumb) {
      return this.thumb;
    }

    const thumbHalfWidth = this.thumb.element.getBoundingClientRect().width / 2;
    let side: 'left' | 'top' = this.options.orientation === 'horizontal' ? 'left' : 'top';
    const thumbPosition = this.thumb.element.getBoundingClientRect()[side] + thumbHalfWidth;
    const otherThumbPosition = this.otherThumb.element.getBoundingClientRect()[side] + thumbHalfWidth;
    
    if (Math.abs(thumbPosition - coordinate) < Math.abs(otherThumbPosition - coordinate)) {
      return this.thumb;
    } else {
      return this.otherThumb;
    }
  }

  public getSliderPosition() {
    return this.element.getBoundingClientRect()
  }
}

export default Slider;
