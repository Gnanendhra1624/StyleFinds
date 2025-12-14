export const searchProducts = async (query, page = 1) => {
  
  const url = `https://api.searchspring.net/api/search/search.json?q=${encodeURIComponent(query)}&resultsFormat=native&page=${page}&siteId=scmq7n`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};