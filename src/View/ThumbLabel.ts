import Thumb from "./Thumb";

class ThumbLabel {
  private element: HTMLElement

  constructor(private thumb: Thumb) {
    this.element = document.createElement('span');
    this.element.className = 'thumb-label';
    this.update();
    thumb.element.append(this.element);
    thumb.events.subscribe('thumbMove', this.update.bind(this));
  }

  private update() {
    this.element.innerHTML = this.thumb.getPosition().toString();
  }
}

export { ThumbLabel };