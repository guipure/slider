import { View } from '../View/View';

abstract class Component {
  protected element: HTMLElement;

  constructor(protected slider: View) {
    this.element = this.create();
    this.init();
  }

  public getElement() {
    return this.element;
  }

  protected abstract create (): HTMLElement;

  protected abstract init (): void;
}

export { Component };
