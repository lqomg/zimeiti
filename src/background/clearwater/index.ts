import { ipcMain } from 'electron';
import db from '../database/index';
const date = require("silly-datetime");
const { videoList } = db;
import { getVideoInfo, getScreenshots, saveVideo } from '../ffmpeg/helper';
ipcMain.on('get-video-info', async (event, { originUrl, url, title }) => {
    try {
        let videoData: any = await getVideoInfo(url);
        let { status, data: dbData, msg } = videoData || {};
        if (!status) throw new Error(msg)
        let screenShots = await getScreenshots(url);
        dbData.screenShots = screenShots;
        dbData.status = 'start';
        dbData.errorMsg = '';
        dbData.originUrl = originUrl;
        dbData.originTitle = title || '---';
        console.log(originUrl)
        videoList.insert(dbData, (err: any, doc: any) => {
            if (err) {
                event.sender.send('reply-video-info', {
                    msg: err,
                });
            } else {
                dbData.screenShots = screenShots;
                dbData.id = doc._id;
                dbData.progress = 0;
                event.sender.send('reply-video-info', {
                    msg: '',
                    videoInfo: dbData
                });  // 异步发送
            }
        })
    } catch (error) {
        event.sender.send('reply-video-info', {
            msg: error.message,
            videoInfo: null
        });
    }

});

ipcMain.on('get-video-list', async (event, arg) => {
    let { pageSize, pageNumber } = arg;
    const total: number = await new Promise((resole, reject) => {
        videoList.count({}, (err: any, n: number) => {
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
    videoList.find({}).sort({ updatedAt: -1 }).skip(skip).limit(pageSize).exec((err: any, docs: any) => {
        if (err) {
            event.returnValue = [];
        }
        event.returnValue = {
            list: docs,
            total,
        };
    });
})

ipcMain.on('delete-video', (event, id) => {
    videoList.remove({ _id: id }, (err: any) => {
        if (err) {
            event.returnValue = false;
        } else {
            event.returnValue = true;
        }
    })
})
ipcMain.on('save-video', (event, arg) => {
    const { id, videosize = '', videotype } = arg;
    const size = videosize.split('|')
    const convertObj = {
        convertType: videotype,
        convertWidth: Number(size && size[0]),
        convertHeight: Number(size && size[1]),
    }
    saveVideo(arg, {
        start(data: any) {
            event.sender.send('reply-save-video', {
                tag: "start",
                msg: '视频转换开始....',
                data: {
                    filePath: data.filePath,
                    idx: id
                }
            });
        },
        end(data: any) {
            videoList.update({ _id: id }, {
                $set: {
                    ...convertObj,
                    updateDate: date.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),
                    filePath: data.filePath,
                    status: 'success',
                    progress: 100
                }
            });
            event.sender.send('reply-save-video', {
                tag: "end",
                msg: '视频转换完成',
                data: {
                    ...convertObj,
                    filePath: data.filePath,
                    idx: id
                }
            });
        },
        progress(data: any) {
            event.sender.send('reply-save-video', {
                tag: "progress", data: {
                    ...convertObj,
                    percent: data.percent,
                    filePath: data.filePath,
                    idx: id
                }
            });
        },
        error(data: any) {

            videoList.update({ _id: id }, { $set: { filePath: data.filePath, errorMsg: data.err.message, status: 'error', progress: 0 } });
            event.sender.send('reply-save-video', {
                tag: "error",
                msg: data.err.message,
                data: {
                    ...convertObj,
                    err: data.err,
                    filePath: data.filePath,
                    idx: id
                }
            });
        }
    });
});
