<template>
  <div class="terminal">
    <div class="notice">
      <el-alert
        title="终端ffmpeg说明"
        type="info"
        effect="light"
        :closable="false"
      >
        Ffmpeg
        是领先的多媒体框架，能够解码、编码、转码、混合、解密、流媒体、过滤和播放人类和机器创造的几乎所有东西。
        本软件已经自动集成安装，你可以免去安装流程直接使用，交流学习群：576301295。 <br />
        参照使用教程
        <a href="javascript:void(0)" @click="goFfpmeg"
          >《FFmpeg 视频处理入门教程》</a
        >,你可以完成对视频进行基本的转码、裁剪、添加水印、字幕、提取视/音频等等功能！
      </el-alert>
    </div>

    <el-divider>输入完成之后点击回车[Enter]执行命令</el-divider>
    <div class="input" v-loading="loading" element-loading-text="执行命令中...">
      <div class="terminal-header">
        <div class="terminal-header-button color-red"></div>
        <div class="terminal-header-button color-yellow"></div>
        <div class="terminal-header-button color-green"></div>
      </div>
      <textarea
        placeholder="请输入执行命令"
        v-model="cmd"
        autofocus
        @keydown.enter="commandEnter()"
      ></textarea>
    </div>
    <el-alert
      class="notice-msg"
      :title="(typeStatus === 'success' ? '输出' : '错误') + '信息'"
      v-if="msgNotice"
      :type="typeStatus"
      effect="light"
      closable
    >
      <p>终端命令：{{ cmdResult }}</p>
      {{ msgNotice }}
    </el-alert>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
const { shell, ipcRenderer } = require("electron");
export default defineComponent({
  setup() {
    const cmd = ref(""),
      cmdResult = ref("");
    const msgNotice = ref("");
    const typeStatus = ref("success");
    const loading = ref(false);
    const goFfpmeg = () => {
      shell.openExternal("http://www.ruanyifeng.com/blog/2020/01/ffmpeg.html");
    };
    const commandEnter = () => {
      msgNotice.value = "";
      const cmds = cmd.value.split("\n");
      let str = "";
      for (let i = cmds.length - 1; i >= 0; i--) {
        if (cmds[i]) {
          str = cmds[i];
          break;
        }
      }
      loading.value = true;
      ipcRenderer.send("terminal-cmd", (str || "").trim());
    };
    ipcRenderer.on("terminal-success", (event: any, message: any) => {
      console.log(message);
      loading.value = false;
      const { stderr, stdout } = message;
      cmdResult.value = message.cmd;
      msgNotice.value = stderr || stdout;
      typeStatus.value = "success";
    });
    ipcRenderer.on("terminal-error", (event: any, message: any) => {
      console.warn(message);
      loading.value = false;
      const { stderr, stdout } = message;
      cmdResult.value = message.cmd;
      msgNotice.value = stderr || stdout;
      typeStatus.value = "warning";
    });
    return {
      cmd,
      cmdResult,
      loading,
      msgNotice,
      typeStatus,
      goFfpmeg,
      commandEnter,
    };
  },
});
</script>
<style lang="scss" scoped>
.terminal {
  width: 80%;
  margin: 0 auto;
  .notice {
    margin: 10px auto;
    :deep(.el-alert__title) {
      font-size: 14px;
    }
    :deep(.el-alert__description) {
      font-size: 14px;
      line-height: 1.4;
    }
  }
  .terminal-box {
    width: 100%;
    margin: 0 auto;
  }
  .help {
    margin: 50px auto;
    color: #909399;
    blockquote {
      background: #f5f2f0;
      padding: 1em;
      border-radius: 1em;
      border-width: 0.3em;
      border-color: #e0dfcc;
      border-style: solid;
    }
  }
  .input {
    textarea {
      height: 170px;
      border-radius: 0;
      border-color: #e0e0e0;
      background: #000;
      color: #fff;
      display: block;
      resize: vertical;
      padding: 5px 15px;
      line-height: 1.5;
      box-sizing: border-box;
      width: 100%;
      font-size: 13px;
      background-image: none;
      border: 1px solid #dcdfe6;
      border-radius: 0;
      font-family: Monaco, Menlo, Consolas, monospace;
    }
  }
  .terminal-header {
    background-color: #e0e0e0;
    height: 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .terminal-header-button {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      border-style: none;
      margin: 0px 4px;
    }

    .color-red {
      background-color: #f44336;
    }

    .color-yellow {
      background-color: #ffeb3b;
    }

    .color-green {
      background-color: #66bb6a;
    }
  }
  .notice-msg {
    :deep(.el-alert__description) {
      white-space: pre;
    }
    :deep(.el-alert__content) {
      width: 100%;
      height: 220px;
      overflow: auto;
    }
  }
}
</style>