<template>
  <el-header>
    <el-row justify="space-between" align="middle">
      <el-col :span="16" class="flexCenter">
        <el-avatar :size="30" :src="$store.state.auth.userInfo.avatar_url" />
        <span>Hi {{ $store.state.auth.userInfo.name }}</span>
      </el-col>
      <el-col :span="8" class="flexEnd">
        <el-button type="info" data-network="Github" class="login-btn" size="large" @click="logOut">
          <span>Log Out</span>
        </el-button>
      </el-col>
    </el-row>
  </el-header>
</template>

<script>
export default {
  created() {
    if (!this.$store.state.auth.octokit) {
      this.$store.commit("auth/setOctokit");
    }

    this.getUserData();
  },
  methods: {
    getUserData() {
      this.$store.dispatch("auth/getUserInfo");
    },
    logOut() {
      this.$store.commit("auth/setLogOut");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/main.scss";
.flexEnd {
  @include flex(end, center);
  gap: 0 10px;
}
.flexCenter {
  @include flex(start, center);
  gap: 0 10px;
}
.el-button {
  padding: 15px 20px;
}
</style>
