import { createRouter, createWebHistory } from "vue-router";
import Issue from "@/views/Issue.vue";
import AllRepo from "@/views/AllRepo.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: AllRepo,
      meta: { requiresAuth: true, title: "Repositories" },
      children: [
        {
          path: "/Issue/:name",
          name: "Issue",
          component: Issue,
          meta: { title: "Issues" },
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
      meta: { title: "Login" },
    },
  ],
});

router.beforeEach((to) => {
  // 需要憑證的頁面，當下卻沒有 token，則引導到 首頁
  if (to?.meta?.requiresAuth && !localStorage.getItem("accessToken")) {
    return "/login";
  }
  if (to.meta.title) {
    document.title = to.meta.title;
  }
});

export default router;
