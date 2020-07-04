import Presenter from './Presenter/Presenter';
import { Options } from './Presenter/Options';

declare global {
  interface JQuery {
    slider(options?: Options): void
  }
}

(function ($) {
  $.fn.slider = function (options: Options): void {
    new Presenter(this.get(0), options);
  };
}(jQuery));
