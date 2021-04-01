import ffmpeg, { fileDataDir } from '../ffmpeg';
import { isArray } from 'lodash';
const concat = require('ffmpeg-concat')
const md5 = require('md5-node');

export default function (filePaths,onProgress) {
    if (!isArray(filePaths)) return [];
    const fileName = md5(new Date().getTime());
    const outputPath = `${fileDataDir}/${fileName}.mp4`;
    return new Promise(async (resolve, reject) => {
        try {
             concat({
                output: outputPath,
                videos: filePaths,
                transition: {
                    name: 'directionalWipe',
                    duration: 500
                },
                onProgress: onProgress || function(p){
                    console.log(p)
                }
            }).then(() => {
                resolve(outputPath)
            })
        } catch (error) {
            reject(error);
        }
    })
}