import ArticleDetailsPage from '@/components/view/ArticleDetailsPage.vue'
import CategoryViewPage from '@/components/view/CategoryViewPage.vue'
import GalleryGridViewPage from '@/components/view/GalleryGridViewPage.vue'
import GalleryItemDetailsPage from '@/components/view/GalleryItemDetailsPage.vue'
import HomePage from '@/components/view/HomePage.vue'
import ReadingListPage from '@/components/view/ReadingListPage.vue'
import SearchResultsPage from '@/components/view/SearchResultsPage.vue'
import SingleGalleryViewPage from '@/components/view/SingleGalleryViewPage.vue'
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
    }
  ]
})

export default router