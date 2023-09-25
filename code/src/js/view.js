import icons from 'url:../img/icons.svg';
import { Fraction } from 'fractional';
class view {
  #recipeDetailsELem = document.querySelector('.recipe');
  #searchElem = document.querySelector('.search');
  #searchResultElem = document.querySelector('.results');

  renderRecipe(data) {
    const markup = this.#generateRecipeMarkup(data);
    this.#recipeDetailsELem.innerHTML = '';
    this.#recipeDetailsELem.insertAdjacentHTML('afterbegin', markup);
  }

  renderSearchResult(data) {
    const markup = this.#generateResultsMarkup(data);
    this.#searchResultElem.innerHTML = '';
    this.#searchResultElem.insertAdjacentHTML('afterbegin', markup);
  }

  renderErrorMessage(message) {
    const markup = `
      <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
      </div>
    `;

    this.#recipeDetailsELem.innerHTML = '';
    this.#recipeDetailsELem.insertAdjacentHTML('afterbegin', markup);
  }

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(event =>
      window.addEventListener(event, handler)
    );
  }

  addHandlerSearch(handler) {
    this.#searchElem.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }

  getQuery() {
    const query = this.#searchElem.querySelector('.search__field').value;
    this.#searchElem.querySelector('.search__field').value = '';
    return query;
  }

  #generateRecipeMarkup(data) {
    return `
    <figure class="recipe__fig">
          <img src="${data.image}" alt="${data.title}" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${data.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              data.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              data.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--increase-servings">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--increase-servings">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round">
            <svg class="">
              <use href="${icons}#icon-bookmark-fill"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
          ${data.ingredients
            .map(ing => {
              return `<li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
              </svg>
              <div class="recipe__quantity">${ing.quantity}</div>
              <div class="recipe__description">
                <span class="recipe__unit">${ing.unit}</span>
                ${ing.description}
              </div>
            </li>`;
            })
            .join('')}
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              data.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${data.sourceURL}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>`;
  }

  #generateResultsMarkup(data) {
    return data
      .map(recipe => {
        return `
        <li class="preview">
            <a class="preview__link" href="#${recipe.id}">
              <figure class="preview__fig">
                <img src="${recipe.image}" alt="${recipe.title}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${recipe.title}</h4>
                <p class="preview__publisher">${recipe.publisher}</p>
                <div class="preview__user-generated">
                  <svg>
                    <use href="${icons}#icon-user"></use>
                  </svg>
                </div>
              </div>
            </a>
          </li>
      `;
      })
      .join('');
  }
}

export const viewer = new view();
