import * as timeago from 'timeago.js';

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

const formatTime = (time: number, language: string) => {
  let value;
  const timeMS = typeof time === 'string' ? parseInt(time) : time;
  if (Date.now() - timeMS > TWO_DAYS_MS) {
    value = new Date(timeMS).toLocaleString();
  } else {
    // timeago.js supports zh_CN or zh_TW, instead of zh
    const locale = language === 'zh' ? 'zh_CN' : language;
    value = timeago.format(timeMS, locale);
  }
  return value;
};

export default formatTime;