import request from './request';

export async function discern(data: any): Promise<any> {
    return request({
        url: '/image/discern',
        method: 'post',
        data: data
    });
}
