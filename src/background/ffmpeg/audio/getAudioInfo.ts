import ffmpeg from '../ffmpeg';
import formatBytes from '../utils/formatBytes';
import formatSeconds from '../utils/formatSeconds';
const date = require("silly-datetime");


export default function (videoUrl: string) {
    let result = { status: false, msg: '获取失败', data: {} };
    let da = {};
    return new Promise((resolve, reject) => {
        ffmpeg(videoUrl).ffprobe((err, data) => {
            if (err) {
                reject(new Error('获取视频信息失败，请检查视频链接是否可访问'));
            } else {
                const { format } = data;
                let { format_long_name, duration, size } = format;
                duration = formatSeconds(duration);
                size = formatBytes(size);
                let adddate = date.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
                da = { format_long_name, duration, size, date: adddate, url: videoUrl };
                result = { status: true, msg: '处理成功', data: da };
            }
            resolve({
                result,
                dbData: da
            })
        });
    })
}