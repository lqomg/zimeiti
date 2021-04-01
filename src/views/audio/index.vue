<template>
  <div
    class="audio"
    v-loading="loading"
    element-loading-text="拼命合成中..."
    element-loading-spinner="el-icon-loading"
  >
    <textareaEdit ref="textareaRef"></textareaEdit>
    <transition name="fade" appear>
      <playEdit
        v-if="audioPath"
        :audioPath="audioPath"
        key="audioPath"
        @saveSuccess="saveSuccess"
      ></playEdit>
      <el-divider v-else content-position="left"></el-divider>
    </transition>
    <configEdit ref="configRef"></configEdit>
    <div class="opreate">
      <el-button
        class="btn"
        size="medium"
        type="primary"
        @click="createAudio"
        :disabled="disabledBtn"
        >快 速 合 成</el-button
      >
    </div>
    <historyList ref="historyRef"></historyList>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { ElNotification } from "element-plus";
import { getAudio } from "@/services/audio";
import configEdit from "./config.vue";
import textareaEdit from "./textarea.vue";
import historyList from "./history.vue";
import playEdit from "./play.vue";
import { baseURL } from "@/services/request";
export default defineComponent({
  el: "audio",
  components: {
    configEdit,
    textareaEdit,
    playEdit,
    historyList,
  },
  setup() {
    const textareaRef = ref({ text: "" }),
      configRef = ref({
        options: { voiceType: "tengxun", spd: 0, pit: 5, vol: 0, per: 1000 },
      }),
      loading = ref(false),
      audioPath = ref(""),
      historyRef = ref();
    const disabledBtn = computed(() => {
      return textareaRef.value.text.length === 0;
    });
    const createAudio = async () => {
      const { text } = textareaRef.value;
      const { options } = configRef.value;
      if (options.voiceType === "tengxun" && text.length > 110) {
        ElNotification({
          title: "提示",
          message:
            "腾讯语音合成语音的中文最大支持110个汉字，英文350个字母。讯飞和科大语音为2000，请减少字数分匹配合成或者换用其他语音",
          duration: 5000,
        });
        return;
      }
      try {
        loading.value = true;
        const data = await getAudio({
          ...options,
          tex: text,
        });
        const { path, code, msg } = data;
        if (path) {
          audioPath.value = baseURL + path;
        } else if (code == 10001) {
          ElNotification({
            type: "error",
            title: "提示",
            message:
              "当日合成语音已用完，请进入小程序 —>我的—>code 管理获得次数",
            duration: 10000,
          });
        } else {
          ElNotification({
            type: "error",
            title: "提示",
            message: `合成失败：${msg || "未知错误"}`,
            duration: 2000,
          });
        }
        loading.value = false;
      } catch (error) {
        console.error(error);
        loading.value = false;
      }
    };
    const saveSuccess = (filePath: string) => {
      historyRef.value.pageNumber = 1;
      historyRef.value.getAudioList();
    };
    return {
      historyRef,
      textareaRef,
      configRef,
      loading,
      audioPath,
      disabledBtn,
      createAudio,
      saveSuccess,
    };
  },
});
</script>
<style lang="scss" scoped>
.audio {
  width: 1200px;
  margin: 0 auto;
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .opreate {
    margin-top: 20px;
    widows: 100%;
    text-align: center;
    .btn {
      width: 200px;
      word-spacing: 6px;
    }
  }
}
</style>