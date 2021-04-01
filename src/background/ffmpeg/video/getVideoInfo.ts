
import ffmpeg from '../ffmpeg';
import formatBytes from '../utils/formatBytes';
import formatSeconds from '../utils/formatSeconds';
const date = require("silly-datetime");
const md5 = require('md5-node');

export default function (videoUrl:string) {
    let result = { status: false, msg: '获取失败', data: {} };
    let da = {};
    return new Promise((resolve, reject) => {
        ffmpeg(videoUrl).ffprobe((err, data) => {
            if (err) {
                console.log(err)
                reject(new Error(err));
            } else {
                const { streams, format } = data;
                const { width, height } = streams[0];
                let { filename, format_long_name, duration, size } = format;
                let key = md5(filename);
                filename = key;
                duration = formatSeconds(duration);
                size = formatBytes(size);
                let adddate = date.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
                da = { width, height, filename, format_long_name, duration, size, date: adddate, url: videoUrl };
                result = { status: true, msg: '处理成功', data: da };
            }
            resolve(result)
        });
    })
}