<template>
  <div class="videoTable">
    <elTable
      :data="tableData"
      :default-sort="{ prop: 'date', order: 'descending' }"
    >
      <elTableColumn label="封面" align="center" width="80px">
        <template #default="scope">
          <el-image
            fit="contain"
            :src="scope.row.screenShots"
            style="height: 50px"
          ></el-image>
        </template>
      </elTableColumn>
      <elTableColumn
        prop="originTitle"
        show-overflow-tooltip
        label="原始标题"
      ></elTableColumn>
      <elTableColumn prop="duration" label="时长" width="80px"></elTableColumn>
      <elTableColumn
        prop="format_long_name"
        label="格式"
        show-overflow-tooltip
        width="140px"
      ></elTableColumn>
      <elTableColumn prop="size" label="大小" width="100px"></elTableColumn>
      <elTableColumn label="尺寸" width="100px">
        <template #default="scope">
          {{
            (scope.row.convertWidth || scope.row.width) +
            "*" +
            (scope.row.convertHeight || scope.row.height)
          }}
        </template>
      </elTableColumn>
      <elTableColumn label="进度" width="180px">
        <template #default="scope">
          <el-progress
            :text-inside="true"
            :stroke-width="26"
            :status="progressStatus[scope.row.status || 'start']"
            :percentage="scope.row.progress || 0"
          ></el-progress>
        </template>
      </elTableColumn>
      <elTableColumn prop="status" label="状态" width="120px">
        <template #default="scope">
          {{ statusText[scope.row.status] || "未知状态" }}
          <elTooltip
            v-if="scope.row.status == 'error'"
            class="item"
            effect="light"
            placement="top"
          >
            <i class="el-icon-warning" style="color: #f56c6c">[查看]</i>
            <template #content>
              <div style="max-width: 500px">
                {{ scope.row.msg || scope.row.errorMsg || "未知错误" }}
              </div>
            </template>
          </elTooltip>
        </template>
      </elTableColumn>
      <elTableColumn label="原始地址" show-overflow-tooltip>
        <template #default="scope">
          <span style="color: #66b1ff" @click="openWindow(scope.row.url)">{{
            scope.row.originUrl || "---"
          }}</span>
        </template>
      </elTableColumn>
      <elTableColumn label="更新时间" width="150px">
        <template #default="scope">
          {{ scope.row.updateDate || scope.row.date || "未知状态" }}
        </template>
      </elTableColumn>
      <elTableColumn label="操作" width="130px" fixed="right">
        <template #default="scope">
          <elSpace>
            <elLink
              :disabled="scope.row.disabled"
              href="javascript:void(0)"
              type="danger"
              size="mini"
              @click="handleDelete(scope.$index, scope.row)"
            >
              删除
            </elLink>
            <elLink
              :disabled="scope.row.disabled"
              href="javascript:void(0)"
              v-if="scope.row.status == 'success'"
              size="mini"
              type="success"
              @click="handleOpen(scope.row)"
              >打开/编辑
            </elLink>
            <elLink
              :disabled="scope.row.disabled"
              href="javascript:void(0)"
              v-else
              size="mini"
              type="primary"
              @click="handleDown(scope.$index, scope.row)"
              >下载/导出
            </elLink>
          </elSpace>
        </template>
      </elTableColumn>
    </elTable>
    <elPagination
      style="text-align: right; margin-top: 20px; margin-bottom: 100px"
      layout="prev, pager, next, total"
      :total="total"
      v-if="total > 0"
      :page-size="pageSize"
      :current-page="pageNumber"
      @current-change="handleCurrentChange"
    ></elPagination>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref, toRef, onMounted } from "vue";
import { ipcRenderer,shell } from "electron";
import { saveVideo } from "./utils";
import { ElMessage, ElNotification } from "element-plus";
import {
  progressStatus as progress,
  statusText as status,
} from "@/config/clearwater";
export default defineComponent({
  name: "videoTable",
  props: {
    size: String,
    type: String,
  },
  setup(props) {
    const size = toRef(props, "size");
    const type = toRef(props, "type");
    let pageNumber = ref(1),
      pageSize = ref(10),
      total = ref(0),
      tableData = ref([]),
      progressStatus = ref(progress),
      statusText = ref(status);
    const getVideoList = () => {
      const params = {
        pageSize: pageSize.value,
        pageNumber: pageNumber.value,
      };
      const resData = ipcRenderer.sendSync("get-video-list", params) || [];
      tableData.value = resData.list;
      total.value = resData.total;
    };
    onMounted(() => {
      getVideoList();
    });
    const handleCurrentChange = (number: number) => {
      pageNumber.value = number;
      getVideoList();
    };
    const handleDelete = (index: number, row: any) => {
      const { _id, filename } = row;
      const isOk = ipcRenderer.sendSync("delete-video", _id);
      if (isOk === true) {
        getVideoList();
      } else {
        ElNotification({
          type: "error",
          title: "提示",
          message: "删除失败：" + isOk,
          duration: 1500,
        });
      }
    };
    const handleOpen = (row: any) => {
      const { filePath } = row;
      shell.showItemInFolder(filePath);
    };
    const handleDown = (index: number, row: any) => {
      const { _id, url, width, height } = row;
      saveVideo(
        url,
        type.value,
        size.value == "origin" ? `${width}|${height}` : size.value,
        _id
      );
      ipcRenderer.on("reply-save-video", (event, arg) => {
        const { tag, msg, data } = arg || {};
        const {
          idx,
          percent,
          err,
          filePath,
          convertType,
          convertWidth,
          convertHeight,
        } = data || {};
        const index = tableData.value.findIndex(
          (o: { _id: String }) => o._id == idx
        );
        let obj: {
          [k: string]: string | number;
        } = {};
        tableData.value[index] = Object.assign(tableData.value[index], {
          disabled: true,
        });
        if (tag == "progress") {
          obj = {
            filePath,
            progress: Number((percent || 0).toFixed(2)),
            msg,
          };
        } else if (tag == "start") {
          obj = {
            filePath,
            status: "ing",
            msg,
            progress: 0,
          };
        } else if (tag == "end") {
          obj = {
            msg,
            filePath,
            status: "success",
            progress: 100,
          };
          tableData.value[index] = Object.assign(tableData.value[index], {
            disabled: false,
          });
        } else {
          obj = {
            msg,
            filePath,
            status: "error",
            progress: 100,
          };
          tableData.value[index] = Object.assign(tableData.value[index], {
            disabled: false,
          });
        }
        obj.progress = obj.progress > 100 ? 100 : obj.progress;
        Object.assign(obj, {
          convertType,
          convertWidth,
          convertHeight,
        });
        const temp = Object.assign(tableData.value[index], obj);
        tableData.value[index] = temp;
      });
    };
    return {
      progressStatus,
      statusText,
      pageSize,
      pageNumber,
      total,
      tableData,
      getVideoList,
      handleDelete,
      handleDown,
      handleCurrentChange,
      handleOpen,
    };
  },
});
</script>