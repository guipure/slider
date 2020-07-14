import { Thumb } from './Thumb';

class ThumbLabel {
  private element: HTMLElement;

  constructor(private thumb: Thumb, orientation: string, private hide_from_to: boolean) {
    this.element = this.createLabel(orientation);
    this.init(thumb);
  }

  private init(thumb: Thumb): void {
    this.update();
    thumb.element.append(this.element);
    this.update = this.update.bind(this);
    thumb.events.subscribe('thumbMove', this.update);
    thumb.events.subscribe('thumbUpdate', this.update);
  }

  private createLabel(orientation: string): HTMLElement {
    const element = document.createElement('div');
    element.className = `thumb-label thumb-label_${orientation}`;
    return element;
  }

  private update() {
    this.element.innerHTML = this.thumb.getCurrentValue().toString();

    if (this.hide_from_to) {
      this.element.style.display = 'none';
    } else {
      this.element.style.display = 'block';
    }
  }
}

export { ThumbLabel };
