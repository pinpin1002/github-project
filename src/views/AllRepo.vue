<template>
  <Header />
  <h1>Repositories:</h1>
  <el-container>
    <el-aside width="200px">
      <router-link :to="`/Issue/${item.name}`" v-for="(item, index) in repoLists" :key="index">
        <el-card class="box-card">
          {{ item.name }}
        </el-card>
      </router-link>
    </el-aside>
    <el-main>
      <RouterView />
    </el-main>
  </el-container>
</template>

<script>
import { hasData } from "@/utils";
import Header from "@/components/Header.vue";
export default {
  components: { Header },
  data() {
    return {
      repoLists: [],
    };
  },
  created() {
    if (!this.$store.state.auth.octokit) {
      this.$store.commit("auth/setOctokit");
    }
  },
  computed: {
    isUserDataLoaded() {
      return hasData(this.$store.state.auth.userInfo);
    },
  },
  methods: {
    async listAllRepo() {
      const { data, status } = await this.$store.state.auth.octokit.request("GET /users/{username}/repos", {
        username: this.$store.state.auth.userInfo.login,
      });
      if (status === 200) {
        this.repoLists = data;
      }
    },
  },
  watch: {
    isUserDataLoaded() {
      if (this.isUserDataLoaded) {
        this.listAllRepo();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.el-main {
  padding-top: 0;
}
.box-card {
  background-color: var(--el-text-color-regular);
  transition: all 0.5s;
  &:hover {
    background-color: var(--el-color-success);
    opacity: 0.6;
  }
  ::v-deep(.el-card__body) {
    color: white;
  }
}
</style>
