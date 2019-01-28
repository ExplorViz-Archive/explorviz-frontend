import { helper } from '@ember/component/helper';

export function timestampToDate(params) {
  const [timestamp, format] = params;
  let date = new Date(timestamp);
  let hours = date.getHours();
  let minutes = "0" + date.getMinutes();
  let seconds = "0" + date.getSeconds();

  let formattedDate;
  if (format === "time"){
    formattedDate = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  } else if (format === "localString") {
    formattedDate = date.toLocaleString();
  } else {
    formattedDate = date.toString();
  }

  return formattedDate;
}

export default helper(timestampToDate);
