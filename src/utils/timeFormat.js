function timeFormat(rawTime) {
    const year = rawTime.getFullYear();
    const month = rawTime.getMonth() + 1;
    const day = rawTime.getDate();

    let hour = rawTime.getHours();
    let minute = rawTime.getMinutes();
    let seconds = rawTime.getSeconds();

    if (Number(hour) >= 0 && Number(hour) <= 9) hour = '0' + hour;
    if (Number(minute) >= 0 && Number(minute) <= 9) minute = '0' + minute;
    if (Number(seconds) >= 0 && Number(seconds) <= 9) seconds = '0' + seconds;

    let ans = "";
    ans += year + "/" + month + "/" + day + " " + hour + ":" + minute + ":" + seconds
    return ans 
}

export default timeFormat;