<template>
  <el-dialog v-model="dialogVisible" :title="type + ' issue'">
    <el-form :model="form">
      <el-form-item label="Title" label-width="140px">
        <el-input v-model.trim="form.title" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Body" label-width="140px">
        <el-input v-model.trim="form.body" autocomplete="off" />
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
import $axios from "@/axios";
export default {
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
      this.form = JSON.parse(JSON.stringify(data));
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
      if (this.form.title.trim() === "") {
        return ElMessage({
          message: "Title 不得空白",
          type: "warning",
        });
      }

      let config = {
        url:
          this.type === "edit"
            ? `repos/${this.$store.state.auth.userInfo.login}/${this.$route.params.name}/issues/${this.form.number}`
            : `repos/${this.$store.state.auth.userInfo.login}/${this.$route.params.name}/issues`,
        method: this.type === "edit" ? "PATCH" : "POST",
        headers: {
          Authorization: "token " + localStorage.getItem("accessToken"),
        },
        data: {
          title: this.form.title,
          body: this.form.body,
          labels: [this.form.labels[0]["name"]],
        },
      };

      try {
        const results = await $axios(config);

        if (results.status === 200 || results.status === 201) {
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
