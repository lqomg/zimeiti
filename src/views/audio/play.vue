<template>
  <div class="paly">
    <div class="notice">合成成功，点击播放试听或者下载保存为本地文件</div>
    <audio :src="audioPath" id="myAudio" controls="controls">
      Your browser does not support the audio element.
    </audio>
    <div class="input">
      <el-input placeholder="输入保存的文件名称" v-model="fileName">
        <template #prepend>文件名称：</template>
      </el-input>
      <el-button type="primary" @click="downloadFile(audioPath)"
        >点击下载文件</el-button
      >
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { ElNotification } from "element-plus";
const { ipcRenderer } = require("electron");
export default defineComponent({
  props: {
    audioPath: String,
  },
  setup(props, { emit }) {
    const fileName = ref("");
    const downloadFile = () => {
      const { audioPath } = props;
      const { code, filePath, error } = ipcRenderer.sendSync("save-audio", {
        url: audioPath,
        fileName: fileName.value,
      });
      if (code == 200) {
        ElNotification({
          type: "success",
          title: "提示",
          message: "保存成功，请点击历史记录打开文件",
        });
        emit("saveSuccess", filePath);
      } else {
        ElNotification({
          type: "error",
          title: "提示",
          message: error,
        });
      }
    };
    return {
      fileName,
      downloadFile,
    };
  },
});
</script>
<style lang="scss" scoped>
.paly {
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: center;
  :deep(.el-card__body) {
    padding: 2px;
  }
  .notice {
    color: #67c23a;
    text-align: center;
    font-size: 14px;
    padding: 6px;
    padding-bottom: 16px;
  }
  .input {
    display: flex;
    width: 90%;
    margin: 20px auto;
  }
  audio {
    width: 90%;
    margin: 0 auto;
    height: 40px;
  }
}
</style>