import { Thumb } from './Thumb';
import { Orientation } from '../Presenter/Options';

class ThumbLabel {
  private element: HTMLElement;

  constructor(private thumb: Thumb, orientation: Orientation, private hide_from_to: boolean) {
    this.element = this.createLabel(orientation);
    this.init(thumb);
  }

  private init(thumb: Thumb): void {
    this.update();
    thumb.element.append(this.element);
    thumb.events.subscribe('thumbMove', this.update.bind(this));
  }

  private createLabel(orientation: Orientation): HTMLElement {
    const element = document.createElement('div');
    element.className = `thumb-label thumb-label_${orientation}`;
    return element;
  }

  private update() {
    this.element.innerHTML = this.thumb.currentValue.toString();

    if (this.hide_from_to) {
      this.element.style.display = 'none';
    } else {
      this.element.style.display = 'block';
    }
  }
}

export { ThumbLabel };
