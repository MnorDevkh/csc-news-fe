// Mock data that would typically come from a backend API

const featuredArticlesData = [
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
];

const latestHeadlinesData = [
  { id: 3, title: 'Tech Giant Unveils New Smart Home Device', category: 'Technology' },
  { id: 4, title: 'Global Markets React to Economic Summit', category: 'Business' },
  { id: 5, title: 'Blockbuster Movie Smashes Box Office Records', category: 'Entertainment' },
  { id: 6, title: 'New Environmental Policies Announced', category: 'Politics' },
];

const newsCategoriesData = [
  'Technology',
  'Sports',
  'Politics',
  'Business',
  'Entertainment',
  'Health',
];

// Combine all articles into one list for searching
const allArticlesData = [
  ...featuredArticlesData.map(a => ({...a, category: 'Featured'})), // Add category for consistency
  ...latestHeadlinesData,
  { id: 7, title: 'Breakthrough in Renewable Energy Technology', category: 'Technology', snippet: 'Scientists have developed a new method for harnessing solar power more efficiently.' },
  { id: 8, title: 'Exploring the Deep Sea: New Species Discovered', category: 'Science', snippet: 'An expedition has returned with footage of never-before-seen creatures from the ocean depths.' },
  { id: 9, title: 'The Rise of Remote Work and its Impact on the Economy', category: 'Business', snippet: 'A look into how the shift to remote work is changing cities and industries.' },
  { id: 10, title: 'AI in Healthcare: A Revolution in Diagnostics', category: 'Health', snippet: 'Artificial intelligence is now able to detect diseases earlier and more accurately than ever before.' },
];


// Simulate API calls
export const NewsService = {
  getFeaturedArticles() {
    return new Promise(resolve => {
      setTimeout(() => resolve(featuredArticlesData), 300); // Simulate network delay
    });
  },

  getLatestHeadlines() {
    return new Promise(resolve => {
      setTimeout(() => resolve(latestHeadlinesData), 400);
    });
  },

  getNewsCategories() {
    return new Promise(resolve => {
      setTimeout(() => resolve(newsCategoriesData), 500);
    });
  },

  searchArticles(query) {
    return new Promise(resolve => {
      if (!query) {
        return resolve([]);
      }
      const lowerCaseQuery = query.toLowerCase();
      const results = allArticlesData.filter(article => 
        article.title.toLowerCase().includes(lowerCaseQuery) ||
        (article.snippet && article.snippet.toLowerCase().includes(lowerCaseQuery))
      );
      setTimeout(() => resolve(results), 350); // Simulate search delay
    });
  }
};