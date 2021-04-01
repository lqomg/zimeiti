<template>
  <div class="contaitar">
    <div class="progress" v-if="isUpdate">
      <div class="content">
        <div class="title">正在下载应用最新版本: {{ appName }}</div>
        <el-progress type="circle" :percentage="percent" :width="200">
          <template #default="{ percentage }">
            <span class="percentage-value">{{ percentage }}%</span>
            <span class="percentage-label">当前更新进度</span>
          </template>
        </el-progress>
      </div>
    </div>

    <router-view></router-view>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { ElMessageBox, ElNotification } from "element-plus";
import { getIndexData } from "@/services/indexData";
const ipcRenderer = require("electron").ipcRenderer;
const UPDATE_MESSAGE_STATUS = {
  ERROR: 0,
  CHECKING: 1,
  UPDATE: 2,
  NOT_UPDATE: 3,
  SUCCESS: 4,
  DOWNLOAD: 5,
};
export default defineComponent({
  name: "App",
  setup() {
    onMounted(async () => {
      try {
        await getIndexData();
      } catch (error) {
        console.warn("请求getIndexData失败");
      }
      setTimeout(() => {
        ipcRenderer.send("checkForUpdate");
      }, 1500);
    });
    const isUpdate = ref(false);
    const percent = ref(0);
    const version = ref("");
    const appName = ref("");
    ipcRenderer.on("message", (event: any, text: any) => {
      const { code, message } = text;
      console.log(text);
      switch (code) {
        case UPDATE_MESSAGE_STATUS.UPDATE:
          version.value = message?.version;
          appName.value = message?.path;
          isUpdate.value = true;
          break;
        case UPDATE_MESSAGE_STATUS.ERROR:
          isUpdate.value = false;
          // ElNotification({
          //   type: "error",
          //   message: message,
          //   title: "自动更新失败",
          // });
          break;
        case UPDATE_MESSAGE_STATUS.DOWNLOAD:
          isUpdate.value = false;
          ElMessageBox.confirm(
            `若自动更新失败请到此路径下手动安装：${message[0]?.downloadedFile}`,
            "提示",
            {
              showCancelButton: false,
            }
          )
            .then(() => {
              ipcRenderer.send("isUpdateNow");
            })
            .catch(() => {
              ipcRenderer.send("isUpdateNow");
            });
          break;
        default:
          break;
      }
    });
    ipcRenderer.on("downloadProgress", (event: any, progressObj: any) => {
      percent.value = Number((progressObj?.percent || 0).toFixed(1));
    });

    return {
      percent,
      isUpdate,
      version,
      appName,
    };
  },
});
</script>
<style lang="scss" scoped>
.contaitar {
  .progress {
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    .content {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      background: #fff;
      border-radius: 10px;
      padding: 50px 10px;
      .title {
        color: #000;
        font-weight: bold;
        letter-spacing: 1.5px;
        padding: 20px;
      }
    }
  }
}
</style>
