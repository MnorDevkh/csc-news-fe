import ArticleDetailsPage from '@/components/view/ArticleDetailsPage.vue'
import BiblePage from '@/components/view/BiblePage.vue'
import CategoryViewPage from '@/components/view/CategoryViewPage.vue'
import GalleryGridViewPage from '@/components/view/GalleryGridViewPage.vue'
import GalleryItemDetailsPage from '@/components/view/GalleryItemDetailsPage.vue'
import HomePage from '@/components/view/HomePage.vue'
import ReadingListPage from '@/components/view/ReadingListPage.vue'
import SearchResultsPage from '@/components/view/SearchResultsPage.vue'
import SingleGalleryViewPage from '@/components/view/SingleGalleryViewPage.vue'

// New Views for modern UI design
import LoginPage from '@/assets/LoginPage.vue'
import DashboardLayout from '@/assets/DashboardLayout.vue'
import Dashboard from '@/assets/Dashboard.vue'
import AdminPanel from '@/assets/AdminPanel.vue'
import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/bible',
      name: 'bible',
      component: BiblePage
    },
    {
      path: '/article/:id',
      name: 'articleDetails',
      component: ArticleDetailsPage,
      props: true // Allows passing route params as props
    },
    {
      path: '/search',
      name: 'searchResults',
      component: SearchResultsPage,
      props: (route) => ({ query: route.query.q }) // Pass search query as prop
    },
    {
      path: '/category/:name',
      name: 'categoryView',
      component: CategoryViewPage,
      props: true
    },
    {
      path: '/galleries',
      name: 'galleryGridView',
      component: GalleryGridViewPage
    },
    {
      path: '/gallery/:id',
      name: 'singleGalleryView',
      component: SingleGalleryViewPage,
      props: true
    },
    {
      path: '/gallery/:galleryId/item/:itemId',
      name: 'galleryItemDetails',
      component: GalleryItemDetailsPage,
      props: true
    },
    {
      path: '/reading-list',
      name: 'readingList',
      component: ReadingListPage
    },
    // New Routes for modern UI
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
    },
    {
      path: '/app', // Using a prefix for the new layout
      component: DashboardLayout,
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: Dashboard,
        },
        {
          path: 'admin',
          name: 'adminPanel',
          component: AdminPanel,
        },
      ],
    },
  ]
})

export default router