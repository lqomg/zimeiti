import ffmpeg, { fileDataDir } from '../ffmpeg';
import { noop } from 'lodash'
const md5 = require('md5-node');
const fs = require('fs')
function fileExist(path) {
    try {
        fs.statSync(path);
        return true;
    } catch (e) {
        //捕获异常
        return false;
    }
}
export default function ({ url, type, fileName: name }, {
    start = noop,
    end = noop,
    progress = noop,
    error = noop
}) {
    let fileName = name || md5(url);
    const ext = type || 'mp3';
    let file = `${fileDataDir}/${fileName}.${ext}`;
    if (fileExist(file)) {
        fileName = `${fileName}-${(new Date().getTime()) % 1000000}`;
        file = `${fileDataDir}/${fileName}.${ext}`;
    }
    ffmpeg(url).output(file).on('start', (commandLine) => {
        start({
            fileName,
            filePath: file
        })
    }).on('end', () => {
        end({
            fileName,
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
            fileName,
            filePath: file
        });  // 异步发送
    })
        .run();
}