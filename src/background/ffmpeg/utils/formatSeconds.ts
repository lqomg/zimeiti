export default function formatSeconds(value) {
    let theTime = parseInt(value);
    let theTime1 = 0;
    let theTime2 = 0;

    if (theTime >= 60) {
        theTime1 = parseInt(theTime / 60);
        theTime = parseInt(theTime % 60);
        if (theTime1 >= 60) {
            theTime2 = parseInt(theTime1 / 60);
            theTime1 = parseInt(theTime1 % 60);
        }
    }
    if (theTime < 10) {
        theTime = `0${parseInt(theTime)}`;
    }
    let result = `${theTime}`;
    if (theTime1 >= 0) {
        if (theTime1 < 10) {
            theTime1 = `0${parseInt(theTime1)}`;
        }
        result = `${theTime1}:${result}`;
    }
    if (theTime2 >= 0) {
        if (theTime2 < 10) {
            theTime2 = `0${parseInt(theTime2)}`;
        }
        result = `${theTime2}:${result}`;
    }
    return result;
}