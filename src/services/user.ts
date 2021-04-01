import request from './request';

export async function login(code: string, password?: string): Promise<any> {
    return request({
        url: '/login',
        method: 'post',
        data: {
            code,
            password
        }
    });
}

export async function queryMessage(): Promise<any> {
    return request({
        url: '/user/message'
    });
}