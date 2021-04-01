import { ipcMain } from 'electron';
import db from '../database/index';
import { saveAudio, getAudioInfo } from '../ffmpeg/helper';
const date = require("silly-datetime");
const { audioList } = db;
ipcMain.on('save-audio', async (event, arg) => {
    const { url, type, fileName } = arg;
    saveAudio(arg, {
        error({ filePath, err }) {
            event.returnValue = {
                code: 404,
                filePath,
                error: err
            }
        },
        async end({ filePath, fileName }) {
            const { result, dbData } = await getAudioInfo(filePath);
            if (result.status) {
                audioList.insert({
                    filePath,
                    fileName,
                    type: type || 'mp3',
                    ...dbData
                })
            }
            event.returnValue = {
                code: 200,
                filePath
            };
        }
    })
});
ipcMain.on('delete-audio', (event, id) => {
    audioList.remove({ _id: id }, (err) => {
        if (err) {
            event.returnValue = false;
        } else {
            event.returnValue = true;
        }
    })
})
ipcMain.on('get-audio-list', async (event, arg) => {
    let { pageSize, pageNumber } = arg;
    const total = await new Promise((resole, reject) => {
        audioList.count({}, (err, n) => {
            if (err) {
                resole(0)
            } else {
                resole(n);
            }
        })
    })
    if (total < pageSize) {
        pageNumber = 1;
    }
    const skip = (pageNumber - 1) * pageSize;
    audioList.find({}).sort({ updatedAt: -1 }).skip(skip).limit(pageSize).exec((err, docs) => {
        if (err) {
            event.returnValue = [];
        }
        event.returnValue = {
            list: docs,
            total,
        };
    });
})
