import { async } from 'regenerator-runtime';
import { API_URL, TIMEOUT_SEC } from './config.js';
import { timeout } from './helpers.js';
export const state = {
  recipe: {},
};

export const loadData = async function (id) {
  try {
    const response = await Promise.race([
      fetch(`${API_URL}/${id}`),
      timeout(TIMEOUT_SEC),
    ]);

    const data = await response.json();

    if (!res.ok) throw new Error(data.message);

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
    console.error(error.message);
  }
};
