<template>
  <div class="history-list">
    <el-drawer
      title="历史记录"
      v-model="drawer"
      size="56%"
      :before-close="handleClose"
      destroy-on-close
    >
      <elTable
        :data="tableData"
        stripe
        style="width: 100%"
        :default-sort="{ prop: 'date', order: 'descending' }"
      >
        <elTableColumn label="名称" prop="fileName" width="120" show-overflow-tooltip>
        </elTableColumn>
        <elTableColumn label="类型" prop="type" width="50"> </elTableColumn>
        <elTableColumn prop="duration" label="时长" width="90"></elTableColumn>
        <elTableColumn
          prop="format_long_name"
          label="格式"
          show-overflow-tooltip
        ></elTableColumn>
        <elTableColumn prop="size" label="大小" width="90"></elTableColumn>
        <elTableColumn prop="date" label="创建时间" width="150"></elTableColumn>
        <elTableColumn label="操作">
          <template #default="scope">
            <el-button
              size="mini"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)"
              >打开目录</el-button
            >
          </template>
        </elTableColumn>
      </elTable>
      <el-pagination
        style="text-align: right; margin-top: 20px; margin-bottom: 100px"
        layout="prev, pager, next, total"
        :total="total"
        v-if="total > 0"
        :page-size="pageSize"
        :current-page="pageNumber"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </el-drawer>
    <div class="history">
      <el-button @click="drawer = !drawer" type="primary">历史记录</el-button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, watch, ref, reactive, onBeforeMount } from "vue";
import { ElNotification } from "element-plus";
const { ipcRenderer, shell } = require("electron");
export default defineComponent({
  setup() {
    const drawer = ref(false),
      pageSize = ref(16),
      pageNumber = ref(1),
      total = ref(0);
    let tableData = ref([]);
    const getAudioList = () => {
      const params = {
        pageSize: pageSize.value,
        pageNumber: pageNumber.value,
      };
      const { list = [], total: count } =
        ipcRenderer.sendSync("get-audio-list", params) || {};
      tableData.value = list;
      total.value = count;
    };
    onBeforeMount(() => {
      getAudioList();
    });
    const handleClose = () => {
      drawer.value = false;
      const tooltips = document.getElementsByClassName("el-tooltip__popper");
      if (tooltips && tooltips.length > 0) {
        for (let i = 0; i < tooltips.length; i++) {
          const element = tooltips[i];
          element.remove && element.remove();
        }
      }
    };
    const handleCurrentChange = (number: number) => {
      pageNumber.value = number;
      getAudioList();
    };
    const handleDelete = (index: number, row: any) => {
      const { _id } = row;
      const isOk = ipcRenderer.sendSync("delete-audio", _id);
      if (isOk === true) {
        pageNumber.value = 1;
        getAudioList();
      } else {
        ElNotification({
          type: "error",
          message: "删除失败",
        });
      }
    };
    const handleEdit = (index: number, row: any) => {
      const { filePath } = row;
      shell.showItemInFolder(filePath);
    };
    return {
      total,
      tableData,
      pageSize,
      pageNumber,
      drawer,
      handleClose,
      handleDelete,
      handleEdit,
      handleCurrentChange,
      getAudioList,
    };
  },
});
</script>
<style lang="scss" scoped>
.history-list {
  .history {
    position: fixed;
    top: 45%;
    right: 0;
  }
}
</style>