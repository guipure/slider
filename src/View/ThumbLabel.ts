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
    thumb.events.subscribe('changedHideFromTo', this.setHideFromTo.bind(this));
  }

  private createLabel(orientation: Orientation): HTMLElement {
    const element = document.createElement('div');
    element.className = `thumb-label thumb-label_${orientation}`;
    return element;
  }

  private setHideFromTo(state: { hide_from_to: boolean }): void {
    if (state.hide_from_to !== this.hide_from_to) {
      this.hide_from_to = state.hide_from_to;
      this.update();
    }
  }

  private update(): void {
    this.element.innerHTML = this.thumb.currentValue.toString();

    if (this.hide_from_to) {
      this.element.style.display = 'none';
    } else {
      this.element.style.display = 'block';
    }
  }
}

export { ThumbLabel };
