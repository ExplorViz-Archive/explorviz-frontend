import { helper } from '@ember/component/helper';

export function timestampToDate([timestamp, format]:[number, string]) {
  let date = new Date(timestamp);    

  let formattedDate;
  if (format === "time"){

    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    let seconds = "0" + date.getSeconds();   
     
    formattedDate = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  } else if (format === "localString") {
    formattedDate = date.toLocaleString();
  } else {
    formattedDate = date.toString();
  }

  return formattedDate;
}

export default helper(timestampToDate);
