import { Orientation } from '../interfaces/interfaces';
import { Thumb } from './Thumb';

class ThumbLabel {
  private element: HTMLElement;

  constructor(private thumb: Thumb, private orientation: Orientation, private hideFromTo: boolean) {
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
    element.className = `slider__thumb-label slider__thumb-label_${orientation}`;

    return element;
  }

  private setHideFromTo(state: { hideFromTo: boolean }): void {
    if (state.hideFromTo !== this.hideFromTo) {
      this.hideFromTo = state.hideFromTo;
      this.update();
    }
  }

  private update(): void {
    this.element.innerHTML = this.thumb.currentValue.toString();
    this.element.style.opacity = '1';

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.doCollide() && this.uniteLabels();

    this.element.style.display = this.hideFromTo ? 'none' : 'block';
  }

  private doCollide(): boolean {
    if (this.element.style.display === 'none') return false;

    const slider = this.thumb.element.parentElement as HTMLElement;
    const labels = slider.querySelectorAll('.slider__thumb-label');

    if (labels.length < 2) return false;

    const firstLabel = labels[0] as HTMLElement;
    const secondLabel = labels[1] as HTMLElement;

    const start = this.orientation === 'vertical' ? 'top' : 'left';
    const end = this.orientation === 'vertical' ? 'bottom' : 'right';

    const firstLabelStart = firstLabel.getBoundingClientRect()[start];
    const firstLabelEnd = firstLabel.getBoundingClientRect()[end];
    const secondLabelStart = secondLabel.getBoundingClientRect()[start];
    const secondLabelEnd = secondLabel.getBoundingClientRect()[end];

    const areLabelPositionsEqual: boolean = (
      firstLabelStart === secondLabelStart && firstLabelEnd === secondLabelEnd
    );

    const doLabelPositionsOverlap: boolean = (
      (firstLabelStart <= secondLabelEnd && secondLabelStart <= firstLabelEnd)
      || (secondLabelStart <= firstLabelEnd && firstLabelStart <= secondLabelEnd)
    );

    if (areLabelPositionsEqual) {
      return false;
    }

    if (doLabelPositionsOverlap) {
      return true;
    }

    return false;
  }

  private uniteLabels(): void {
    if (this.element.style.display === 'none') return;

    const slider = this.thumb.element.parentElement as HTMLElement;
    const labels = slider.querySelectorAll('.slider__thumb-label');

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
