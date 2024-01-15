function timeFormat(rawTime) {
    const year = rawTime.getFullYear();
    const month = rawTime.getMonth() + 1;
    const day = rawTime.getDate();

    const hour = rawTime.getHours();
    const minute = rawTime.getMinutes();
    const seconds = rawTime.getSeconds();

    let ans = "";
    ans += year + "/" + month + "/" + day + " " + hour + ":" + minute + ":" + seconds
    return ans 
}

export default timeFormat;