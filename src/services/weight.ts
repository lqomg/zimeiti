import request from './request';

export async function getWeight(data: any): Promise<any> {
    return request({
        url: '/getWeight',
        method: 'post',
        data: data
    });
}
