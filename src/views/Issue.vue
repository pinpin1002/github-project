<template>
  <div>
    <el-container>
      <el-main>
        <el-button
          type="success"
          data-network="Github"
          class="createIssuebtn"
          size="large"
          @click="handleEdit(undefined, 'create')"
        >
          <span>Create an issue</span>
        </el-button>
        <el-table
          border
          :data="filterTableData"
          style="width: 100%"
          max-height="500"
          :cell-class-name="cellClassName"
          v-loading="loading"
        >
          <el-table-column prop="number" label="#" width="50" />
          <el-table-column prop="title" label="Title" width="200" />
          <el-table-column prop="body" label="Body" />
          <el-table-column prop="labels[0].name" label="Label" width="100" class-name="labels" />
          <el-table-column prop="updated_at" label="Updated" width="300" />

          <el-table-column align="right">
            <template #header>
              <el-input v-model="search" size="small" placeholder="Type to search" />
            </template>
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.row, 'edit')">Edit</el-button>
              <el-popconfirm title="Are you sure to delete this?" @confirm="handleDelete(scope.row)">
                <template #reference>
                  <el-button size="small" type="danger">Delete</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
          <template #append>
            <p v-if="noMore">No More Data</p>
          </template>
        </el-table>
      </el-main>
    </el-container>
  </div>
  <EditIssueDialog ref="dialog" @refreshTable="refreshIssues" />
</template>

<script>
import dayjs from "dayjs";
import $axios from "@/axios";
import { hasData } from "@/utils";
import { ElMessage } from "element-plus";

import EditIssueDialog from "@/components/EditIssueDialog.vue";

export default {
  components: { EditIssueDialog },
  data() {
    return {
      issues: [],
      search: "",
      page: 1,
      loading: false,
      noMore: false,
      perPage: 10,
    };
  },
  created() {
    this.$watch(
      () => this.$route.params,
      () => {
        this.refreshIssues();
      }
    );
    if (hasData(this.$store.state.auth.userInfo)) {
      this.listAllIssues();
    }
  },
  computed: {
    filterTableData() {
      return this.issues.filter((data) => !this.search || data.title.toLowerCase().includes(this.search.toLowerCase()));
    },
    isUserDataLoaded() {
      return this.$store.state.auth.userInfo;
    },
  },
  methods: {
    cellClassName({ row }) {
      if (row.labels[0].name) {
        switch (row.labels[0].name) {
          case "In Progress":
            return "Progress";
          case "Done":
            return "Done";
          case "Open":
            return "Open";
          default:
            return "";
        }
      }
    },
    async refreshIssues() {
      this.loading = true;
      try {
        const results = await $axios.get(
          `repos/${this.$store.state.auth.userInfo.login}/${this.$route.params.name}/issues?per_page=` +
            this.perPage +
            "&page=1"
        );
        if (results.status === 200) {
          let data = results.data.map((item) => ({
            ...item,
            updated_at: dayjs(item.updated_at).format("YYYY/MM/DD hh:mm:ss"),
          }));
          this.issues = data;
          this.loading = false;
        }
      } catch (error) {
        console.log("error", error);
      }
    },
    async listAllIssues() {
      this.loading = true;
      try {
        const results = await $axios.get(
          `repos/${this.$store.state.auth.userInfo.login}/${this.$route.params.name}/issues?per_page=` +
            this.perPage +
            "&page=" +
            this.page
        );
        if (results.status === 200) {
          if (results.data.length < this.perPage) {
            this.noMore = true;
          }
          let data = results.data.map((item) => ({
            ...item,
            updated_at: dayjs(item.updated_at).format("YYYY/MM/DD hh:mm:ss"),
          }));
          this.issues.push(...data);
          this.loading = false;
        }
      } catch (error) {
        console.log("error", error);
      }
    },
    async handleDelete(row) {
      try {
        const results = await $axios.patch(
          `https://api.github.com/repos/${this.$store.state.auth.userInfo.login}/${this.$route.params.name}/issues/${row.number}`,
          {
            state: "closed",
          },
          {
            headers: {
              Authorization: "token " + localStorage.getItem("accessToken"),
            },
          }
        );
        if (results.status === 200) {
          ElMessage({
            message: "完成",
            type: "success",
          });
        }
      } catch (error) {
        ElMessage({
          message: "錯誤",
          type: "error",
        });
      } finally {
        this.refreshIssues();
      }
    },
    async handleEdit(row, type) {
      this.$refs.dialog.open(row, type);
    },
  },
  watch: {
    isUserDataLoaded() {
      if (hasData(this.$store.state.auth.userInfo)) {
        this.listAllIssues();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/main.scss";

:deep(.el-table__append-wrapper) {
  p {
    font-size: 20px;
    text-align: center;
  }
}
:deep(.el-table__empty-block) {
  display: none;
}
.el-button {
  min-width: 50px;
  padding: 0px 10px;
}
:deep(.labels.Open) {
  text-align: center;
  color: #fff;
  background-color: var(--el-color-success);
}
:deep(.labels.Progress) {
  text-align: center;
  color: #fff;
  background-color: var(--el-color-warning);
}
:deep(.labels.Done) {
  text-align: center;
  color: #fff;
  background-color: var(--el-color-info);
}
.createIssuebtn {
  margin-bottom: 10px;
  margin-left: 20px;
}
</style>
