import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model';
import { viewer } from './view';
import { async } from 'regenerator-runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    // get id
    const id = window.location.hash.slice(1);
    console.log(id);
    if (!id) return;

    // load
    await model.loadRecipeData(id);

    console.log(model.state.recipe);
    // render
    viewer.renderRecipe(model.state.recipe);
  } catch (error) {
    console.error(error.message);
    viewer.renderErrorMessage(error.message);
  }
};

const controlSearchResults = async function () {
  try {
    // get query
    const query = viewer.getQuery();

    // load search results
    await model.loadSearchResults(query);

    // render results
    console.log(model.state.searchResults);
    viewer.renderSearchResult(model.state.searchResults);
  } catch (error) {
    console.error(error.message);
    viewer.renderErrorMessage(error.message);
  }
};

const init = function () {
  viewer.addHandlerRender(controlRecipes);
  viewer.addHandlerSearch(controlSearchResults);
};

init();
