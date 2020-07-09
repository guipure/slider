import Thumb from './Thumb';
import View from './View';

class ThumbLabel {
  private element: HTMLElement

  constructor(private thumb: Thumb, private slider: View) {
    this.element = document.createElement('div');
    this.element.className = `thumb-label thumb-label_${slider.state.orientation}`;
    this.update();
    thumb.element.append(this.element);
    this.update = this.update.bind(this);
    thumb.events.subscribe('thumbMove', this.update);
    thumb.events.subscribe('thumbUpdate', this.update);
  }

  private update() {
    this.element.innerHTML = this.thumb.getPosition().toString();

    if (this.slider.state.hide_from_to) {
      this.element.style.display = 'none';
    } else {
      this.element.style.display = 'block';
    }
  }
}

export { ThumbLabel };
