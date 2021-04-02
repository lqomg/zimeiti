  <h1>
    自媒体自助
  </h1>
<p align="center">
  <img src="https://github.com/linqian02/zimeiti/blob/master/src/assets/images/7.png" width="500" alt="自媒体自助" />
</p>
<p align="center">
  <a href="https://www.zimeitizizhu.com"><img src="https://img.shields.io/hexpm/dt/plug?label=zimeitizizhu.com" alt="个人站点" />
  </a>
  <a href="https://www.zimeitizizhu.com"><img src="https://img.shields.io/npm/dt/random-anime.svg?maxAge=3600" alt="downloads" />
   </a>
  </div>
</p>
<h3 align="center"><strong>基于Electron + Vue3 + Element-plus + Fluent-ffmpeg 开发的 <s>跨平台</s> window桌面应用。支持视频处理、语言合成、短视频水印去除、权重查询、登录流程、软件自动更新安装等</strong></h3>


## [点击体验](https://www.zimeitizizhu.com)

- qq交流群：576301295

## 功能概要

1. 语音合成
   - 支持语音合成，包含腾讯、百度和讯飞
   - 支持查看音频信息、保存到本地

<p align="center">
  <a  href="https://www.zimeitizizhu.com"><img src="https://github.com/linqian02/zimeiti/blob/master/src/assets/images/1.png" width="500" alt="语言水印去除" />
  </a>
</p>

2. 短视频水印去除
   - 支持抖音、快手、小红书、微博、西瓜视频、今日头条、美拍、微视、火山小视频、皮皮虾、好看视频、before避风、酷秀短视频...
   - 支持获取视频信息，包括大小、时长、类型等
   - 支持转码为AVI、RMVB
   - 支持显示下载进度、保存历史到本地[nedb](https://www.npmjs.com/package/nedb)

<p align="center">
  <a  href="https://www.zimeitizizhu.com"><img src="https://github.com/linqian02/zimeiti/blob/master/src/assets/images/2.png" width="500" alt="水印去除" />
  </a>
</p>

3. 集成Ffmpeg终端
4. 
<p align="center">
  <a  href="https://www.zimeitizizhu.com"><img src="https://github.com/linqian02/zimeiti/blob/master/src/assets/images/3.png" width="500" alt="集成Ffmpeg终端" />
  </a>
</p>

4. 图片识别
5. 权重查询

<p align="center">
  <a  href="https://www.zimeitizizhu.com"><img src="https://github.com/linqian02/zimeiti/blob/master/src/assets/images/4.png" width="500" alt="权重查询" />
  </a>
</p>

## 安装与启动

- 执行安装命令
  
```bash
   $ yarn install --force or npm install
```
- 软件使用到原生的node模块，需要执行 [npm run rebuild](https://www.electronjs.org/docs/tutorial/using-native-node-modules)
  
- 启动

```bash
   $ npm run serve
```

- 打包
```bash
   $ npm run build
```

###  近期任务安排:
- [x] 支持头条号的权重查询
- [x] 支持集成Ffmpeg命令终端
- [x] 支持自动更新、安装
- [ ] 兼容Mac和Linux
- [ ] 学习python，更新自己的短视频解析逻辑
- [ ] 支持绕过短视频平台审核机制的编辑视频、音频
- [ ] 支持通过一段文字生成视频

### 其他:
 ``
   本项目之前是由js写的、后面为了学习vue3和ts，就改用ts替换。其中一些函数校验没写完会有warning,后面会依次修改
 ``

### 赞赏和配套小程序

<p align="center">
  <a  href="https://www.zimeitizizhu.com"><img src="https://github.com/linqian02/zimeiti/blob/master/src/assets/images/5.png" " alt="自媒体自助小程序" />
</a>
 <a  href="https://www.zimeitizizhu.com"><img src="https://github.com/linqian02/zimeiti/blob/master/src/assets/images/6.png"  alt="赞赏码" />
  </a>
</p>
