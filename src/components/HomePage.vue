<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const searchQuery = ref('')

const featuredArticles = ref([
  {
    id: 1,
    title: 'The Future of AI in Web Development', 
    snippet: 'Exploring how artificial intelligence is reshaping the way we build websites and applications.', 
    image: 'https://images.unsplash.com/photo-1677756119517-756a188d2d94?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'City Wins Championship in Stunning Final', 
    snippet: 'A nail-biting conclusion to the season sees the local team lift the trophy.', 
    image: 'https://images.unsplash.com/photo-1562408784-819f065b0a35?q=80&w=2070&auto=format&fit=crop'
  },
])

const latestHeadlines = ref([
  { id: 3, title: 'Tech Giant Unveils New Smart Home Device', category: 'Technology' }, 
  { id: 4, title: 'Global Markets React to Economic Summit', category: 'Business' }, 
  { id: 5, title: 'Blockbuster Movie Smashes Box Office Records', category: 'Entertainment' }, 
  { id: 6, title: 'New Environmental Policies Announced', category: 'Politics' }, 
])

const newsCategories = ref([
  'Technology', 
  'Sports', 
  'Politics', 
  'Business', 
  'Entertainment', 
  'Health', 
])
</script>

<template>
  <div class="homepage">
    <header class="main-header">
      <div class="search-bar">
        <input type="search" v-model="searchQuery" placeholder="Search for news..." />
        <RouterLink :to="{ name: 'searchResults', query: { q: searchQuery } }" class="search-button">Search</RouterLink>
      </div>
    </header>

    <main class="container">
      <section class="featured-articles">
        <h2>Featured Articles</h2>
        <div class="articles-grid">
          <div v-for="article in featuredArticles" :key="article.id" class="article-card">
            <img :src="article.image" :alt="article.title" />
            <div class="card-content">
              <h3>
                <RouterLink :to="{ name: 'articleDetails', params: { id: article.id } }">{{ article.title }}</RouterLink>
              </h3>
              <p>{{ article.snippet }}</p>
              <RouterLink :to="{ name: 'articleDetails', params: { id: article.id } }" class="read-more">Read More</RouterLink>
            </div>
          </div>
        </div>
      </section>

      <div class="main-content">
        <section class="latest-headlines">
          <h2>Latest Headlines</h2>
          <ul>
            <li v-for="headline in latestHeadlines" :key="headline.id">
              <RouterLink :to="{ name: 'articleDetails', params: { id: headline.id } }">
                <span>{{ headline.title }}</span>
                <span class="category-tag">{{ headline.category }}</span>
              </RouterLink>
            </li>
          </ul>
        </section>

        <aside class="categories">
          <h2>Categories</h2>
          <ul>
            <li v-for="category in newsCategories" :key="category">
              <RouterLink :to="{ name: 'categoryView', params: { name: category } }">{{ category }}</RouterLink>
            </li>
          </ul>
        </aside>
      </div>
    </main>
  </div>
</template>

<style scoped>
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  border-bottom: 1px solid #e0e0e0;
  background-color: #fff;
  margin-bottom: 2rem;
}

.search-bar input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-bar .search-button {
  padding: 0.5rem 1rem;
  margin-left: 0.5rem;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none; /* For RouterLink */
  display: inline-block;
  line-height: 1.5; /* Align text vertically */
}

.container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.featured-articles h2,
.latest-headlines h2,
.categories h2 {
  border-bottom: 2px solid #007bff;
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
  color: #007bff;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.article-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.article-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-content {
  padding: 1rem;
}

.card-content h3 {
  margin-top: 0;
  font-size: 1.25rem;
}

.read-more {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.main-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
}

.latest-headlines ul,
.categories ul {
  list-style: none;
  padding: 0;
}

.latest-headlines li a,
.categories li a {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
  text-decoration: none;
  color: #333;
  transition: color 0.3s ease;
}

.latest-headlines li a:hover,
.categories li a:hover {
  color: #007bff;
}

.category-tag {
  background-color: #f0f0f0;
  color: #555;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}
</style>
