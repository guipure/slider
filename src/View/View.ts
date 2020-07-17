import { ViewOptions, ViewState, Orientation } from '../Presenter/Options';
import { Track } from './Track';
import { Thumb } from './Thumb';
import { EventManager } from '../EventManager/EventManager';
import { Scale } from './Scale';

class View {
  public state: ViewState;

  public events: EventManager;

  public element: HTMLElement = document.body;

  constructor(private anchor: HTMLElement, options: ViewOptions, values: number[]) {
    this.events = new EventManager();
    this.element = this.createSlider();
    this.state = this.init(options, values);
    this.createSliderElements();
    this.setState = this.setState.bind(this);
  }

  public setState(newState: any) {
    const prevOrientation: Orientation = this.state.orientation;
    const newOrientation: Orientation = newState.orientation;
    const isOrientationChanged: boolean = newOrientation && prevOrientation !== newOrientation;
    const updatedState: ViewState = { ...this.state, ...newState };
    const correctedFromAndTo: { from: number, to: number } = this.correctFromAndTo(updatedState);
    const { orientation, values } = updatedState;
    const pxValues: number[] = this.createPxValues(orientation, values);
    this.state = { ...updatedState, ...correctedFromAndTo, pxValues };

    if (isOrientationChanged) {
      this.element.remove();
      this.element = this.createSlider();
      this.createSliderElements();
    }

    this.events.notify('newViewState', this.state);
  }

  public getThumbsPositions(): number[] {
    const thumbs = this.element.querySelectorAll('.thumb');

    const calculatePosition = (element: any): number => {
      const prop: 'left' | 'top' = this.state.orientation === 'horizontal' ? 'left' : 'top';
      return element.getBoundingClientRect()[prop] + element.getBoundingClientRect().width;
    };

    const thumbsPositions: number[] = [calculatePosition(thumbs[0]), calculatePosition(thumbs[1])];
    return thumbsPositions.sort((a, b) => a - b);
  }

  public getSliderPosition() {
    const prop: 'left' | 'top' = this.state.orientation === 'horizontal' ? 'left' : 'top';
    return this.element.getBoundingClientRect()[prop];
  }

  private init(options: ViewOptions, values: number[]): ViewState {
    const pxValues: number[] = this.createPxValues(options.orientation, values);
    const correctedFromAndTo = this.correctFromAndTo({ ...options, values } as ViewState);
    return { ...options, values, pxValues, ...correctedFromAndTo };
  }

  private createSlider(): HTMLElement {
    const element: HTMLElement = document.createElement('div');
    element.className = 'slider';
    element.addEventListener('trackclick', this.onTrackClick.bind(this));
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

  private correctFromAndTo(state: ViewState): { from: number, to: number } {
    const {
      from, to, type, values,
    } = state;
    let correctedFrom: number = from;
    let correctedTo: number = to;

    if (to < from && type !== 'single') {
      [correctedTo, correctedFrom] = [from, to];
    }

    if (to === from && type !== 'single') {
      const index: number = values.findIndex((val) => val === to);
      if (index + 1 < values.length) {
        correctedTo = values[index + 1];
      } else if (index > 0) {
        correctedFrom = values[index - 1];
      }
    }

    return { from: correctedFrom, to: correctedTo };
  }

  private onTrackClick(event: any): void {
    let coordinate: number;

    if (this.state.orientation === 'horizontal') {
      coordinate = event.detail.clientX;
    } else {
      coordinate = event.detail.clientY;
    }

    this.setFromTo(coordinate);
  }

  private onScaleClick(event: any): void {
    const { value } = event.detail;
    this.setFromTo(value, undefined, true);
  }

  private setFromTo(coordinate: number, side?: 'from' | 'to', isValue?: boolean): void {
    const value: number = isValue ? coordinate : this.convertPxToValue(coordinate);
    const fromDistance: number = Math.abs(this.state.from - value);
    const toDistance: number = Math.abs(this.state.to - value);

    if (this.state.type === 'single') {
      if (fromDistance) {
        this.setState({ from: value });
        return;
      }
    }

    if (fromDistance * toDistance === 0) return;

    if (!side) {
      side = (fromDistance < toDistance) ? 'from' : 'to';
    }

    if (side === 'from') {
      if (this.state.to > value) {
        this.setState({ from: value });
      }
    } else if (this.state.from < value) {
      this.setState({ to: value });
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
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
  }

  private convertPxToValue(coordinate: number): number {
    const { orientation, values } = this.state;
    const pxStep: number = this.getPxStep(orientation, values);
    const min: number = values[0];
    const step: number = values[1] - min;
    const max: number = values[values.length - 1];
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

  private createPxValues(
    orientation: Orientation,
    values: number[],
  ): number[] {
    const pxValues: number[] = [];
    const pxStep: number = this.getPxStep(orientation, values);
    let pxValue: number = 0;

    while (pxValues.length < values.length) {
      pxValues.push(pxValue);
      pxValue += pxStep;
    }

    return pxValues;
  }

  private getSliderSize(orientation: Orientation): number {
    const sliderPosition: DOMRect = this.element.getBoundingClientRect();

    if (orientation === 'horizontal') {
      return sliderPosition.width;
    }

    return sliderPosition.height;
  }

  private getPxStep(orientation: Orientation, values: number[]): number {
    return this.getSliderSize(orientation) / (values.length - 1);
  }
}

export { View };
