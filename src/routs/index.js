import ArticleDetailsPage from '@/components/view/homepage/ArticleDetailsPage.vue'
import BiblePage from '@/components/view/bible/BiblePage.vue'
import CategoryViewPage from '@/components/view/homepage/CategoryViewPage.vue'
import GalleryGridViewPage from '@/components/view/homepage/GalleryGridViewPage.vue'
import GalleryItemDetailsPage from '@/components/view/homepage/GalleryItemDetailsPage.vue'
import HomePage from '@/components/view/homepage/HomePage.vue'
import ReadingListPage from '@/components/view/ReadingListPage.vue'
import SearchResultsPage from '@/components/view/SearchResultsPage.vue'
import SingleGalleryViewPage from '@/components/view/SingleGalleryViewPage.vue'

// New Views for modern UI design
import LoginPage from '@/assets/LoginPage.vue'
import DashboardLayout from '@/assets/DashboardLayout.vue'
import Dashboard from '@/assets/Dashboard.vue'
import AdminPanel from '@/assets/AdminPanel.vue'
import { createRouter, createWebHistory } from 'vue-router'
import BibleDetail from '@/components/view/bible/BibleDetail.vue'
import BibleChapterDetail from '@/components/view/bible/BibleChapterDetail.vue'
import TypeBibleComponent from '@/components/view/bible/TypeBibleComponent.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/bible/types',
      name: 'bible-types',
      component: () => TypeBibleComponent
    },
    {
      path: '/daily-bible',
      name: 'dailyBibleList',
      component: () => import('@/components/view/bible/DailyBibleListPage.vue')
    },
    {
      path: '/daily-bible/:id',
      name: 'dailyBibleDetail',
      component: () => import('@/components/view/bible/DailyBibleDetail.vue'),
      props: true
    },
    {
      path: '/daily-sermon',
      name: 'dailySermonList',
      component: () => import('@/components/view/sermon/DailySermonListPage.vue')
    },
    {
      path: '/daily-sermon/:id',
      name: 'dailySermonDetail',
      component: () => import('@/components/view/sermon/DailySermonDetail.vue'),
      props: true
    },
    {
      path: '/bible',
      name: 'bible',
      component: BiblePage
    },
    {
      path: '/bible/:id',
      name: 'bible-detail',
      component: BibleDetail,
    },
    {
      path: '/chapter/:id',
      name: 'chapter-detail',
      component: BibleChapterDetail,
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
    {
      path: '/saints',
      name: 'saintList',
      component: () => import('@/components/view/homepage/SaintListPage.vue')
    },
    // New Routes for modern UI
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
    },
    {
      path: '/admin',
      component: DashboardLayout,
      children: [
        {
          path: '', // Default to dashboard
          redirect: { name: 'dashboard' }
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: Dashboard,
        },
        {
          path: 'users',
          name: 'adminPanel',
          component: AdminPanel,
        },
        // Content Management Routes
        {
          path: 'news',
          name: 'adminNews',
          component: () => import('@/components/view/admin/news/NewsListComponent.vue'),
        },
        {
          path: 'bible',
          name: 'adminBible',
          component: () => import('@/components/view/admin/bible/BibleListComponent.vue'),
        },
        {
          path: 'sermons',
          name: 'adminSermons',
          component: () => import('@/components/view/admin/sermon/SermonListComponent.vue'),
        },
        {
          path: 'gallery',
          name: 'adminGallery',
          component: () => import('@/components/view/admin/gallery/GalleryListComponent.vue'),
        },
        {
          path: 'saints',
          name: 'adminSaints',
          component: () => import('@/components/view/admin/saints/SaintListComponent.vue'),
        },
      ],
    },
  ]
})

export default router