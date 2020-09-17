import { View } from '../View/View';

abstract class Component {
  public element: HTMLElement;

  constructor(public slider: View) {
    this.element = this.create();
    this.init();
  }

  protected abstract create (): HTMLElement;

  protected abstract init (): void;
}

export { Component };
