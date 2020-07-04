import { ViewOptions } from '../Presenter/Options';

class Track {
  constructor(anchor: HTMLElement, private options: ViewOptions) {
    const track = `<div class="track track-${options.orientation}"></div>`;
    const slider = anchor.querySelector('.slider');
    slider && slider.insertAdjacentHTML('beforeend', track);
  }
}

export default Track;
