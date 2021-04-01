
const BaiDu = [
    {
        name: '情感男声',
        value: 3
    },
    {
        name: '情感女声',
        value: 4
    },
    {
        name: '标准女声',
        value: 0
    },
    {
        name: '标准男声',
        value: 1
    },

];


const TengXun = [
    {
        name: '智侠(男声)',
        value: 1000
    },
    {
        name: '智瑜(女声)',
        value: 1001
    },
    {
        name: '智聆(女声)',
        value: 1002
    },
    {
        name: '智美(客服女声)',
        value: 1003
    },
    {
        name: 'WeJack(英文男声)',
        value: 1050
    },
    {
        name: 'WeRose(英文女声)',
        value: 1051
    },
    {
        name: '云小宁',
        value: 1
    },
    {
        name: '云小晚',
        value: 2
    },
    {
        name: '云小叶',
        value: 4
    },
    {
        name: '云小欣',
        value: 5
    },
    {
        name: '云小龙',
        value: 6
    },
    {
        name: '云小曼',
        value: 7
    },
];
const XunFei = [
    {
        name: '讯飞小燕',
        value: 'xiaoyan'
    },
    {
        name: '讯飞许久',
        value: 'aisjiuxu'
    },
    {
        name: '讯飞小萍',
        value: 'aisxping'
    },
    {
        name: '讯飞小婧',
        value: 'aisjinger'
    },
    {
        name: '讯飞许小宝',
        value: 'aisbabyxu'
    }
]


interface VoiceConfig {
    [k: string]: any
}
const voiceConfig :VoiceConfig = {
    voice: [
        {
            name: '腾讯语音',
            value: 'tengxun',
        },
        {
            name: '讯飞语音',
            value: 'xunfei'
        },
        {
            name: '百度语音',
            value: 'baidu',
        },
    ],
    volume: {
        baidu: {
            min: 1,
            max: 15,
            default: 5
        },
        tengxun: {
            min: 0,
            max: 10,
            default: 2
        },
        xunfei: {
            min: 1,
            max: 100,
            default: 50
        }
    },
    speed: {
        baidu: {
            min: 0,
            max: 9,
            default: 5
        },
        tengxun: {
            min: -2,
            max: 2,
            default: 0
        },
        xunfei: {
            min: 1,
            max: 100,
            default: 50
        }
    },
    pitch: {
        baidu: {
            min: 0,
            max: 9,
            default: 5
        },
        tengxun: {
            min: -2,
            max: 2,
            default: 0
        },
        xunfei: {
            min: 1,
            max: 100,
            default: 50
        }
    },
    per: {
        baidu: 3,
        tengxun: 1000,
        xunfei: 'xiaoyan'
    },
    baidu: BaiDu,
    tengxun: TengXun,
    xunfei: XunFei
};

export {
    BaiDu,
    TengXun,
    XunFei,
    voiceConfig
}