<template>
  <div class="login">
    <div class="login-info">
      <div class="notice">
        微信扫描下方<span>二维码</span>或搜索自媒体自助，进入小程序<i
          class="el-icon-right"
        ></i
        >我的<i class="el-icon-right"></i>管理，即可免费获取code。默认密码1234
      </div>
      <el-image
        :src="require('@/assets/images/qrcode.png')"
        fit="fit"
      ></el-image>
    </div>
    <div class="main">
      <h4 class="title">用 户 登 录</h4>
      <el-form :model="modelRef" :rules="rulesRef" ref="formRef">
        <el-form-item label="" prop="username">
          <el-input
            v-model="modelRef.username"
            placeholder="请输入code"
            @keydown.enter="handleSubmit"
          >
            <template #prefix
              ><i class="el-icon-user el-input__icon"></i
            ></template>
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input
            v-model="modelRef.password"
            type="password"
            placeholder="请输入密码,默认密码为1234"
            @keydown.enter="handleSubmit"
          >
            <template #prefix
              ><i class="el-icon-unlock el-input__icon"></i
            ></template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="submit"
            @click="handleSubmit"
            :loading="submitLoading"
          >
            提交
          </el-button>
          <div class="text-align-right">
            <el-link @click="registry" type="primary" href="javascript:void(0)">
              注册
            </el-link>
          </div>
        </el-form-item>

        <el-alert
          v-if="loginStatus === 'error' && !submitLoading"
          title="登录失败"
          type="error"
          show-icon
          :closable="false"
        />
      </el-form>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, reactive, ref, watch, Ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElForm, ElMessage, ElMessageBox } from "element-plus";

interface UserLoginSetupData {
  modelRef: any;
  rulesRef: any;
  formRef: typeof ElForm;
  submitLoading: boolean;
  handleSubmit: () => Promise<void>;
  registry: () => void;
  loginStatus?: "ok" | "error";
}

export default defineComponent({
  name: "UserLogin",
  components: {},
  setup(): UserLoginSetupData {
    const router = useRouter();
    const { currentRoute } = router;
    const store = useStore();

    // 表单值
    const modelRef = reactive<any>({
      username: "",
      password: "",
    });
    // 表单验证
    const rulesRef = reactive({
      username: [
        {
          required: true,
          message: "请输入code",
        },
      ],
      password: [
        {
          required: true,
          message: "请输入密码,默认密码为1234",
        },
      ],
    });
    // form
    const formRef = ref<typeof ElForm>();
    // 登录loading
    const submitLoading = ref<boolean>(false);
    // 登录
    const handleSubmit = async () => {
      submitLoading.value = true;
      try {
        const valid: boolean | undefined = await formRef.value?.validate();
        if (valid === true) {
          const res: boolean = await store.dispatch("user/login", {
            code: modelRef.username,
            password: modelRef.password,
          });
          if (res === true) {
            ElMessage.success("登录成功");
            const { redirect, ...query } = currentRoute.value.query;
            router.replace({
              path: (redirect as string) || "/",
              query: {
                ...query,
              },
            });
          }
        }
      } catch (error) {
        ElMessage.warning(error);
      }
      submitLoading.value = false;
    };

    // 登录状态
    const loginStatus = computed<"ok" | "error" | undefined>(
      () => store.state.user.code
    );
    const registry = () => {
      ElMessageBox.confirm("请使用微信扫描左方二维码即可注册", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      });
      return false;
    };
    return {
      modelRef,
      rulesRef,
      formRef: (formRef as unknown) as typeof ElForm,
      submitLoading: (submitLoading as unknown) as boolean,
      handleSubmit,
      loginStatus: (loginStatus as unknown) as "ok" | "error" | undefined,
      registry,
    };
  },
});
</script>
<style lang="scss" scoped>
.login {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8%;
  .login-info {
    display: inline-block;
    .notice {
      width: 435px;
      color: #b1afaf;
      letter-spacing: 3px;
      line-height: 26px;
      margin: 10px 0;
      span {
        font-weight: bold;
      }
    }
  }
  .main {
    display: inline-block;
    flex: none;
    width: 300px;
    padding: 36px;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.2);
    .title {
      font-size: 28px;
      margin-top: 0;
      margin-bottom: 30px;
      text-align: center;
      color: #b1afaf;
    }
    .submit {
      width: 100%;
    }
  }
}
</style>