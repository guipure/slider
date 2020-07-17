import { EventManager } from '../EventManager/EventManager';
import { Options } from '../Presenter/Options';

class Settings {
  public events: EventManager;

  private form: HTMLFormElement;

  constructor(private anchor: HTMLElement, public state: Options) {
    this.events = new EventManager();
    this.form = this.createFrom();
    this.createSettings();
    this.initValues();
  }

  public updateFromTo(newSetting: any) {
    this.state = { ...this.state, ...newSetting };
    this.initValues();
  }

  private createFrom(): HTMLFormElement {
    const form = document.createElement('form');
    form.className = 'settings';
    this.anchor.append(form);
    return form;
  }

  private createSettings() {
    const settingsTemplate = `
    <label class="settings__label">
      <p class="settings__name">min</p>
      <input class="settings__input" type="number" name="min">
    </label>

    <label class="settings__label">
      <p class="settings__name">max</p>
      <input class="settings__input" type="number" name="max">
    </label>

    <label class="settings__label">
      <p class="settings__name">step</p>
      <input class="settings__input" type="number" name="step">
    </label>

    <label class="settings__label">
      <p class="settings__name">from</p>
      <input class="settings__input" type="number" name="from">
    </label>

    <label class="settings__label">
      <p class="settings__name">to</p>
      <input class="settings__input" type="number" name="to">
    </label>

    <label class="settings__label">
      <p class="settings__name">orientation</p>
      <label>
        horizontal
        <input class="settings__input" type="radio" name="orientation" value="horizontal">
      </label>
      <label>
        vertical
        <input class="settings__input" type="radio" name="orientation" value="vertical">
      </label>
    </label>
    
    <label class="settings__label">
      <p class="settings__name">type</p>
      <label>
        single
        <input class="settings__input" type="radio" name="type" value="single">
      </label>
      <label>
        double
        <input class="settings__input" type="radio" name="type" value="double">
      </label>
    </label>

    <label class="settings__label">
      <p class="settings__name">hide_from_to</p>
      <select name="hide_from_to">
        <option value="true">true</option>
        <option value="false">false</option>
      </select>
    </label>

    <label class="settings__label">
      <p class="settings__name">hide_scale</p>
      <select name="hide_scale">
        <option value="true">true</option>
        <option value="false">false</option>
      </select>
    </label>
    `;

    this.form.insertAdjacentHTML('beforeend', settingsTemplate);
  }

  private initValues() {
    const inputs = this.form.querySelectorAll('input');
    const selects = this.form.querySelectorAll('select');
    inputs.forEach((input: HTMLInputElement) => {
      switch (input.name) {
        case 'min':
          input.onchange = () => this.setState({ min: Number(input.value) });
          input.value = this.state.min.toString();
          break;
        case 'max':
          input.onchange = () => this.setState({ max: Number(input.value) });
          input.value = this.state.max.toString();
          break;
        case 'step':
          input.onchange = () => this.setStep(Number(input.value));
          input.value = this.state.step.toString();
          break;
        case 'from':
          input.onchange = () => this.onChangeFrom(Number(input.value));
          input.value = this.state.from.toString();
          break;
        case 'to':
          input.onchange = () => this.onChangeTo(Number(input.value));
          input.value = this.state.to.toString();
          break;
        case 'orientation':
          input.onchange = () => this.setState({ orientation: input.value });
          if (input.value === 'horizontal') {
            if (this.state.orientation === 'horizontal') {
              input.checked = true;
            }
          } else if (this.state.orientation === 'vertical') {
            input.checked = true;
          }
          break;
        case 'type':
          input.onchange = () => this.setState({ type: input.value });
          if (input.value === 'single') {
            if (this.state.type === 'single') {
              input.checked = true;
            }
          } else if (this.state.type === 'double') {
            input.checked = true;
          }
          break;
        // no default
      }

      selects.forEach((select: HTMLSelectElement) => {
        switch (select.name) {
          case 'hide_from_to':
            select.onchange = () => this.setState({ hide_from_to: select.value === 'true' });
            select.value = this.state.hide_from_to.toString();
            break;
          case 'hide_scale':
            select.onchange = () => this.setState({ hide_scale: select.value === 'true' });
            select.value = this.state.hide_scale.toString();
          // no default
        }
      });
    });
  }

  private setState(newSetting: any) {
    newSetting = this.checkMinMax(newSetting);
    this.state = { ...this.state, ...newSetting };
    this.events.notify('newSettings', this.state);
  }

  private checkMinMax(setting: any) {
    const { max, min } = setting;

    if (max) {
      if (max < this.state.min) {
        return { min: max };
      }
    } else if (min) {
      if (min > this.state.max) {
        return { max: min };
      }
    }

    return setting;
  }

  private setStep(num: number): void {
    const step = num > 1 ? Math.round(num) : 1;
    this.setState({ step });
  }

  private onChangeFrom(num: number): void {
    const { min } = this.state;
    const isValid = num >= min;
    const from = isValid ? num : min;
    this.setState({ from });
  }

  private onChangeTo(num: number): void {
    const { max } = this.state;
    const isValid = num <= max;
    const to = isValid ? num : max;
    this.setState({ to });
  }
}

export { Settings };
