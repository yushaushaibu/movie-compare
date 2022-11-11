const autocompleteConfig = {
  renderOption(movie) {
    const imgSRC = movie.Poster === "N/A" ? "" : movie.Poster;
    return `<img src="${imgSRC}" />
              ${movie.Title} (${movie.Year})`;
  },
  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(searchTerm) {
    const response = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: "fb656db",
        s: searchTerm,
      },
    });
    if (response.data.Error) {
      return [];
    }
    return response.data.Search;
  },
};

createAutocomplete({
  ...autocompleteConfig,
  root: document.querySelector("#left-autocomplete"),
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#left-movieSummary"), "left");
  },
});

createAutocomplete({
  ...autocompleteConfig,
  root: document.querySelector("#right-autocomplete"),
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(
      movie,
      document.querySelector("#right-movieSummary"),
      "right"
    );
  },
});

let leftMovie;
let rightMovie;
onMovieSelect = async (movie, movieSummaryElement, side) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "fb656db",
      i: movie.imdbID,
    },
  });
  movieSummaryElement.innerHTML = movieBlueprint(response.data);

  if (side === "left") {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }

  if (leftMovie && rightMovie) {
    runComparison();
  }
};

const runComparison = () => {
  const leftSideStats = document.querySelectorAll(
    "#left-movieSummary .notification"
  );
  const rightSideStats = document.querySelectorAll(
    "#right-movieSummary .notification"
  );

  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];

    const leftSideValue = parseInt(leftStat.dataset.value);
    const rightSideValue = parseInt(rightStat.dataset.value);

    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove("primary");
      leftStat.classList.add("is-warning");
    } else {
      rightStat.classList.remove("is-primary");
      rightStat.classList.add("is-warning");
    }
  });
};

const movieBlueprint = (movieSummary) => {
  const revenue = parseInt(
    movieSummary.BoxOffice.replace(/\$/g, "").replace(/,/g, "")
  );
  const metascore = parseInt(movieSummary.Metascore);
  const imdbRating = parseFloat(movieSummary.imdbRating);
  const imdbVotes = parseInt(movieSummary.imdbVotes.replace(/,/g, ""));

  const awards = movieSummary.Awards.split(" ").reduce((prev, word) => {
    const value = parseInt(word);

    if (isNaN(value)) {
      return prev;
    } else {
      return prev + value;
    }
  }, 0);

  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieSummary.Poster}" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieSummary.Title}</h1>
          <h4>${movieSummary.Genre}</h4>
          <p>${movieSummary.Plot}</p>
        </div>
      </div>
    </article>
    <article data-value=${awards} class="notification is-primary">
      <p class="title">${movieSummary.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value=${revenue} class="notification is-primary">
      <p class="title">${movieSummary.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article data-value=${metascore} class="notification is-primary">
      <p class="title">${movieSummary.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article data-value=${imdbRating} class="notification is-primary">
      <p class="title">${movieSummary.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class="notification is-primary">
      <p class="title">${movieSummary.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};
