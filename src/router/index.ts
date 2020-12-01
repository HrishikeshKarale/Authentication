import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import HelloWorld from "@/components/HelloWorld.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "HelloWorld",
    component: HelloWorld
  },
  {
    path: "/login",
    name: "login",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "Login" */ "@/components/Login.vue"),
    meta: {
      guest: true
    }
  },
  {
    path: "/register",
    name: "register",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "Register" */ "@/components/Register.vue"),
    meta: {
      guest: true
    }
  },
  {
    path: "/dashboard",
    name: "userboard",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "UserBoard" */ "@/components/UserBoard.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/admin",
    name: "admin",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "Admin" */ "@/components/Admin.vue"),
    meta: {
      requiresAuth: true,
      isAdmin: true
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('jwt') == null) {
      next({
        path: '/login',
        params: { nextUrl: to.fullPath }
      })
    } else {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (to.matched.some(record => record.meta.isAdmin)) {
        if (user.isAdmin == 1) {
          next()
        }
        else {
          next({ name: 'userboard' })
        }
      } else {
        next()
      }
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (localStorage.getItem('jwt') == null) {
      next()
    }
    else {
      next({ name: 'userboard' })
    }
  } else {
    next()
  }
})

export default router;
