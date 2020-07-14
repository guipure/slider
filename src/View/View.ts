import { ViewOptions, ViewState } from '../Presenter/Options';
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
    this.state = this.init(this.element, options, values);
    this.createSliderElements();
    this.setState = this.setState.bind(this);
  }

  public setState(newState: any) {
    const prevOrientation = this.state.orientation;
    const newOrientation = newState.orientation;
    const isOrientationChanged: boolean = newOrientation && prevOrientation !== newOrientation;
    const updatedState = { ...this.state, ...newState };
    const correctedFromAndTo: { from: number, to: number } = this.correctFromAndTo(updatedState);
    const { orientation, values } = updatedState;
    const pxValues = this.createPxValues(this.element, orientation, values);
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

  private init(anchor: HTMLElement, options: ViewOptions, values: number[]): ViewState {
    const pxValues = this.createPxValues(anchor, options.orientation, values);
    return { ...options, values, pxValues };
  }

  private createSlider(): HTMLElement {
    const element = document.createElement('div');
    element.className = 'slider';
    element.addEventListener('trackclick', this.onTrackClick.bind(this));
    element.addEventListener('scaleclick', this.onScaleClick.bind(this));
    element.addEventListener('thumbmousedown', this.onThumbMouseDown.bind(this));
    this.anchor.prepend(element);
    return element;
  }

  private createSliderElements(): void {
    const thumb = new Thumb(this);
    const otherThumb = new Thumb(this);
    const track = new Track(this);
    const scale = new Scale(this);
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
      const index = values.findIndex((val) => val === to);
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
    const value = isValue ? coordinate : this.convertPxToValue(coordinate);
    const fromDistance = Math.abs(this.state.from - value);
    const toDistance = Math.abs(this.state.to - value);

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
    const thumbsPositions = this.getThumbsPositions();
    const fromDistancePx = Math.abs(thumbsPositions[0] - coordinate);
    const toDistancePx = Math.abs(thumbsPositions[1] - coordinate);

    return (fromDistancePx < toDistancePx) ? 'from' : 'to';
  }

  private onThumbMouseDown(event: any): void {
    const isHorizontal = this.state.orientation === 'horizontal';
    const axis: 'clientX' | 'clientY' = isHorizontal ? 'clientX' : 'clientY';

    const side = this.isFromOrTo(event.detail[axis]);
    this.setFromTo(event.detail[axis], side);

    const onMouseMove = (moveEvent: any) => {
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
    const sliderStart = this.getSliderPosition();
    const index = this.closestIndex(this.state.pxValues, coordinate - sliderStart);
    return this.state.values[index];
  }

  private closestIndex(array: number[], value: number) {
    const diffArray = array.map((x) => Math.abs(x - value));
    const minDiff = Math.min(...diffArray);
    return diffArray.findIndex((x) => x === minDiff);
  }

  private createPxValues(slider: HTMLElement, orientation: string, values: number[]): number[] {
    const sliderPosition = slider.getBoundingClientRect();
    let sliderLength;

    if (orientation === 'horizontal') {
      sliderLength = sliderPosition.width;
    } else {
      sliderLength = sliderPosition.height;
    }

    const pxValues = [];
    const pxStep = sliderLength / (values.length - 1);
    let pxValue = 0;

    while (pxValues.length < values.length) {
      pxValues.push(pxValue);
      pxValue += pxStep;
    }

    return pxValues;
  }
}

export { View };
