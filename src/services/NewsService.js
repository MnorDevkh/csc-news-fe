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
  {
    id: 3,
    title: 'The Future of AI in Web Development',
    snippet: 'Exploring how artificial intelligence is reshaping the way we build websites and applications.',
    image: 'https://images.unsplash.com/photo-1677756119517-756a188d2d94?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 4,
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
  }
};