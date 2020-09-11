/* eslint-disable no-new */
import { ViewOptions, ViewState, Orientation } from '../../interfaces/interfaces';
import { sliderOrientation, sliderType } from '../../interfaces/constants';
import { Observable } from '../../Observable/Observable';
import { Track } from '../Track/Track';
import { Thumb } from '../Thumb/Thumb';
import { Scale } from '../Scale/Scale';

class View {
  public state: ViewState;

  public events: Observable;

  public element: HTMLElement = document.body;

  constructor(private anchor: HTMLElement, options: ViewOptions) {
    this.events = new Observable();
    this.element = this.createSlider();
    this.state = this.init(options);

    this.createSliderElements();
  }

  public setState(newState: any) {
    const updatedState: ViewState = { ...this.state, ...newState };

    const { orientation } = updatedState;
    const pxStep: number = this.getPxStep(updatedState);
    const pxMax: number = this.getSliderSize(orientation);

    const isOrientationChanged: boolean = this.isOrientationChanged(newState.orientation);

    this.state = {
      ...updatedState, pxStep, pxMax,
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isOrientationChanged && this.repaintSlider();

    this.events.notify('newViewState', this.state);
  }

  public getThumbsPositions(): number[] {
    const thumbs = this.element.querySelectorAll('.slider__thumb');

    const calculatePosition = (element: any): number => {
      const side: 'left' | 'top' = this.state.orientation === sliderOrientation.HORIZONTAL ? 'left' : 'top';
      const width: number = Number.parseInt(getComputedStyle(element).width, 10);

      return element.getBoundingClientRect()[side] + width / 2;
    };

    const thumbsPositions: number[] = [calculatePosition(thumbs[0]), calculatePosition(thumbs[1])];

    return thumbsPositions.sort((a, b) => a - b);
  }

  public getSliderPosition() {
    const side: 'left' | 'top' = this.state.orientation === sliderOrientation.HORIZONTAL ? 'left' : 'top';
    return this.element.getBoundingClientRect()[side];
  }

  public convertPxToPercent(value: number) {
    return (value * 100) / this.getSliderSize(this.state.orientation);
  }

  private init(options: ViewOptions): ViewState {
    const pxStep: number = this.getPxStep(options);
    const pxMax: number = this.getSliderSize(options.orientation);
    return {
      ...options, pxStep, pxMax,
    };
  }

  private createSlider(): HTMLElement {
    const element: HTMLElement = document.createElement('div');
    element.className = 'slider';

    this.addEventListeners(element);
    this.anchor.prepend(element);

    return element;
  }

  private addEventListeners(element: HTMLElement) {
    element.addEventListener('click', this.onTrackClick.bind(this));
    element.addEventListener('scaleclick', this.onScaleClick.bind(this));
    element.addEventListener('mousedown', this.onThumbMouseDown.bind(this));
  }

  private createSliderElements(): void {
    new Thumb(this);
    new Thumb(this);
    new Track(this);
    new Scale(this);
  }

  private repaintSlider(): void {
    this.element.remove();
    this.element = this.createSlider();
    this.createSliderElements();
  }

  private isOrientationChanged(newOrientation: Orientation): boolean {
    if (!newOrientation) return false;
    return newOrientation !== this.state.orientation;
  }

  private onTrackClick(event: any): void {
    const target = event.target as HTMLElement;

    if (!/track|bar/.test(target.className)) return;

    const coordinate: number = this.state.orientation === sliderOrientation.HORIZONTAL
      ? event.clientX
      : event.clientY;

    this.setFromTo(this.convertPxToValue(coordinate));
  }

  private onScaleClick(event: any): void {
    const { value } = event.detail;
    this.setFromTo(value);
  }

  private setFromTo(value: number, side?: 'from' | 'to'): void {
    const { from, to } = this.state;
    const fromDistance: number = Math.abs(from - value);
    const toDistance: number = Math.abs(to - value);

    if (this.state.type === sliderType.SINGLE) {
      if (fromDistance) {
        this.setState({ from: value });
        this.events.notify('newFromTo', { from: value });
        return;
      }
    }

    if (fromDistance * toDistance === 0) return;

    if (!side) {
      side = (fromDistance < toDistance) ? 'from' : 'to';
    }

    if (side === 'from') {
      if (to > value) {
        this.setState({ from: value });
        this.events.notify('newFromTo', { from: value });
      }
    } else if (from < value) {
      this.setState({ to: value });
      this.events.notify('newFromTo', { to: value });
    }
  }

  private isFromOrTo(coordinate: number): 'from' | 'to' {
    const thumbsPositions: number[] = this.getThumbsPositions();
    const fromDistancePx: number = Math.abs(thumbsPositions[0] - coordinate);
    const toDistancePx: number = Math.abs(thumbsPositions[1] - coordinate);

    return (fromDistancePx < toDistancePx) ? 'from' : 'to';
  }

  private onThumbMouseDown(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (!/thumb/.test(target.className)) return;

    target.classList.add('slider__thumb_large');
    const isHorizontal: boolean = this.state.orientation === sliderOrientation.HORIZONTAL;
    const axis: 'clientX' | 'clientY' = isHorizontal ? 'clientX' : 'clientY';
    const coordinate: number = event[axis];

    const side = this.isFromOrTo(coordinate);
    const value = this.convertPxToValue(coordinate);
    this.setFromTo(value, side);

    const onMouseMove = (moveEvent: MouseEvent) => {
      const mouseValue = this.convertPxToValue(moveEvent[axis]);
      this.setFromTo(mouseValue, side);
    };

    const onMouseUp = () => {
      target.classList.remove('slider__thumb_large');
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  private convertPxToValue(coordinate: number): number {
    const {
      orientation, min, max, step,
    } = this.state;
    const pxStep: number = this.getPxStep(this.state);
    const sliderStart: number = this.getSliderPosition();
    const px: number = coordinate - sliderStart;

    if (px > this.getSliderSize(orientation)) {
      return max;
    }

    if (px < 0) {
      return min;
    }

    const value = Math.round(px / pxStep) * step + min;
    return value;
  }

  private getSliderSize(orientation: Orientation): number {
    const sliderPosition: DOMRect = this.element.getBoundingClientRect();

    return orientation === sliderOrientation.HORIZONTAL
      ? sliderPosition.width
      : sliderPosition.height;
  }

  private getPxStep(options: any): number {
    const {
      min, max, step, orientation,
    } = options;
    const quantity = Math.ceil((max - min) / step);

    return this.getSliderSize(orientation) / quantity;
  }
}

export { View };
