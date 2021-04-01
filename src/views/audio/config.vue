<template>
  <div class="audio-config">
    <el-collapse v-model="activeNames" accordion>
      <el-collapse-item name="1">
        <template #title>
          语音引擎设置<i class="header-icon el-icon-info"></i>
        </template>
        <el-radio-group v-model="options.voiceType">
          <el-radio
            :label="item.value"
            v-for="(item, index) in voiceConfig.voice"
            :key="index"
            >{{ item.name }}</el-radio
          >
        </el-radio-group>
        <div class="per">
          <el-radio-group v-model="options.per">
            <el-radio
              style="margin: 10px"
              :label="item.value"
              v-for="(item, index) in voiceConfig[options.voiceType]"
              :key="index"
            >
              {{ item.name }}
              <el-tag v-if="item.hot" type="danger" size="mini">推荐</el-tag>
            </el-radio>
          </el-radio-group>
        </div>
      </el-collapse-item>
      <el-collapse-item title="多样化设置（建议使用默认配置）" name="2">
        <div class="other">
          <div class="block">
            <span class="demonstration">音量大小：{{ options.vol }}</span>
            <el-slider
              v-model="options.vol"
              show-stops
              :min="voiceConfig.volume[options.voiceType].min"
              :max="voiceConfig.volume[options.voiceType].max"
            ></el-slider>
          </div>
          <div class="block">
            <span class="demonstration">音调高低：{{ options.pit }}</span>
            <el-slider
              v-model="options.pit"
              show-stops
              :min="voiceConfig.pitch[options.voiceType].min"
              :max="voiceConfig.pitch[options.voiceType].max"
            ></el-slider>
          </div>
          <div class="block">
            <span class="demonstration">语速快慢：{{ options.spd }}</span>
            <el-slider
              v-model="options.spd"
              show-stops
              :min="voiceConfig.speed[options.voiceType].min"
              :max="voiceConfig.speed[options.voiceType].max"
            ></el-slider>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref, reactive } from "vue";
import { voiceConfig as vConfig } from "@/config/videoConfig";
export default defineComponent({
  el: "audio-config",
  setup() {
    const voiceConfig = reactive(vConfig);
    const options = reactive({
      voiceType: "tengxun",
      spd: 0,
      pit: 5,
      vol: 0,
      per: 1000,
    });
    const activeNames = ref("1");
    watch(
      () => options.voiceType,
      (voiceType) => {
        options.vol = voiceConfig.volume[voiceType].default;
        options.spd = voiceConfig.speed[voiceType].default;
        options.pit = voiceConfig.pitch[voiceType].default;
        options.per = voiceConfig.per[voiceType];
      }
    );
    return {
      activeNames,
      voiceConfig,
      options,
    };
  },
});
</script>
<style lang="scss" scoped>
.audio-config {
  .per {
    margin-top: 10px;
    background: #ece8e869;
    padding: 10px;
    border-radius: 4px;
  }
  :deep(.el-collapse-item__wrap) {
    padding: 10px;
  }
  :deep(.el-radio__label) {
    font-size: 12px;
  }
  :deep(.el-collapse-item__header) {
    height: 36px;
    line-height: 36px;
  }
}
</style>