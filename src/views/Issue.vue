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
          :cell-class-name="hello"
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
  <EditIssueDialog ref="dialog" @refreshTable="refreshIssues" :octokit="octokit" />
</template>

<script>
import { Octokit } from "https://cdn.skypack.dev/octokit";
import dayjs from "dayjs";
import EditIssueDialog from "@/components/EditIssueDialog.vue";
import axios from "axios";
export default {
  components: { EditIssueDialog },
  data() {
    return {
      token: localStorage.getItem("accessToken"),
      issues: [],
      search: "",
      octokit: null,
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
    this.octokit = new Octokit({
      auth: this.token,
    });
    this.listAllIssues();
  },
  computed: {
    filterTableData() {
      return this.issues.filter((data) => !this.search || data.title.toLowerCase().includes(this.search.toLowerCase()));
    },
  },
  methods: {
    hello({ row, rowIndex }) {
      // if (row.labels[0].name) {
      //   console.log(row.labels[0].name);
      //   return row.labels[0].name;
      // }
    },
    async refreshIssues() {
      this.loading = true;
      try {
        const results = await axios(
          `https://api.github.com/repos/pinpin1002/${this.$route.params.name}/issues?per_page=` +
            this.perPage +
            "&page=1",
          {
            method: "GET",
            headers: {
              Authorization: this.token,
            },
          }
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
        const results = await axios(
          `https://api.github.com/repos/pinpin1002/${this.$route.params.name}/issues?per_page=` +
            this.perPage +
            "&page=" +
            this.page,
          {
            method: "GET",
            headers: {
              Authorization: this.token,
            },
          }
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
      await this.octokit.request("PATCH /repos/{owner}/{repo}/issues/{issue_number}", {
        owner: "pinpin1002",
        repo: this.$route.params.name,
        issue_number: row.number,
        state: "closed",
      });
    },
    async handleEdit(row, type) {
      this.$refs.dialog.open(row, type);
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
  padding: 15px 20px;
}
:deep(.labels.Open .cell) {
  color: green;
}
.createIssuebtn {
  margin-bottom: 10px;
  margin-left: 20px;
}
</style>
