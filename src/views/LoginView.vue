<template>
  <div class="wrapper">
    <el-button type="default" class="login-btn" size="large" @click="loginWithGithub">
      <img src="@/assets/images/github-mark.png" alt="github-logo" />
      <span>Log In with GitHub</span>
    </el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      CLIENT_ID: import.meta.env.VITE_CLIENT_ID,
    };
  },
  created() {
    if (localStorage.getItem("accessToken") === null && this.$route.query.code) {
      this.getAccessToken();
    } else {
      this.$router.push("/");
    }
  },
  methods: {
    loginWithGithub() {
      window.location.assign(`https://github.com/login/oauth/authorize?client_id=${this.CLIENT_ID}&scope=repo`);
    },
    async getAccessToken() {
      this.$store.dispatch("auth/getLogin");
    },
  },
};
</script>

<style scoped lang="scss">
.wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  height: 50%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;

  .login-btn {
    padding: 20px;
    display: inline-flex;
    align-items: center;
    background-color: #57606a;
    color: #fff;
    img {
      width: 30px;
      height: 30px;
      margin-right: 10px;
    }
    &:active {
      border-color: #57606a;
    }
  }
}
</style>
