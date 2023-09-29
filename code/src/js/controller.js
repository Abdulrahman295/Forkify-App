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
    console.log(model.state.search.Results);
    viewer.renderSearchResult(
      model.generatePageContent(model.state.search.currentPage)
    );

    viewer.renderPageBtn(model.state.search);
  } catch (error) {
    console.error(error.message);
    viewer.renderErrorMessage(error.message);
  }
};

const controlPageBtn = function (action) {
  if (action === 'next') model.state.search.currentPage += 1;

  if (action === 'prev') model.state.search.currentPage -= 1;

  console.log(model.state.search.currentPage);
  viewer.renderSearchResult(
    model.generatePageContent(model.state.search.currentPage)
  );

  viewer.renderPageBtn(model.state.search);
};

const controlServings = function (newServings) {
  model.updateServings(newServings);

  viewer.renderRecipe(model.state.recipe);
};

const controlBookmarks = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe);

  viewer.renderRecipe(model.state.recipe);

  viewer.renderBookmarks(model.state.bookmarks);
};

const init = function () {
  viewer.addHandlerRender(controlRecipes);
  viewer.addHandlerSearch(controlSearchResults);
  viewer.addHandlerPageClick(controlPageBtn);
  viewer.addHandlerServings(controlServings);
  viewer.addHandlerBookmark(controlBookmarks);
};

init();
