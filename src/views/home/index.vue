<template>
  <div class="home">
    <elAlert
      :title="`当前版本：${version}。软件下载、问题反馈、交流沟通QQ群：576301295。`"
      type="info"
    ></elAlert>
    <div class="list">
      <el-card
        :class="{ 'box-card': true }"
        shadow="hover"
        :body-style="{
          padding: '10px 16px',
          background: item.disabled ? 'rgba(204, 204, 204, 0.45)' : '',
          cursor: item.disabled ? 'not-allowed' : '',
        }"
        v-for="(item, index) in list"
        :key="index"
      >
        <div slot="header" class="clearfix">
          <h4>{{ item.name }}</h4>
          <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
        </div>
        <div class="info">{{ item.info }}</div>
        <div class="href" @click="goView(item)">
          <el-link type="primary" href="javascript:void(0)">点击进入</el-link>
        </div>
      </el-card>
    </div>
    <div class="plan">
      <el-divider
        ><i
          class="el-icon-time"
          style="font-size: 18px; margin-right: 10px"
        ></i>
        <span style="font-weight: 700; font-size: 18px"
          >开 发 计 划</span
        ></el-divider
      >
      <ul>
        <li
          v-for="(item, index) in plans"
          :key="index"
          :class="{ active: item.disabled }"
        >
          <el-checkbox
            disabled
            size="medium"
            v-model="item.disabled"
          ></el-checkbox>
          {{ item.content }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
// import PageLoading from './components/PageLoading/index.vue';
// const ArticleChartCard = defineAsyncComponent({
//   loader: () => import('./components/ArticleChartCard/index.vue'),
//   loadingComponent: PageLoading
// });

export default defineComponent({
  name: "Home",
  setup() {
    const list = [
      {
        name: "水印去除",
        info: "在线去除短视频中的水印，支持抖音、快手等30多个短视频平台",
        img: "",
        href: "/clearwater",
      },
      {
        name: "语音合成",
        info: "在线文字生成语音，支持讯飞、腾讯和百度等多个语音引擎",
        img: "",
        href: "/audio",
      },
      {
        name: "文字识别",
        info:
          "支持英文、中文、法语等九种文字识别功能，选择任意一张图片完成文字识别。",
        img: "",
        href: "/discern",
      },
      {
        name: "Ffmpeg终端",
        info: "集成强大的视/音频处理框架，低成本学习，方便快捷",
        img: "",
        href: "/terminal",
      },
      {
        name: "权重查询",
        info: "支持头条号权重查询，掌握自己账号权重，对自己账号更有信心。",
        img: "",
        href: "/weight",
      },
      {
        name: "资源下载",
        info:
          "自媒体热门资源下载，包括常用工具软件，各类特色视频、音频片段等。",
        img: "",
        href: "/downs/audioDown",
        // disabled: true,
      },
    ];
    const router = useRouter();
    const goView = (item: any) => {
      if (item.disabled) return;
      router.push(item.href);
    };
    const plans = [
      {
        content: "支持大部分短视频平台的水印去除并保存历史记录",
        disabled: true,
      },
      {
        content: "支持腾讯、百度、讯飞等语音合成并保存历史记录",
        disabled: true,
      },
      {
        content: "支持图片文字识别功能",
        disabled: true,
      },
      {
        content: "支持自媒体账号的权重查询，需扩展",
        disabled: true,
      },
      {
        content: "集成强大的视/音频处理框架，低成本学习，方便快捷",
        disabled: true,
      },
      {
        content: "支持建立监管机制的在线互粉功能",
      },
      {
        content: "兼容 Mac和 Linux",
      },
      {
        content: "支持绕过短视频平台审核机制的视频、语音编辑",
      },
      {
        content: "支持只通过一段文字自动生成视频(超重磅功能，敬请期待)",
        hot: true,
      },
    ];
    const version = ref(localStorage.version);
    return {
      version,
      list,
      goView,
      plans,
    };
  },
});
</script>
<style lang="scss" scoped>
.home {
  width: 1200px;
  margin: 2% auto;
  .list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-self: baseline;
    .disabled {
      background: #ccc;
    }
    .box-card {
      color: #555;
      margin-top: 26px;
      width: 32%;
      cursor: pointer;
      .el-card__body {
        padding: 10px !important;
      }
      .info {
        font-size: 15px;
        min-height: 30px;
      }
      .href {
        margin-top: 10px;
        font-size: 14px;
        a {
          color: #409eff;
        }
      }
    }
  }
  .plan {
    margin-top: 50px;
    ul {
      li {
        font-size: 18px;
        list-style: none;
        display: inline-block;
        padding: 16px;
        color: #555;
      }
      .active {
        color: #409eff;
      }
    }
  }
}
</style>
