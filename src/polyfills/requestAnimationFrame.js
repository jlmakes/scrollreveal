const polyfill = (() => {
  let timeLast = 0;

  return (callback) => {
    /**
     * Dynamically set the delay on a per-tick basis to more closely match 60fps.
     * Technique by Erik Moller. MIT license: https://gist.github.com/paulirish/1579671
     */
    const timeCurrent = Date.now();
    const timeDelta = Math.max(0, 16 - (timeCurrent - timeLast));
    timeLast = timeCurrent + timeDelta;

    return window.setTimeout(() => {
      callback(timeCurrent + timeDelta);
    }, timeDelta);
  };
})();

const requestAnimationFrame = window.requestAnimationFrame ||
                              window.webkitRequestAnimationFrame ||
                              window.mozRequestAnimationFrame ||
                              polyfill;


export default requestAnimationFrame;
