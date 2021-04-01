import { ipcMain } from 'electron';
import db from '../database/index';
const date = require("silly-datetime");
const { editVideoList } = db;
import { cutVideo, concatVideo } from '../ffmpeg/helper';

ipcMain.on('cut-video', async (event, arg) => {
    const { url, times } = arg;
    const filePaths = await Promise.all(times.map(async ({ start, end }, index) => {
        return new Promise((resolve, reject) => {
            cutVideo({ url, start, end }, event, {
                start({ filePath }) {
                    event.sender.send('reply-cut-video', { status: 'start', filePath })
                },
                end({ filePath }) {
                    event.sender.send('reply-cut-video', { status: 'end', filePath });
                    resolve(filePath)
                },
                progress({ filePath, percent }) {
                    event.sender.send('reply-cut-video', { status: 'ing', filePath, percent })
                },
                error({ err, filePath }) {
                    event.sender.send('reply-cut-video', { status: 'error', error: err, filePath })
                }
            });
        })
    }));
    console.log(2222)
    concatVideo(filePaths, percent => {
        event.sender.send('reply-cut-video', { status: 'concat-ing', filePath: '', percent: percent * 100 })
    }).then(path => {
        event.sender.send('reply-cut-video', { status: 'concat-end', filePath: path });
    }, err => {
        event.sender.send('reply-cut-video', { status: 'concat-error', error: err, filePath: null })
    })
});
