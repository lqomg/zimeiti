<template>
  <div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      style="width: 1200px; margin: 0 auto"
      @select="handleSelect"
      mode="horizontal"
    >
      <el-menu-item index="/home">首页</el-menu-item>
      <el-menu-item index="/clearwater">水印去除</el-menu-item>
      <el-menu-item index="/discern">文字识别</el-menu-item>
      <el-menu-item index="/audio">语音合成</el-menu-item>
      <el-menu-item index="/weight">权重查询</el-menu-item>
      <el-menu-item index="/terminal">终端系统</el-menu-item>
      <el-submenu index="downs">
        <template #title>资源下载</template>
        <el-menu-item index="/downs/softdown">工具软件</el-menu-item>
        <el-menu-item index="/downs/audioDown">特色音频语音</el-menu-item>
      </el-submenu>
      <el-menu-item style="float: right; margin-right: 20px">
        <el-dropdown v-if="code && token" @command="handleCommand">
          <span class="el-dropdown-link">
            <el-button type="text" style="padding: 0">{{ code }}</el-button>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="exit">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button type="text" v-else @click="login"> 登录 </el-button>
      </el-menu-item>
    </el-menu>
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
const { shell } = require("electron");
export default {
  setup() {
    const store = useStore<{ user: any }>();
    const router = useRouter();
    const route = useRoute();
    let activeIndex = computed(() => {
      return route.path || "/home";
    });
    const handleCommand = (type: string) => {
      if (type === "exit") {
        store.dispatch("user/logout");
      } else {
      }
    };
    const code = computed(() => store.state.user.code);
    const token = computed(() => store.state.user.token);
    const login = () => {
      router.push("/login");
    };
    const handleSelect = (path: string) => {
      if (!path) return;
      switch (path) {
        case "/downs/softdown":
        case "/downs/audioDown":
          shell.openExternal(`https://zimeitizizhu.com` + path);
          break;
        default:
          router.push(path);
          break;
      }
    };
    return {
      activeIndex,
      code,
      token,
      handleCommand,
      login,
      handleSelect,
    };
  },
};
</script>