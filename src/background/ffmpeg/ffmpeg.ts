/* eslint-disable func-names */


const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
// const ffprobeInstaller = require('@ffprobe-installer/ffprobe');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const date = require("silly-datetime");
let ffmpegPath = ffmpegInstaller.path;
ffmpeg.setFfmpegPath(ffmpegPath);
const curDate = date.format(new Date(), 'YYYYMMDD');
// 设置目录
const fileTmpDir = path.resolve(path.basename(__dirname), '../', 'tmp');
const fileBaseDataDir = path.resolve(path.basename(__dirname), '../', 'data');
const fileDataDir = path.resolve(fileBaseDataDir, curDate);


function fsExistsSync(paths: string[]) {
    try {
        fs.statSync(paths);
    } catch (error) {
        fs.mkdir(paths, (err, data) => {
        });
    }
}
fsExistsSync(fileBaseDataDir);
fsExistsSync(fileTmpDir); // 创建临时目录
fsExistsSync(fileDataDir); // 创建文件目录


export default ffmpeg;

export {
    fileTmpDir,
    fileBaseDataDir,
    fileDataDir
}