import { async } from 'regenerator-runtime';
import { API_URL, TIMEOUT_SEC } from './config.js';
import { timeout } from './helpers.js';
export const state = {
  recipe: {},
  searchResults: [],
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
    };
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
    state.searchResults = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
      };
    });
  } catch (error) {
    throw error;
  }
};
