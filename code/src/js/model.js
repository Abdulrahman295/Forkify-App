import { async } from 'regenerator-runtime';
import { API_URL, TIMEOUT_SEC, RES_PER_PAGE, KEY } from './config.js';
import { timeout } from './helpers.js';
export const state = {
  recipe: {},
  search: { Results: [], currentPage: 1 },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceURL: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    bookmarked: false,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipeData = async function (id) {
  try {
    const response = await Promise.race([
      fetch(`${API_URL}/${id}?key=${KEY}`),
      timeout(TIMEOUT_SEC),
    ]);

    const data = await response.json();

    if (!response.ok)
      throw new Error('No recipes found for your query. Please try again!');
    console.log(data);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(recipe => recipe.id === id))
      state.recipe.bookmarked = true;
  } catch (error) {
    throw error;
  }
};

export const loadSearchResults = async function (query) {
  try {
    const response = await Promise.race([
      fetch(`${API_URL}?search=${query}&key=${KEY}`),
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
        ...(recipe.key && { key: recipe.key }),
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

const updateLocalBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
    state.bookmarks.push(recipe);
    updateLocalBookmarks();
  }
};

export const deleteBookmark = function (recipe) {
  if (recipe.id === state.recipe.id) {
    const index = state.bookmarks.findIndex(el => el.id === recipe.id);
    state.bookmarks.splice(index, 1);
    state.recipe.bookmarked = false;
    updateLocalBookmarks();
  }
};

const getIngredients = function (recipe) {
  return Object.entries(recipe)
    .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
    .map(ing => {
      const ingArr = ing[1].replaceAll(' ', '').split(',');
      if (ingArr.length !== 3) throw new Error('Wrong ingredient Fromat!!');

      const [quantity, unit, description] = ingArr;

      return {
        quantity: quantity ? Number(quantity) : null,
        unit,
        description,
      };
    });
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = getIngredients(newRecipe);
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      cooking_time: Number(newRecipe.cookingTime),
      servings: Number(newRecipe.servings),
      publisher: newRecipe.publisher,
      ingredients,
    };
    const response = await Promise.race([
      fetch(`${API_URL}?key=${KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipe),
      }),
      timeout(TIMEOUT_SEC),
    ]);

    const data = await response.json();
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
    console.log(state.recipe);
  } catch (error) {
    throw error;
  }
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();
