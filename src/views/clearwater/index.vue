<template>
  <div class="clearwater">
    <elAlert
      title="支持但不限于抖音、快手、微视、西瓜视频、微博、皮皮虾、陌陌、哔哩哔哩等视频平台。问题反馈QQ群：576301295。"
      type="info"
    ></elAlert>
    <elRow>
      <elCol :span="18" :offset="2">
        <elInput v-model="url" placeholder="请输入短视频地址">
          <elButton slot="prepend" icon="el-icon-search"></elButton>
        </elInput>
      </elCol>
      <elCol :span="2">
        <elButton @click="submit" type="primary" :loading="loading">
          获取视频信息
        </elButton>
      </elCol>
    </elRow>
    <transition name="el-fade-in">
      <elRow style="padding-top: 20px">
        <elCol :span="4" class="image-slot">
          <elImage :src="videoInfo.screenShots">
            <div slot="error">
              <i class="el-icon-picture-outline"></i>
            </div>
          </elImage>
        </elCol>
        <elCol
          :span="18"
          v-loading="loading"
          :element-loading-text="loadingText"
          element-loading-spinner="el-icon-loading"
        >
          <div class="info-wrap">
            <p class="info">
              <label>视频名称:</label>
              <span>{{ videoInfo.filename || "---" }}</span>
            </p>
            <p class="info">
              <label>视频长度:</label>
              <span>{{ videoInfo.duration || "---" }}</span>
            </p>
            <p class="info">
              <label>视频尺寸:</label>
              <span
                >{{ videoInfo.width || "---" }}*{{
                  videoInfo.height || "---"
                }}</span
              >
            </p>
          </div>
          <div class="info-wrap">
            <p class="info">
              <label>视频类型:</label>
              <span>{{ videoInfo.format_long_name || "---" }}</span>
            </p>
            <p class="info">
              <label>视频大小:</label>
              <span>{{ videoInfo.size || "---" }}</span>
            </p>
            <p class="info">
              <label>视频地址:</label>
              <elLink @click="copy(videoInfo.url)" type="primary">
                {{ videoInfo.url || "---" }}
              </elLink>
            </p>
          </div>
        </elCol>
      </elRow>
    </transition>

    <elRow v-if="dspSuccessUrl">
      <label>点击打开：</label>
      <el-button
        style="max-width: 60%; overflow: hidden; text-overflow: ellipsis"
        type="text"
        @click="openUrl"
        >{{ dspSuccessUrl }}</el-button
      >
    </elRow>
    <elDivider content-position="center">导出数据设置</elDivider>
    <elRow>
      <elCol>
        <p>
          视频类型:
          <elRadio v-model="videotype" label="mp4">MP4</elRadio>
          <elRadio v-model="videotype" label="avi">AVI</elRadio>
          <elRadio v-model="videotype" label="rmvb">RMVB</elRadio>
        </p>
        <p>
          视频尺寸:
          <elRadio v-model="videosize" :label="'origin'">
            原始大小
            {{
              videoInfo.width ? `：${videoInfo.width}x${videoInfo.height}` : ""
            }}
          </elRadio>
          <elRadio
            v-for="(item, key) in videoSizes"
            :key="key"
            v-model="videosize"
            :label="key"
            >{{ item }}</elRadio
          >
        </p>
        <!-- <p>
            <el-button
              @click="saveVideo"
              type="primary"
              :loading="videoSaveStatus"
              >保存视频</el-button
            >
          </p> -->
      </elCol>
    </elRow>
    <elDivider content-position="center">历史数据</elDivider>
    <videoTable ref="refTable" :type="videotype" :size="videosize"></videoTable>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, toRef, reactive, onMounted } from "vue";
import { ElNotification } from "element-plus";
import { vSizes } from "@/config/clearwater";
import { dspUrl } from "@/services/clearwater";
import { getVideoInfo } from "./utils";
import videoTable from "./table.vue";
import { shell } from "electron";
export default defineComponent({
  name: "clearwater",
  components: {
    videoTable,
  },
  setup() {
    const url = ref(""),
      videotype = ref("mp4"),
      videosize = ref("origin"),
      loading = ref(false),
      dspSuccessUrl = ref(""),
      loadingText = ref("视频地址解析中...");

    const videoSizes = reactive(vSizes);
    const videoInfo: any = reactive({
      filename: "",
      duration: "",
      format_long_name: "",
      height: "",
      size: "",
      width: "",
      screenShots: "",
      url: "",
    });
    const refTable = ref();
    const submit = async () => {
      if (!url.value) {
        ElNotification({
          type: "error",
          title: "提示",
          message: "请输入正确的URL",
          duration: 1500,
        });
        return;
      }
      loadingText.value = "解析中，请稍等...";
      dspSuccessUrl.value = "";
      loading.value = true;
      try {
        const { data, code, msg: message } = await dspUrl(url.value);
        if (data && data.url) {
          loadingText.value = "解析成功，正在获取视频信息，视频越大耗时越长...";
          const { videoInfo: resData, msg } = await getVideoInfo(
            data.url,
            url.value,
            data.title
          );
          if (resData) {
            videoInfo.url = data.url;
            videoInfo.filename = data.title;
            videoInfo.duration = resData.duration;
            videoInfo.format_long_name = resData.format_long_name;
            videoInfo.screenShots = resData.screenShots;
            videoInfo.height = resData.height;
            videoInfo.width = resData.width;
            videoInfo.size = resData.size;
          } else {
            dspSuccessUrl.value = data.url;
            ElNotification({
              type: "error",
              title: "提示",
              message: `获取视频信息失败，请自主下载`,
              duration: 10000,
            });
            return;
          }
        } else if (code == 10001) {
          ElNotification({
            type: "error",
            title: "提示",
            message: `您当日${6}次解析已用完，请进入小程序 —>code管理获得次数`,
            duration: 10000,
          });
        } else {
          ElNotification({
            type: "error",
            title: "提示",
            message: message || data.msg || "未知错误，请添加QQ群联系管理员",
            duration: 0,
          });
        }
      } catch (error) {
        dspSuccessUrl.value = "";
        loading.value = false;
      } finally {
        loading.value = false;
        refTable.value.getVideoList && refTable.value.getVideoList();
      }
    };
    const openUrl = () => {
      shell.openExternal(dspSuccessUrl.value);
    };
    return {
      refTable,
      loading,
      loadingText,
      dspSuccessUrl,
      url,
      videoInfo,
      videotype,
      videosize,
      videoSizes,
      submit,
      openUrl,
    };
  },
});
</script>
<style lang="scss" scoped>
.clearwater {
  padding: 20px;
  .image-slot {
    display: flex !important;
    align-items: center;
    justify-content: center;
  }
  & > div:not(.videoTable) {
    width: 1200px;
    margin: 30px auto;
  }
  div.videoTable {
    width: 90%;
    margin: 50px auto;
  }
  div.info-wrap {
    display: flex;
    p.info {
      display: flex;
      align-content: center;
      label {
        padding-left: 20px;
        font-weight: bold;
      }
      span,
      a {
        padding-left: 10px;
        display: inline-block;
        width: 200px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>