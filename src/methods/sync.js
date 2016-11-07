import { initialize } from '../core/functions';
import reveal from './reveal';

/**
 * Re-runs `reveal()` for each record stored in history, effectively capturing
 * any content loaded asynchronously that matches existing reveal set targets.
 * @return {object} - The current ScrollReveal instance.
 */
function sync () {
  this.store.history.forEach((record) => {
    reveal.call(this, record.target, record.config, record.interval, false);
  });

  initialize.call(this);

  return this;
}

export default sync;
