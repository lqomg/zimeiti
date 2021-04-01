import { ipcMain } from 'electron';
import { wait } from '../utils';
const exec = require('child-process-promise').exec;
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const command = (cmd: string) => {
  return new Promise((resolve, reject) => {
    exec(cmd)
      .then(function (result: any) {
        resolve(result)
      })
      .catch(function (err: any) {
        console.error('ERROR: ', err);
        reject(err);
      });
  })
}
ipcMain.on('terminal-cmd', (event: any, arg: string) => {
  let cmd = (arg || '').replace('ffmpeg', ffmpegInstaller.path);
  Promise.race([wait(300000), command(cmd)]).then((message: any) => {
    message.cmd = cmd;
    event.sender.send('terminal-success', message);
  }).catch((message: any) => {
    message.cmd = cmd;
    event.sender.send('terminal-error', message);
  })
})
