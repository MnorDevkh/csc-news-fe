import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/view/HomePage.vue';
import BiblePage from '../components/view/BiblePage.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/bible',
    name: 'bible',
    component: BiblePage,
  },
  {
    path: '/bible/:id',
    name: 'bible-detail',
    // Lazy-load the component
    component: () => import('../components/view/BibleDetail.vue'),
  },
  {
    path: '/bible/chapter/:id',
    name: 'bible-chapter-detail',
    component: () => import('../components/view/BibleChapterDetail.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;