import icons from 'url:../img/icons.svg';
import { Fraction } from 'fractional';
import { RES_PER_PAGE } from './config';
class view {
  #recipeDetailsELem = document.querySelector('.recipe');
  #searchElem = document.querySelector('.search');
  #searchResultElem = document.querySelector('.results');
  #pageElem = document.querySelector('.pagination');
  #bookmarksElem = document.querySelector('.bookmarks__list');

  renderRecipe(data) {
    const markup = this.#generateRecipeMarkup(data);
    this.#insertMarkup(markup, this.#recipeDetailsELem);
  }

  renderSearchResult(data) {
    const markup = this.#generateListMarkup(data);
    this.#insertMarkup(markup, this.#searchResultElem);
  }

  renderPageBtn(data) {
    const markup = this.#generatePageBtnMarkup(data);
    this.#insertMarkup(markup, this.#pageElem);
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
    this.#insertMarkup(markup, this.#recipeDetailsELem);
  }

  renderBookmarks(data) {
    const markup = this.#generateListMarkup(data);
    this.#insertMarkup(markup, this.#bookmarksElem);
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

  addHandlerPageClick(handler) {
    this.#pageElem.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      console.log(btn);
      if (btn.classList.contains('pagination__btn--prev')) {
        console.log('prev');
        handler('prev');
      }

      if (btn.classList.contains('pagination__btn--next')) {
        console.log('next');
        handler('next');
      }
    });
  }

  addHandlerServings(handler) {
    this.#recipeDetailsELem.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--update-servings');
      if (!btn) return;
      const newServings = +btn.dataset.updateTo;
      if (newServings > 0) handler(newServings);
    });
  }

  addHandlerBookmark(handler) {
    this.#recipeDetailsELem.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
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
              <button class="btn--tiny btn--update-servings" data-update-to="${
                data.servings - 1
              }">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--update-servings" data-update-to="${
                data.servings + 1
              }">
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
          <button class="btn--round btn--bookmark">
            <svg class="">
              <use href="${icons}#icon-bookmark${
      data.bookmarked ? '-fill' : ''
    }"></use>
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

  #generateListMarkup(data) {
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

  #generatePageBtnMarkup(data) {
    const numPages = Math.ceil(data.Results.length / RES_PER_PAGE);

    // first page of muli pages
    if (data.currentPage === 1 && numPages > 1) {
      return `
      <button class="btn--inline pagination__btn--next">
            <span>Page ${data.currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
      </button>`;
    }

    // last page of multi pages
    if (data.currentPage === numPages && numPages > 1) {
      return `
      <button class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${data.currentPage - 1}</span>
      </button>
      `;
    }

    // in range of muli pages
    if (data.currentPage < numPages) {
      return `
      <button class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${data.currentPage - 1}</span>
      </button>
      <button class="btn--inline pagination__btn--next">
            <span>Page ${data.currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
      </button>`;
    }

    return ``;
  }

  #insertMarkup(markup, element) {
    element.innerHTML = '';
    element.insertAdjacentHTML('afterbegin', markup);
  }
}

export const viewer = new view();
