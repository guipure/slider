import { Thumb } from './Thumb';
import { Orientation } from '../Presenter/Options';

class ThumbLabel {
  private element: HTMLElement;

  constructor(private thumb: Thumb, private orientation: Orientation, private hide_from_to: boolean) {
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
    this.element.style.opacity = '1';

    if (this.doCollapse()) {
      this.uniteLabels();
    }

    if (this.hide_from_to) {
      this.element.style.display = 'none';
    } else {
      this.element.style.display = 'block';
    }
  }

  private doCollapse(): boolean {
    if (this.element.style.display === 'none') return false;
    const slider = this.thumb.element.parentElement as HTMLElement;
    const labels = slider.querySelectorAll('.thumb-label');
    if (labels.length < 2) return false;
    const firstLabel = labels[0] as HTMLElement;
    const secondLabel = labels[1] as HTMLElement;
    const start = this.orientation === 'vertical' ? 'top' : 'left';
    const end = this.orientation === 'vertical' ? 'bottom' : 'right';
    const firstLabelStart = firstLabel.getBoundingClientRect()[start];
    const firstLabelEnd = firstLabel.getBoundingClientRect()[end];
    const secondLabelStart = secondLabel.getBoundingClientRect()[start];
    const secondLabelEnd = secondLabel.getBoundingClientRect()[end];

    if (firstLabelStart === secondLabelStart && firstLabelEnd === secondLabelEnd) {
      return false;
    }

    if (firstLabelStart <= secondLabelEnd && secondLabelStart <= firstLabelEnd) {
      return true;
    }

    if (secondLabelStart <= firstLabelEnd && firstLabelStart <= secondLabelEnd) {
      return true;
    }

    return false;
  }

  private uniteLabels(): void {
    if (this.element.style.display === 'none') return;
    const slider = this.thumb.element.parentElement as HTMLElement;
    const labels = slider.querySelectorAll('.thumb-label');
    if (labels.length < 2) return;
    const firstLabel = labels[0] as HTMLElement;
    const secondLabel = labels[1] as HTMLElement;
    const firstValue: number = Number.parseInt(firstLabel.innerHTML, 10);
    const secondValue: number = Number.parseInt(secondLabel.innerHTML, 10);
    firstLabel.innerHTML = `${firstValue} — ${secondValue}`;
    secondLabel.style.opacity = '0';
  }
}

export { ThumbLabel };
