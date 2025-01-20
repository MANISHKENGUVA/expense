import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import SheetDetails from '../views/SheetDetails.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/sheet/:id',
      name: 'sheet-details',
      component: SheetDetails,
      props: true
    }
  ]
});

export default router;