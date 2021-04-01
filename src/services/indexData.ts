import request from './request';

export async function getIndexData(): Promise<any> {
    return request({
        url: '/indexData',
        method: 'get'
    });
}
