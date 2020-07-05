import { ViewOptions } from '../Presenter/Options';
import Slider from './Slider';

class Track {
  constructor(private slider: Slider, private options: ViewOptions) {
    const track = this.createTrack();
    slider.element.append(track);
  }

  private createTrack() {
    const track = document.createElement('div');
    track.className = `track track-${this.options.orientation}`;
    track.addEventListener('click', this.onClick);
    return track;
  }

  private onClick() {
    console.log('clicked')
  }
}

export default Track;
