import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model';
import { viewer } from './recipeView';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    // get id
    const id = window.location.hash;
    if (!id) return;

    // load
    await model.loadData(id);

    // render
    viewer.render(model.state.recipe);
  } catch (error) {
    console.error(error.message);
  }
};

const init = function () {
  viewer.addHandler(controlRecipes);
};

console.log('hiii');
init();
