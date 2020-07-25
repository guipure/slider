import { EventManager } from '../EventManager/EventManager';
import { Options } from '../interfaces/options';

class Settings {
  public events: EventManager;

  private form: HTMLFormElement;

  constructor(private anchor: HTMLElement, public state: Options) {
    this.events = new EventManager();
    this.form = this.createForm();
    this.createSettings();
    this.initValues();
  }

  public updateFromTo(newSetting: any) {
    this.state = { ...this.state, ...newSetting };
    this.initValues();
  }

  private createForm(): HTMLFormElement {
    const form = document.createElement('form');
    form.className = 'settings';
    this.anchor.append(form);
    return form;
  }

  private createSettings() {
    const settingsTemplate = `
    <div class="settings__row">
      <p class="settings__name">min</p>
      <input class="settings__input" type="number" name="min" />
    </div>

    <div class="settings__row">
      <p class="settings__name">max</p>
      <input class="settings__input" type="number" name="max" />
    </div>

    <div class="settings__row">
      <p class="settings__name">step</p>
      <input class="settings__input" type="number" name="step" />
    </div>

    <div class="settings__row">
      <p class="settings__name">from</p>
      <input class="settings__input" type="number" name="from" />
    </div>

    <div class="settings__row">
      <p class="settings__name">to</p>
      <input class="settings__input" type="number" name="to" />
    </div>

    <div class="settings__row">
      <p class="settings__name">orientation</p>
      <label class="settings__radio">
        horizontal
        <input class="settings__input" type="radio" name="orientation" value="horizontal" />
      </label>
      <label class="settings__radio">
        vertical
        <input class="settings__input" type="radio" name="orientation" value="vertical" />
      </label>
    </div>
    
    <div class="settings__row">
      <p class="settings__name">type</p>
      <label class="settings__radio">
        single
        <input class="settings__input" type="radio" name="type" value="single" />
      </label>
      <label class="settings__radio">
        double
        <input class="settings__input" type="radio" name="type" value="double" />
      </label>
    </div>
    
    <div class="settings__row">
      <p class="settings__name">hide From To</p>
      <label class="settings__radio">
        true
        <input class="settings__input" type="radio" name="hideFromTo" value="true" />
      </label>
      <label class="settings__radio">
        false
        <input class="settings__input" type="radio" name="hideFromTo" value="false" />
      </label>
    </div>
    
    <div class="settings__row">
      <p class="settings__name">hide Scale</p>
      <label class="settings__radio">
        true
        <input class="settings__input" type="radio" name="hideScale" value="true" />
      </label>
      <label class="settings__radio">
        false
        <input class="settings__input" type="radio" name="hideScale" value="false" />
      </label>
    </div>
    `;

    this.form.insertAdjacentHTML('beforeend', settingsTemplate);
  }

  private initValues() {
    const inputs = this.form.querySelectorAll('input');
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
        case 'hideFromTo':
          input.onchange = () => this.setState({ hideFromTo: input.value === 'true' });
          if (input.value === 'true') {
            if (this.state.hideFromTo === true) {
              input.checked = true;
            }
          } else if (this.state.hideFromTo === false) {
            input.checked = true;
          }
          break;
        case 'hideScale':
          input.onchange = () => this.setState({ hideScale: input.value === 'true' });
          if (input.value === 'true') {
            if (this.state.hideScale === true) {
              input.checked = true;
            }
          } else if (this.state.hideScale === false) {
            input.checked = true;
          }
          break;
        // no default
      }
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
