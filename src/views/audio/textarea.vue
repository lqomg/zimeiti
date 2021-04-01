<template>
  <el-card class="textarea" shadow="never">
    <el-input
      :show-word-limit="true"
      type="textarea"
      :autosize="{ minRows: 10 }"
      placeholder="请输入需要合成的语音内容"
      v-model="text"
      maxlength="2000"
    ></el-input>
  </el-card>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, toRef, reactive } from "vue";
export default defineComponent({
  el: "textarea",
  setup() {
    let text = ref("");
    return {
      text,
    };
  },
});
</script>
<style lang="scss" scoped>
.textarea {
  margin: 0 auto;
  :deep(.el-textarea textarea) {
    border: none;
  }
  :deep(.el-card__body) {
    padding: 2px;
  }
}
</style>