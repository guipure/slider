/* eslint-disable func-names */
import { Presenter } from './Presenter/Presenter';
import { Options } from './Presenter/Options';

declare global {
  interface JQuery {
    slider(options?: Options): void
  }
}

(function ($) {
  $.fn.slider = function (options: Options): Presenter {
    const slider: Presenter = new Presenter(this.get(0), options);
    return slider;
  };
}(jQuery));
