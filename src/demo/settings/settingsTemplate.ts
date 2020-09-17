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
  <label class="settings__checkbox">
    <span class="settings__name">hide From To</span>
    <input class="settings__input" type="checkbox" name="hideFromTo" />
  </label>
  </div>
  
  <div class="settings__row">
    <label class="settings__checkbox">
      <span class="settings__name">hide Scale</span>
      <input class="settings__input" type="checkbox" name="hideScale" />
    </label>
  </div>
  `;

export { settingsTemplate };
