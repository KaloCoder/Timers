class TimeController {

  createTimerInterval = (timer) => {
  const interval = setInterval(() => {
    timer.progress += 1000;
    if (timer.progress >= timer.duration) {
      timer.isActive = false;
      clearInterval(interval);
    }
  }, 1000);
};
}

module.exports = new TimeController();
