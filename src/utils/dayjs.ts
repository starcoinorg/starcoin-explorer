import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.extend(timezone);

import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import duration from "dayjs/plugin/duration";
dayjs.extend(isSameOrAfter);
dayjs.extend(duration);

export const getFormatDate = (date:any, format:string) => {
    return dayjs(date).tz(dayjs.tz.guess()).format(format);
};