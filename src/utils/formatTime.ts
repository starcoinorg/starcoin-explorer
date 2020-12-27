import * as timeago from 'timeago.js';

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

const formatTime = (time: number) => {
  let value;
  const timeMS = typeof time === 'string' ? parseInt(time) : time;
  if (Date.now() - timeMS > TWO_DAYS_MS) {
    value = new Date(timeMS).toLocaleString();
  } else {
    value = timeago.format(timeMS);
  }
  return value;
};

export default formatTime;