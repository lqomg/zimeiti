import request from './request';

export async function dspUrl(url: string): Promise<any> {
    return request({
        url: '/dspUrl',
        method: 'post',
        data: {
            url
        }
    });
}
