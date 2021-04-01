
import ffmpeg, { fileTmpDir } from '../ffmpeg';
import { noop } from 'lodash';
const md5 = require('md5-node');

export default function (options = {}, event, {
    start = noop,
    end = noop,
    progress = noop,
    error = noop
}) {
    const { url, start: startTime, end: endTime, ext = 'mp4' } = options;
    console.log(startTime, endTime)
    const fileName = md5(new Date().getTime() + url);
    const filePath = `${fileTmpDir}/${fileName}.${ext}`;
    ffmpeg(url).output(filePath)
        .setStartTime(startTime)
        .setDuration(endTime - startTime)
        .on('start', (commandLine) => {
            console.log('cutVideo========', commandLine)
            start({
                filePath: filePath
            })
        })
        .on('end', () => {
            end({
                filePath: filePath
            });  // 异步发送
        }).on('progress', (p) => {
            progress({
                filePath: filePath,
                percent: p.percent
            });  // 异步发送
        }).on('error', (err, stdout, stderr) => {
            error({
                err,
                filePath: filePath
            });  // 异步发送
        })
        .run();
}
