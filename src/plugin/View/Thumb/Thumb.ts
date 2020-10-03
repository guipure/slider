import bind from 'bind-decorator';

import { ViewState, Orientation, SliderType } from '../../interfaces/interfaces';
import { sliderOrientation, sliderType } from '../../interfaces/constants';
import { Component } from '../Component/Component';
import { View } from '../View/View';

class Thumb extends Component {
  private currentValue: number = 0;

  private label: HTMLElement;

  constructor(slider: View) {
    super(slider);
    this.label = this.createLabel();
    this.initLabel();
  }

  protected init(): void {
    this.slider.events.subscribe('newViewState', this.updateThumb);
  }

  protected create(): HTMLElement {
    const thumb = document.createElement('div');
    const doesOtherThumbExist = !!this.slider.element.querySelector('.slider__thumb');
    const thumbNumber: 'first' | 'second' = doesOtherThumbExist ? 'second' : 'first';

    thumb.className = `slider__thumb slider__thumb_${this.slider.state.orientation} slider__thumb_${thumbNumber}`;

    const handleDragStart = (event: Event) => event.preventDefault();
    thumb.addEventListener('dragstart', handleDragStart);
    this.slider.element.append(thumb);

    return thumb;
  }

  @bind
  private updateThumb(newState: ViewState): void {
    this.toggleThumb(newState.type);
    this.placeThumb(newState.from, newState.to);
    this.setHideFromTo(newState.hideFromTo);
  }

  private toggleThumb(type: SliderType): void {
    if (!this.element.classList.contains('slider__thumb_second')) return;

    type === sliderType.SINGLE
      ? this.hideThumb()
      : this.showThumb();
  }

  private placeThumb(from: number, to: number): void {
    if (this.element.classList.contains('slider__thumb_first')) {
      this.currentValue = from;
      this.moveThumbAtValue(from);
    } else {
      this.currentValue = to;
      this.moveThumbAtValue(to);
    }
  }

  private moveThumbAtValue(value: number): void {
    const { orientation } = this.slider.state;
    const coordinate = this.convertValueToPx(value);
    const side: 'left' | 'bottom' = this.getSide(orientation);
    const position: number = this.slider.convertPxToPercent(coordinate);

    this.element.style[side] = `${position}%`;
    this.updateLabel();
  }

  private convertValueToPx(value: number): number {
    const {
      min,
      max,
      step,
      pxMax,
      pxStep,
    } = this.slider.state;

    if (value === max) return pxMax;

    const pxValue = Math.round((value - min) / step) * pxStep;
    return pxValue;
  }

  private showThumb(): void {
    this.element.style.display = '';
  }

  private hideThumb(): void {
    this.element.style.display = 'none';
  }

  private getSide(orientation: Orientation): 'left' | 'bottom' {
    return orientation === sliderOrientation.HORIZONTAL ? 'left' : 'bottom';
  }

  private createLabel(): HTMLElement {
    const { orientation } = this.slider.state;
    const label = document.createElement('div');
    label.className = `slider__thumb-label slider__thumb-label_${orientation}`;

    return label;
  }

  private initLabel() {
    this.updateThumb(this.slider.state);
    this.updateLabel();
    this.element.append(this.label);
  }

  private setHideFromTo(hideFromTo: boolean): void {
    this.label.style.display = hideFromTo ? 'none' : '';
  }

  private updateLabel(): void {
    this.label.innerHTML = this.currentValue.toString();
    this.label.style.opacity = '1';

    this.doLabelsCollide() && this.uniteLabels();
  }

  private doLabelsCollide(): boolean {
    if (this.label.style.display === 'none') return false;

    const slider = this.slider.element;
    const labels = slider.querySelectorAll('.slider__thumb-label');

    if (labels.length < 2) return false;

    const firstLabel = labels[0];
    const secondLabel = labels[1];

    const { orientation } = this.slider.state;

    const start = orientation === sliderOrientation.VERTICAL ? 'bottom' : 'left';
    const end = orientation === sliderOrientation.VERTICAL ? 'bottom' : 'right';

    const firstLabelStart = firstLabel.getBoundingClientRect()[start];
    const firstLabelEnd = firstLabel.getBoundingClientRect()[end];
    const secondLabelStart = secondLabel.getBoundingClientRect()[start];
    const secondLabelEnd = secondLabel.getBoundingClientRect()[end];

    const areLabelPositionsEqual = (
      firstLabelStart === secondLabelStart && firstLabelEnd === secondLabelEnd
    );

    const doLabelPositionsOverlap = (
      (firstLabelStart <= secondLabelEnd && secondLabelStart <= firstLabelEnd)
      || (secondLabelStart <= firstLabelEnd && firstLabelStart <= secondLabelEnd)
    );

    if (areLabelPositionsEqual) return false;

    if (doLabelPositionsOverlap) return true;

    return false;
  }

  private uniteLabels(): void {
    if (this.label.style.display === 'none') return;
    if (this.getElement().classList.contains('slider__thumb_first')) return;

    const slider = this.slider.element;
    const labels = slider.querySelectorAll('.slider__thumb-label');

    if (labels.length < 2) return;

    const firstLabel = labels[0];
    const secondLabel = labels[1] as HTMLElement;

    const firstValue = Number.parseInt(firstLabel.innerHTML, 10);
    const secondValue = Number.parseInt(secondLabel.innerHTML, 10);

    firstLabel.innerHTML = `${firstValue} — ${secondValue}`;
    secondLabel.style.opacity = '0';
  }
}

export { Thumb };
