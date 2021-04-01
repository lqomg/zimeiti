<template>
  <div class="weight">
    <div class="notice">
      <p>数据仅供参考，目前仅支持头条号权重查询</p>
    </div>
    <div class="input" v-loading="loading">
      <div class="title">请将头条号名称输入到下面的输入框</div>
      <div class="elinput">
        <el-input
          placeholder="请输入头条号名称"
          clearable
          style="background: #f5f7f6"
          v-model="name"
          @keyup.enter="submit"
        >
          <template #prepend>
            <span>头条号</span>
          </template>
          <template #append>
            <el-button @click="submit" :disabled="isDisabled"
              >查询权重</el-button
            >
          </template>
        </el-input>
      </div>
    </div>
    <div class="weigth-info" v-if="updateTime && weightData.length > 0">
      <div class="time">{{ updateTime }}</div>
      <div
        v-for="(list, index) in weightData"
        :key="index"
        :class="{ wrap: true, top: index === 0 }"
      >
        <div v-for="(item, index1) in list" :key="index1" class="item">
          {{ item }}
        </div>
      </div>
    </div>
    <div
      class="article-info"
      v-if="updateTime && weightData.length > 0 && articleData.length > 0"
    >
      <div v-for="(item, index) in articleData" :key="index" class="wrap">
        <div class="top">
          <div class="left">
            <div class="keyword">
              [关键词]
              <span>{{ item[0] }}</span>
            </div>
            <div class="index-number">
              [移动指数]
              <span>{{ item[1] }}</span>
            </div>
            <div class="flow">
              [预估流量]
              <span>{{ item[3] }}</span>
            </div>
          </div>
          <div class="right">
            <div>[移动排名]</div>
            <div class="order">
              <div class="value">{{ item[2] }}</div>
            </div>
          </div>
        </div>
        <div class="title" @click="openUrl(item)">
          [链接地址]&nbsp;&nbsp; {{ item[4] }}
        </div>
      </div>
    </div>
    <div v-if="loadWeight" class="empty">
      没有查询相关数据，可能暂未被收录。
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref, reactive } from "vue";
import { getWeight } from "@/services/weight";
const { shell } = require("electron");
export default defineComponent({
  data() {
    return {
      name: "",
      loading: false,
      updateTime: [],
      weightData: [],
      articleData: [],
      loadWeight: false,
    };
  },
  setup() {
    const name = ref(""),
      loading = ref(false),
      updateTime = ref([]),
      weightData = ref([]),
      articleData = ref([]),
      loadWeight = ref(false);
    const isDisabled = computed(() => !name.value);
    const submit = async () => {
      if (isDisabled.value) return;
      const data = await getWeight({
        name: encodeURIComponent(name.value),
      });
      const { list = {} } = data;
      const { time } = list;
      updateTime.value = time;
      weightData.value = list.weightData;
      articleData.value = list.articleData;
      if (!time || weightData.value.length === 0) {
        loadWeight.value = true;
      }
      loading.value = false;
    };
    const openUrl = (item: any) => {
      const url = item[4];
      shell.openExternal(url);
    };
    return {
      isDisabled,
      name,
      loading,
      updateTime,
      weightData,
      articleData,
      loadWeight,
      submit,
      openUrl,
    };
  },
});
</script>
<style   lang="scss">
.submit {
  .van-button--large {
    height: 40px !important;
  }
}
</style>
<style scoped  lang="scss">
.weight {
  width: 80%;
  height: 100%;
  margin: 20px auto;
  .notice {
    margin: 0 auto;
    background: #fff;
    color: #747d87;
    padding: 10px;
    p {
      display: flex;
      align-items: center;
      font-size: 14px;
    }
  }
  .empty {
    margin-top: 20px;
    padding: 20px 10px;
    color: #747d87;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .note {
      color: #747d87;
    }
  }
  .input {
    margin-top: 10px;
    min-height: 100px;
    background: #fff;
    .title {
      width: 100%;
      color: #ccc;
      text-align: center;
      font-size: 14px;
      padding: 6px;
      line-height: 2;
    }
    .elinput {
      width: 80%;
      margin: 0 auto;
    }
  }
  .submit {
    width: 80%;
    margin: 20px auto;
    .btn {
      width: 100%;
      height: 40px;
    }
  }
  .weigth-info {
    background: #fff;
    padding: 10px;
    .time {
      color: #333;
      padding: 10px 0;
    }
    .top {
      background: #f5f5f5;
      color: #555;
      border-bottom: none !important;
    }
    .wrap {
      display: flex;
      align-items: center;
      justify-content: space-around;
      border: 1px solid #e8e8e8;
      .item {
        display: inline-block;
        width: 26%;
        color: #747d87;
        text-align: center;
        padding: 6px 0;
      }
      .item:nth-child(1) {
        width: 20%;
      }
    }
  }
  .article-info {
    .wrap {
      background: #fff;
      margin-top: 20px;
      padding: 10px;
      color: #333;
      border: 1px solid #ccc;
      border-radius: 2px;
      .top {
        display: flex;
        align-items: center;
        .left {
          width: 70%;
          & > div {
            padding: 4px 2px;
          }
          .keyword {
            span {
              margin-left: 6px;
            }
          }
          .index-number {
            span {
              margin-left: 6px;
              color: #0474c8;
              font-weight: 700;
            }
          }
          .flow {
            span {
              margin-left: 6px;
            }
          }
        }
        .right {
          width: 30%;
          div {
            text-align: center;
          }
          .order {
            width: 100%;
            height: 100%;
            padding-top: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            .value {
              font-weight: bold;
              color: #0474c8;
            }
            .type {
              display: flex;
              align-items: center;
              justify-content: center;
              margin-left: 6px;
            }
          }
        }
      }
      .title {
        margin-top: 8px;
        color: #1989fa;
      }
    }
  }
}
</style>

