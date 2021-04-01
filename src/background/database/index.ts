import Datastore from 'nedb'
import path from 'path'
import { app } from 'electron'
const filePath = app.getPath('userData');
const timestampData = true;
const db = {
    audioList: new Datastore({ filename: path.join(filePath, '/audio.db'), timestampData, autoload: true }),
    videoList: new Datastore({ filename: path.join(filePath, '/videoList.db'), timestampData, autoload: true }),
    editVideoList: new Datastore({ filename: path.join(filePath, '/editVideoList.db'), timestampData, autoload: true })
}

export default db;