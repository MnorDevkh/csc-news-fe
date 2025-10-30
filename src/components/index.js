import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import ArticleDetailsPage from '../views/ArticleDetailsPage.vue'
import SearchResultsPage from '../views/SearchResultsPage.vue'
import CategoryViewPage from '../views/CategoryViewPage.vue'
import GalleryGridViewPage from '../views/GalleryGridViewPage.vue'
import SingleGalleryViewPage from '../views/SingleGalleryViewPage.vue'
import GalleryItemDetailsPage from '../views/GalleryItemDetailsPage.vue'
import ReadingListPage from '../views/ReadingListPage.vue'

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