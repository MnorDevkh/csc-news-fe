<script setup>
import { ref } from 'vue'

const searchQuery = ref('')

const featuredArticles = ref([
  {
    id: 1,
    title: 'The Future of AI in Web Development',
    snippet: 'Exploring how artificial intelligence is reshaping the way we build websites and applications.',
    image: 'https://images.unsplash.com/photo-1677756119517-756a188d2d94?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'City Wins Championship in Stunning Final',
    snippet: 'A nail-biting conclusion to the season sees the local team lift the trophy.',
    image: 'https://images.unsplash.com/photo-1562408784-819f065b0a35?q=80&w=2070&auto=format&fit=crop',
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
      <div class="logo">
        <h1>CSC News</h1>
      </div>
      <nav class="main-nav">
        <a href="#">Home</a>
        <a href="#">World</a>
        <a href="#">Tech</a>
        <a href="#">Sports</a>
        <a href="#">Business</a>
      </nav>
      <div class="search-bar">
        <input type="search" v-model="searchQuery" placeholder="Search for news..." />
        <button>Search</button>
      </div>
    </header>

    <main class="container">
      <section class="featured-articles">
        <h2>Featured Articles</h2>
        <div class="articles-grid">
          <div v-for="article in featuredArticles" :key="article.id" class="article-card">
            <img :src="article.image" :alt="article.title" />
            <div class="card-content">
              <h3>{{ article.title }}</h3>
              <p>{{ article.snippet }}</p>
              <a href="#" class="read-more">Read More</a>
            </div>
          </div>
        </div>
      </section>

      <div class="main-content">
        <aside class="categories">
          <h2>Categories</h2>
          <ul>
            <li v-for="category in newsCategories" :key="category">
              <a href="#">{{ category }}</a>
            </li>
          </ul>
        </aside>

        <section class="latest-headlines">
          <h2>Latest Headlines</h2>
          <ul>
            <li v-for="headline in latestHeadlines" :key="headline.id">
              <a href="#">
                <span>{{ headline.title }}</span>
                <span class="category-tag">{{ headline.category }}</span>
              </a>
            </li>
          </ul>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
.homepage {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #333;
}

.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  border-bottom: 1px solid #e0e0e0;
  background-color: #fff;
}

.logo h1 {
  margin: 0;
  font-size: 1.75rem;
}

.main-nav a {
  margin: 0 1rem;
  text-decoration: none;
  color: #555;
  font-weight: 500;
}

.search-bar input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-bar button {
  padding: 0.5rem 1rem;
  margin-left: 0.5rem;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.container {
  padding: 2rem;
}

.featured-articles h2,
.latest-headlines h2,
.categories h2 {
  border-bottom: 2px solid #007bff;
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
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
}

.read-more {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.main-content {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
}

.latest-headlines ul,
.categories ul {
  list-style: none;
  padding: 0;
}

.latest-headlines li a {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
  text-decoration: none;
  color: #333;
}

.categories li a {
  display: block;
  padding: 0.5rem 0;
  text-decoration: none;
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
