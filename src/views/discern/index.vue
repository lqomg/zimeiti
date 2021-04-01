<template>
  <div class="discern">
    <div class="options">
      <div class="set-title">选择识别语言:</div>
      <div class="item">
        <div class="block">
          <el-radio-group v-model="language" size="medium">
            <el-radio
              style="margin-top: 10px"
              v-for="(item, index) in languageList"
              :key="index"
              :label="item.value"
              >{{ item.name }}</el-radio
            >
          </el-radio-group>
        </div>
      </div>
    </div>
    <div
      class="box"
      v-loading="loading"
      element-loading-text="识别中，请稍等..."
      element-loading-spinner="el-icon-loading"
    >
      <div class="upload-box">
        <div class="set-title">图片文件:</div>
        <div class="item" ref="parentEl">
          <el-upload
            v-show="!src"
            class="upload-demo"
            drag
            :limit="1"
            action="/upload"
            list-type="false"
            :accept="'image/*'"
            :file-list="fileList"
            :http-request="chooseImage"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">
              只能上传图片格式的文件，如jpg，png等等
            </div>
          </el-upload>
          <img
            v-show="src"
            :src="src"
            width="100%"
            style="max-height: 100%; width: 100%"
          />
        </div>
      </div>
      <div class="result-box">
        <div class="set-title">识别结果:</div>
        <div class="item">
          <p class="text">{{ resultText }}</p>
        </div>
      </div>
    </div>
    <div class="save-box" v-show="src">
      <span class="btn">复制内容</span>
      <el-button type="text" size="mini" @click="clear"
        >清空内容重新上传</el-button
      >
    </div>
    <div class="block" style="margin-top: 16px">
      <el-button
        class="btn"
        style="width: 100%"
        type="primary"
        @click="submit"
        :disabled="disabledBtn"
        >开 始 识 别</el-button
      >
    </div>
  </div>
</template>
<script>
import LanguageList from "@/config/languageList";
import { defineComponent, ref, computed } from "vue";
import { ElNotification } from "element-plus";
import { discern } from "@/services/discern";
export default defineComponent({
  setup() {
    const languageList = ref(LanguageList),
      loading = ref(false),
      fileList = ref([]),
      language = ref("CHN_ENG"),
      src = ref(""),
      file = ref(null),
      resultText = ref("");
    const disabledBtn = computed(() => !src.value);
    const chooseImage = async (e) => {
      try {
        file.value = e.file;
        const url = URL.createObjectURL(e.file);
        src.value = url;
      } catch (error) {
        console.log(error);
        ElNotification({
          type: "error",
          title: "提示",
          message: error.msg || "失败,请重试",
          duration: 0,
        });
      }
    };

    const submit = async () => {
      loading.value = true;
      try {
        let formData = new FormData();
        formData.append("file", file.value);
        formData.append("language", language.value);
        console.log(file);
        const data = await discern(formData);
        const { words_result = [] } = data;
        let words = words_result.map((item) => item.words);
        resultText.value = words.join("\n") || "";
        loading.value = false;
        if (!resultText.value) {
          ElNotification({
            title: "提示",
            message: "无法识别你上传的数据",
            type: "error",
          });
        }
      } catch (error) {
        loading.value = false;
        if (error.message !== "403") {
          ElNotification({
            title: "提示",
            message: error.msg || "识别失败,请重试",
            type: "error",
          });
        }
      }
    };
    return {
      languageList,
      loading,
      fileList,
      language,
      src,
      file,
      resultText,
      disabledBtn,
      chooseImage,
      submit,
      clear() {
        src.value = "";
        fileList.value = [];
      },
    };
  },
});
</script>
<style lang="scss" scoped>
.discern {
  width: 1200px;
  margin: 0 auto;
  margin-top: 4%;
  .set-title{
      font-size: 14px;
      color:#000;
      padding-bottom: 6px;
      font-weight: bold;
  }
  :deep(.el-upload-dragger) {
    width: 280px;
  }
  .box {
    background: #fff;
    padding: 10px;
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    & > div {
      width: 46%;
      min-width: 300px;
      margin: 0 auto !important;
      div {
        span {
          font-weight: normal;
          color: #409eff;
        }
      }
      .item {
        width: 96%;
        margin: 10px auto;
        padding: 0 10px;
        height: 320px;
        overflow: auto;
        background: #f5f6f7;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .result-box {
      margin: 0;
      .item {
        align-items: flex-start;
      }
      .text {
        margin-top: 2%;
        width: 100%;
        height: 90%;
        overflow-y: auto;
      }
    }
    .upload-box {
      margin: 0;
    }
  }
  .save-box {
    text-align: right;
    background: #fff;
    padding: 0 20px;
    .btn {
      color: #409eff;
      font-size: 12px;
      margin-right: 20px;
      cursor: pointer;
    }
  }
}
</style>