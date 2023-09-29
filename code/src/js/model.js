import { async } from 'regenerator-runtime';
import { API_URL, TIMEOUT_SEC, RES_PER_PAGE } from './config.js';
import { timeout } from './helpers.js';
export const state = {
  recipe: {},
  search: { Results: [], currentPage: 1 },
  bookmarks: [],
};

export const loadRecipeData = async function (id) {
  try {
    const response = await Promise.race([
      fetch(`${API_URL}/${id}`),
      timeout(TIMEOUT_SEC),
    ]);

    const data = await response.json();

    if (!response.ok)
      throw new Error('No recipes found for your query. Please try again!');
    console.log(data);
    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceURL: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
      bookmarked: false,
    };

    if (state.bookmarks.some(recipe => recipe.id === id))
      state.recipe.bookmarked = true;
  } catch (error) {
    throw error;
  }
};

export const loadSearchResults = async function (query) {
  try {
    const response = await Promise.race([
      fetch(`${API_URL}?search=${query}`),
      timeout(TIMEOUT_SEC),
    ]);

    const data = await response.json();

    if (!response.ok || data.results === 0)
      throw new Error('No recipes found for your query. Please try again!');

    console.log(data, response);
    state.search.Results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        bookmarked: false,
      };
    });
    state.search.currentPage = 1;
  } catch (error) {
    throw error;
  }
};

export const generatePageContent = function (page) {
  const start = (page - 1) * RES_PER_PAGE;
  const end = page * RES_PER_PAGE;

  return state.search.Results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

export const addBookmark = function (recipe) {
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
    state.bookmarks.push(recipe);
  }
};

export const deleteBookmark = function (recipe) {
  if (recipe.id === state.recipe.id) {
    const index = state.bookmarks.findIndex(el => el.id === recipe.id);
    state.bookmarks.splice(index, 1);
    state.recipe.bookmarked = false;
  }
};
