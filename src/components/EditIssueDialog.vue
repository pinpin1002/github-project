<template>
  <el-dialog v-model="dialogVisible" :title="type">
    <el-form :model="form">
      <el-form-item label="Title" label-width="140px">
        <el-input v-model="form.title" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Body" label-width="140px">
        <el-input v-model="form.body" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Status" label-width="140px">
        <el-select v-model="form.labels[0]['name']" class="m-2" placeholder="Select" size="large">
          <el-option v-for="item in options" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="hideEditIssueDialog">Cancel</el-button>
        <el-button type="primary" @click="editIssue"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ElMessage } from "element-plus";
export default {
  props: ["octokit"],
  data() {
    return {
      form: {
        title: "",
        body: "",
        labels: [
          {
            name: "Open",
          },
        ],
      },
      dialogVisible: false,
      options: ["Open", "In Progress", "Done"],
      type: "create",
    };
  },
  methods: {
    open(data = this.form, typeName = "create") {
      this.form = { ...data };
      this.type = typeName;
      this.dialogVisible = true;
    },
    hideEditIssueDialog() {
      (this.form = {
        title: "",
        body: "",
        labels: [
          {
            name: "Open",
          },
        ],
      }),
        (this.dialogVisible = false);
    },
    async editIssue() {
      let url =
        this.type === "create"
          ? "POST /repos/{owner}/{repo}/issues"
          : "PATCH /repos/{owner}/{repo}/issues/{issue_number}";
      try {
        const result = await this.octokit.request(url, {
          owner: "pinpin1002",
          repo: this.$route.params.name,
          issue_number: this.form.number,
          title: this.form.title,
          body: this.form.body,
          labels: [this.form.labels[0]["name"]],
        });
        if (result.status === 200 || result.status === 201) {
          this.hideEditIssueDialog();
          this.$emit("refreshTable");
          ElMessage({
            message: "完成",
            type: "success",
          });
        }
      } catch (error) {
        ElMessage({
          message: "失敗",
          type: "error",
        });
      } finally {
        this.hideEditIssueDialog();
      }
    },
  },
};
</script>
