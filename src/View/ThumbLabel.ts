import Thumb from './Thumb';
import View from './View';

class ThumbLabel {
  private element: HTMLElement

  constructor(private thumb: Thumb, private slider: View) {
    this.element = document.createElement('span');
    this.element.className = 'thumb-label';
    this.update();
    thumb.element.append(this.element);
    this.update = this.update.bind(this);
    thumb.events.subscribe('thumbMove', this.update);
    thumb.events.subscribe('thumbUpdate', this.update);
  }

  private update() {
    this.element.innerHTML = this.thumb.getPosition().toString();
  }
}

export { ThumbLabel };
