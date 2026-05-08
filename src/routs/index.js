import ArticleDetailsPage from "@/components/view/homepage/ArticleDetailsPage.vue";
import BiblePage from "@/components/view/bible/BiblePage.vue";
import CategoryViewPage from "@/components/view/homepage/CategoryViewPage.vue";
import GalleryGridViewPage from "@/components/view/homepage/GalleryGridViewPage.vue";
import GalleryItemDetailsPage from "@/components/view/homepage/GalleryItemDetailsPage.vue";
import FrontLayoutWithSidebar from "@/components/layout/FrontLayoutWithSidebar.vue";
import HomePage from "@/components/view/homepage/HomePage.vue";
import InstallAppPage from "@/components/view/homepage/InstallAppPage.vue";
import ReadingListPage from "@/components/view/ReadingListPage.vue";
import SearchResultsPage from "@/components/view/SearchResultsPage.vue";
import SingleGalleryViewPage from "@/components/view/SingleGalleryViewPage.vue";
import PhotoUploadPage from "@/components/view/PhotoUploadPage.vue";

// New Views for modern UI design
import LoginPage from "@/assets/LoginPage.vue";
import DashboardLayout from "@/assets/DashboardLayout.vue";
import Dashboard from "@/assets/Dashboard.vue";
import AdminPanel from "@/assets/AdminPanel.vue";
import { createRouter, createWebHistory } from "vue-router";
import BibleDetail from "@/components/view/bible/BibleDetail.vue";
import BibleChapterDetail from "@/components/view/bible/BibleChapterDetail.vue";
import TypeBibleComponent from "@/components/view/bible/TypeBibleComponent.vue";
import BibleReaderLayout from "@/components/layout/BibleReaderLayout.vue";
import BibleSearchPage from "@/components/view/bible/BibleSearchPage.vue";
import BibleBookmarksPage from "@/components/view/bible/BibleBookmarksPage.vue";
import BibleSettingsPage from "@/components/view/bible/BibleSettingsPage.vue";
import MessengerListingPage from "@/components/view/messenger/MessengerListingPage.vue";
import MessengerDetailsPage from "@/components/view/messenger/MessengerDetailsPage.vue";
import { ensureSession, hasPermissionCode } from "@/composables/useAuth";
import { ADMIN_ROUTE_PERMISSIONS } from "@/config/adminRoutePermissions";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
    },
    {
      path: "/bible/types",
      redirect: "/read",
    },
    {
      path: "/read",
      component: BibleReaderLayout,
      children: [
        {
          path: "",
          name: "bibleReadHome",
          component: TypeBibleComponent,
        },
        {
          path: "search",
          name: "bibleSearch",
          component: BibleSearchPage,
        },
        {
          path: "bookmarks",
          name: "bibleBookmarks",
          component: BibleBookmarksPage,
        },
        {
          path: "settings",
          name: "bibleSettings",
          component: BibleSettingsPage,
        },
        {
          path: ":type",
          name: "bibleReadType",
          component: BiblePage,
        },
        {
          path: ":type/:bibleId",
          name: "bibleReadBook",
          component: BibleDetail,
        },
        {
          path: ":type/:bibleId/:chapterId",
          name: "bibleReadChapter",
          component: BibleChapterDetail,
        },
      ],
    },
    {
      path: "/",
      component: FrontLayoutWithSidebar,
      children: [
        {
          path: "daily-bible",
          name: "dailyBibleList",
          component: () =>
            import("@/components/view/bible/DailyBibleListPage.vue"),
        },
        {
          path: "daily-bible/:id",
          name: "dailyBibleDetail",
          component: () =>
            import("@/components/view/bible/DailyBibleDetail.vue"),
          props: true,
        },
        {
          path: "daily-sermon",
          name: "dailySermonList",
          component: () =>
            import("@/components/view/sermon/DailySermonListPage.vue"),
        },
        {
          path: "daily-sermon/:id",
          name: "dailySermonDetail",
          component: () =>
            import("@/components/view/sermon/DailySermonDetail.vue"),
          props: true,
        },
        {
          path: "search",
          name: "searchResults",
          component: SearchResultsPage,
          props: (route) => ({ query: route.query.q }), // Pass search query as prop
        },
        {
          path: "category/:name",
          name: "categoryView",
          component: CategoryViewPage,
          props: true,
        },
        {
          path: "galleries",
          name: "galleryGridView",
          component: GalleryGridViewPage,
        },
        {
          path: "gallery/:id",
          name: "singleGalleryView",
          component: SingleGalleryViewPage,
          props: true,
        },
        {
          path: "gallery/:galleryId/item/:itemId",
          name: "galleryItemDetails",
          component: GalleryItemDetailsPage,
          props: true,
        },
        {
          path: "reading-list",
          name: "readingList",
          component: ReadingListPage,
        },
        {
          path: "the-messenger",
          name: "messengerList",
          component: MessengerListingPage,
        },
        {
          path: "the-messenger/:slug",
          name: "messengerDetail",
          component: MessengerDetailsPage,
          props: true,
        },
        {
          path: "saints",
          name: "saintList",
          component: () =>
            import("@/components/view/homepage/SaintListPage.vue"),
        },
        {
          path: "saints/:slug",
          name: "saintDetail",
          component: () =>
            import("@/components/view/homepage/SaintDetailPage.vue"),
          props: true,
        },
        {
          path: "photos/upload",
          name: "photoUpload",
          component: PhotoUploadPage,
        },
        {
          path: "install-app",
          name: "installApp",
          component: InstallAppPage,
        },
      ],
    },
    {
      path: "/article/:id",
      name: "articleDetails",
      component: ArticleDetailsPage,
      props: true, // Allows passing route params as props
    },
    {
      path: "/church-history",
      name: "churchHistory",
      component: () => import("@/components/view/ChurchHistoryPage.vue"),
    },
    {
      path: "/structure",
      name: "structureIndex",
      component: () => import("@/components/view/structure/StructureIndexPage.vue"),
    },
    {
      path: "/structure/:slug",
      name: "structurePage",
      component: () => import("@/components/view/structure/StructurePageView.vue"),
      props: true,
    },
    {
      path: "/news",
      name: "news",
      redirect: "/",
    },
    {
      path: "/daily-readings",
      name: "dailyReadings",
      redirect: "/reading-list",
    },
    {
      path: "/gallery",
      name: "gallery",
      redirect: "/galleries",
    },
    // New Routes for modern UI
    {
      path: "/login",
      name: "login",
      component: LoginPage,
    },
    {
      path: "/admin",
      component: DashboardLayout,
      children: [
        {
          path: "", // Default to dashboard
          redirect: { name: "dashboard" },
        },
        {
          path: "dashboard",
          name: "dashboard",
          component: Dashboard,
        },
        {
          path: "users",
          name: "adminPanel",
          component: AdminPanel,
        },
        // Content Management Routes
        {
          path: "news",
          children: [
            {
              path: "",
              name: "adminNews",
              component: () =>
                import("@/components/view/admin/news/NewsListComponent.vue"),
            },
            {
              path: "create",
              name: "createNews",
              component: () =>
                import("@/components/view/admin/news/NewsForm.vue"),
            },
            {
              path: "edit/:id",
              name: "editNews",
              component: () =>
                import("@/components/view/admin/news/NewsForm.vue"),
            },
          ],
        },
        {
          path: "categories",
          children: [
            {
              path: "",
              name: "adminCategories",
              component: () =>
                import("@/components/view/admin/categories/CategoryListComponent.vue"),
            },
            {
              path: "create",
              name: "createCategory",
              component: () =>
                import("@/components/view/admin/categories/CategoryForm.vue"),
            },
            {
              path: "edit/:id",
              name: "editCategory",
              component: () =>
                import("@/components/view/admin/categories/CategoryForm.vue"),
            },
          ],
        },
        {
          path: "bible",
          children: [
            {
              path: "",
              name: "adminBible",
              component: () =>
                import("@/components/view/admin/bible/BibleListComponent.vue"),
            },
            {
              path: "daily-readings/create",
              name: "createDailyReading",
              component: () =>
                import("@/components/view/admin/bible/DailyReadingForm.vue"),
            },
            {
              path: "daily-readings/edit/:id",
              name: "editDailyReading",
              component: () =>
                import("@/components/view/admin/bible/DailyReadingForm.vue"),
            },
          ],
        },
        {
          path: "bible-management",
          children: [
            {
              path: "bible-type",
              name: "adminBibleTypes",
              component: () =>
                import("@/components/view/admin/bible/BibleTypeListComponent.vue"),
            },
            {
              path: "bible-type/create",
              name: "adminBibleTypeCreate",
              component: () =>
                import("@/components/view/admin/bible/BibleTypeForm.vue"),
            },
            {
              path: "bible-type/edit/:id",
              name: "adminBibleTypeEdit",
              component: () =>
                import("@/components/view/admin/bible/BibleTypeForm.vue"),
            },
            {
              path: "bible",
              name: "adminBibleManagement",
              component: () =>
                import("@/components/view/admin/bible/AdminBibleList.vue"),
            },
            {
              path: "bible/create",
              name: "adminBibleCreate",
              component: () =>
                import("@/components/view/admin/bible/BibleForm.vue"),
            },
            {
              path: "bible/edit/:id",
              name: "adminBibleEdit",
              component: () =>
                import("@/components/view/admin/bible/BibleForm.vue"),
            },
            {
              path: "chapters",
              name: "adminChapterList",
              component: () =>
                import("@/components/view/admin/bible/AdminChapterList.vue"),
            },
            {
              path: "chapter/create/:bibleId?",
              name: "adminChapterCreate",
              component: () =>
                import("@/components/view/admin/bible/ChapterForm.vue"),
            },
            {
              path: "chapter/edit/:chapterId",
              name: "adminChapterEdit",
              component: () =>
                import("@/components/view/admin/bible/ChapterForm.vue"),
            },
            {
              path: "verse",
              name: "adminVerseList",
              component: () =>
                import("@/components/view/admin/bible/AdminVerseList.vue"),
            },
            {
              path: "verse/create",
              name: "adminVerseCreate",
              component: () =>
                import("@/components/view/admin/bible/VerseForm.vue"),
            },
            {
              path: "verse/edit/:verseId",
              name: "adminVerseEdit",
              component: () =>
                import("@/components/view/admin/bible/VerseForm.vue"),
            },
            {
              path: "sections",
              name: "adminSectionList",
              component: () =>
                import("@/components/view/admin/bible/AdminSectionList.vue"),
            },
            {
              path: "section/create",
              name: "adminSectionCreate",
              component: () =>
                import("@/components/view/admin/bible/SectionForm.vue"),
            },
            {
              path: "section/edit/:sectionId",
              name: "adminSectionEdit",
              component: () =>
                import("@/components/view/admin/bible/SectionForm.vue"),
            },
          ],
        },
        {
          path: "sermons",
          children: [
            {
              path: "",
              name: "adminSermons",
              component: () =>
                import("@/components/view/admin/sermon/SermonListComponent.vue"),
            },
            {
              path: "create",
              name: "createSermon",
              component: () =>
                import("@/components/view/admin/sermon/SermonForm.vue"),
            },
            {
              path: "edit/:id",
              name: "editSermon",
              component: () =>
                import("@/components/view/admin/sermon/SermonForm.vue"),
            },
          ],
        },
        {
          path: "messenger",
          children: [
            {
              path: "",
              name: "adminMessengerIssues",
              component: () =>
                import("@/components/view/admin/messenger/MessengerIssueList.vue"),
            },
            {
              path: "create",
              name: "createMessengerIssue",
              component: () =>
                import("@/components/view/admin/messenger/MessengerIssueForm.vue"),
            },
            {
              path: "edit/:id",
              name: "editMessengerIssue",
              component: () =>
                import("@/components/view/admin/messenger/MessengerIssueForm.vue"),
            },
          ],
        },
        {
          path: "gallery/create",
          name: "adminGalleryCreate",
          component: () =>
            import("@/components/view/admin/gallery/CreateAlbumPage.vue"),
        },
        {
          path: "gallery/edit/:id",
          name: "adminGalleryEdit",
          component: () =>
            import("@/components/view/admin/gallery/EditAlbumPage.vue"),
        },
        {
          path: "gallery",
          name: "adminGallery",
          component: () =>
            import("@/components/view/admin/gallery/GalleryListComponent.vue"),
        },
        {
          path: "saints",
          children: [
            {
              path: "",
              name: "adminSaints",
              component: () =>
                import("@/components/view/admin/saints/SaintListComponent.vue"),
            },
            {
              path: "create",
              name: "createSaint",
              component: () =>
                import("@/components/view/admin/saints/SaintForm.vue"),
            },
            {
              path: "edit/:id",
              name: "editSaint",
              component: () =>
                import("@/components/view/admin/saints/SaintForm.vue"),
            },
          ],
        },
        {
          path: "church-history",
          name: "adminChurchHistory",
          component: () =>
            import("@/components/view/admin/church-history/ChurchHistoryForm.vue"),
        },
        {
          path: "structure-pages",
          children: [
            {
              path: "",
              name: "adminStructurePages",
              component: () =>
                import("@/components/view/admin/structure-pages/StructurePageListComponent.vue"),
            },
            {
              path: "create",
              name: "createStructurePage",
              component: () =>
                import("@/components/view/admin/structure-pages/StructurePageForm.vue"),
            },
            {
              path: "edit/:slug",
              name: "editStructurePage",
              component: () =>
                import("@/components/view/admin/structure-pages/StructurePageForm.vue"),
              props: true,
            },
          ],
        },
      ],
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  if (!to.path.startsWith("/admin")) {
    next();
    return;
  }
  const ok = await ensureSession();
  if (!ok) {
    next({ name: "login", query: { redirect: to.fullPath } });
    return;
  }
  const metaPerms = to.meta?.permissions;
  const required = Array.isArray(metaPerms) ? metaPerms : ADMIN_ROUTE_PERMISSIONS[to.name];
  if (required?.length && !required.every((p) => hasPermissionCode(p))) {
    next({ name: "dashboard" });
    return;
  }
  next();
});

export default router;
