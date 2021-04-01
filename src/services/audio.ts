import request from './request';

export async function getAudio(data: any): Promise<any> {
    return request({
        url: '/audio/create',
        method: 'post',
        data: data
    });
}
