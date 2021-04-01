
import ffmpeg, { fileDataDir } from '../ffmpeg';
const md5 = require('md5-node');
const path = require('path')
export default function (videoUrl: string) {
    let key = md5(videoUrl);
    return new Promise((resolve, reject) => {
        ffmpeg(videoUrl).screenshots({
            timestamps: ['50%'],
            filename: key + '-%w.png',
            folder: fileDataDir,
            size: '320x240',
        }).on('end', function () {
            let pic = path.resolve(fileDataDir, key + "-320.png")
            // let status = "start";
            // let status_msg = "等待开始";
            resolve(pic)
        }).on('error', (error: any) => {
            reject(new Error('获取视频封面失败：' + error));
        })
    });
}