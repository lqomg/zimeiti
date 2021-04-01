import ffmpeg, {
    fileDataDir,
} from '../ffmpeg';

import { noop } from 'lodash'
const md5 = require('md5-node');
export default function (arg: any, {
    start = noop,
    end = noop,
    progress = noop,
    error = noop
}) {
    let { videotype, videosize, url, id } = arg;
    const fileName = md5(url);
    const ext = (videotype || 'mp4');
    const size = (videosize.replace("|", "x") || '320x240');
    const file = `${fileDataDir}/${fileName}.${ext}`;
    ffmpeg(url).output(file).audioCodec('libmp3lame').size(size)
        .videoCodec('libx264')
        .on('start', (commandLine) => {
            console.log('saveVideo=====: ', commandLine)
            start({
                filePath: file
            })
        }).on('end', () => {
            end({
                filePath: file
            });  // 异步发送
        }).on('progress', (p) => {
            progress({
                filePath: file,
                percent: p.percent
            });  // 异步发送
        }).on('error', (err, stdout, stderr) => {
            error({
                err,
                filePath: file
            });  // 异步发送
        })
        .run();
}