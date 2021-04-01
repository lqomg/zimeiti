import { ipcRenderer } from 'electron';
const getVideoInfo = (url: string, originUrl: string, title: string): any => {
    ipcRenderer.send("get-video-info", { url, originUrl ,title});
    return new Promise((resolve, reject) => {
        try {
            ipcRenderer.on("reply-video-info", (event, arg) => {
                if (arg) {
                    resolve(arg);
                } else {
                    resolve(null);
                }
            });
        } catch (error) {
            console.log(error)
            reject(error);
        }
    })
}

const saveVideo = (url: string | undefined, videoType: string | undefined, videoSize: string | undefined, id: string): void => {
    ipcRenderer.send("save-video", {
        videotype: videoType,
        videosize: videoSize,
        id,
        url
    });
}
export {
    getVideoInfo,
    saveVideo
}