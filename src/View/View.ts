import { ViewOptions, ViewState, Values, Orientation } from '../Presenter/Options';
import { Track } from './Track';
import { Thumb } from './Thumb';
import { EventManager } from '../EventManager/EventManager';
import { Scale } from './Scale';

class View {
  public state: ViewState;

  public events: EventManager;

  public element: HTMLElement = document.body;

  constructor(private anchor: HTMLElement, options: ViewOptions, values: Values, from: number, to: number) {
    this.events = new EventManager();
    this.element = this.createSlider();
    this.state = this.init(options, values, from, to);
    this.createSliderElements();
    this.setState = this.setState.bind(this);
  }

  public setState(newState: any) {
    const prevOrientation: Orientation = this.state.orientation;
    const newOrientation: Orientation = newState.orientation;
    const isOrientationChanged: boolean = newOrientation && prevOrientation !== newOrientation;
    const updatedState: ViewState = { ...this.state, ...newState };
    const { orientation, values } = updatedState;
    const pxStep: number = this.getPxStep(orientation, values);
    const pxMax: number = this.getSliderSize(orientation);
    this.state = {
      ...updatedState, pxStep, pxMax,
    };

    if (isOrientationChanged) {
      this.element.remove();
      this.element = this.createSlider();
      this.createSliderElements();
    }

    this.events.notify('newViewState', this.state);
  }

  public getThumbsPositions(): number[] {
    const thumbs = this.element.querySelectorAll('.slider__thumb');

    const calculatePosition = (element: any): number => {
      const prop: 'left' | 'top' = this.state.orientation === 'horizontal' ? 'left' : 'top';
      const width: number = Number.parseInt(getComputedStyle(element).width, 10);
      return element.getBoundingClientRect()[prop] + width / 2;
    };

    const thumbsPositions: number[] = [calculatePosition(thumbs[0]), calculatePosition(thumbs[1])];
    return thumbsPositions.sort((a, b) => a - b);
  }

  public getSliderPosition() {
    const prop: 'left' | 'top' = this.state.orientation === 'horizontal' ? 'left' : 'top';
    return this.element.getBoundingClientRect()[prop];
  }

  public convertPxToPercent(value: number) {
    return (value * 100) / this.getSliderSize(this.state.orientation);
  }

  private init(options: ViewOptions, values: Values, from: number, to: number): ViewState {
    const pxStep: number = this.getPxStep(options.orientation, values);
    const pxMax: number = this.getSliderSize(options.orientation);
    return {
      ...options, values, from, to, pxStep, pxMax,
    };
  }

  private createSlider(): HTMLElement {
    const element: HTMLElement = document.createElement('div');
    element.className = 'slider';
    element.addEventListener('click', this.onTrackClick.bind(this));
    element.addEventListener('scaleclick', this.onScaleClick.bind(this));
    element.addEventListener('mousedown', this.onThumbMouseDown.bind(this));
    this.anchor.prepend(element);
    return element;
  }

  private createSliderElements(): void {
    const thumb: Thumb = new Thumb(this);
    const otherThumb: Thumb = new Thumb(this);
    const track: Track = new Track(this);
    const scale: Scale = new Scale(this);
  }

  private onTrackClick(event: any): void {
    const target = event.target as HTMLElement;
    if (!/track|bar/.test(target.className)) return;
    let coordinate: number;

    if (this.state.orientation === 'horizontal') {
      coordinate = event.clientX;
    } else {
      coordinate = event.clientY;
    }

    this.setFromTo(coordinate);
  }

  private onScaleClick(event: any): void {
    const { value } = event.detail;
    this.setFromTo(value, undefined, true);
  }

  private setFromTo(coordinate: number, side?: 'from' | 'to', isValue?: boolean): void {
    const value: number = isValue ? coordinate : this.convertPxToValue(coordinate);
    const { from, to } = this.state;
    const fromDistance: number = Math.abs(from - value);
    const toDistance: number = Math.abs(to - value);

    if (this.state.type === 'single') {
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
    const isHorizontal: boolean = this.state.orientation === 'horizontal';
    const axis: 'clientX' | 'clientY' = isHorizontal ? 'clientX' : 'clientY';

    const side = this.isFromOrTo(event[axis]);
    this.setFromTo(event[axis], side);

    const onMouseMove = (moveEvent: MouseEvent) => {
      this.setFromTo(moveEvent[axis], side);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    function onMouseUp() {
      target.classList.remove('slider__thumb_large');
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
  }

  private convertPxToValue(coordinate: number): number {
    const { orientation, values } = this.state;
    const pxStep: number = this.getPxStep(orientation, values);
    const { min, max, step } = values;
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

    if (orientation === 'horizontal') {
      return sliderPosition.width;
    }

    return sliderPosition.height;
  }

  private getPxStep(orientation: Orientation, values: Values): number {
    const { min, max, step } = values;
    const quantity = Math.ceil((max - min) / step);
    return this.getSliderSize(orientation) / quantity;
  }
}

export { View };
