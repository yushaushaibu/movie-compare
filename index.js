const fetchData = async (searchTerm) => {
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
};

const root = document.querySelector(".autocomplete");
root.innerHTML = `<label><b>Search Movie</b></label>
                  <input class="input" />
                  <div class="dropdown">
                        <div class="dropdown-menu">
                            <div class="dropdown-content results"></div>
                        </div>
                  </div>
`;
const input = document.querySelector("input");
const dropdown = document.querySelector(".dropdown");
const resultsWrapper = document.querySelector(".results");

const onInput = async (e) => {
  const movies = await fetchData(e.target.value);
  if (!movies.length) {
    dropdown.classList.remove('is-active');
    return;
  }

  resultsWrapper.innerHTML = "";
  dropdown.classList.add("is-active");
  for (let movie of movies) {
    const option = document.createElement("a");
    const imgSRC = movie.Poster === "N/A" ? "" : movie.Poster;

    option.classList.add("dropdown-item");
    option.innerHTML = `
            <img src="${imgSRC}" />
            ${movie.Title}
            <p>${movie.Year}</p>
        `;
    option.addEventListener('click', () => {
      dropdown.classList.remove('is-active');
      input.value = movie.Title;
      onMovieSelect(movie);
    })
    resultsWrapper.appendChild(option);
  }

};

input.addEventListener("input", debounce(onInput, 500));

document.addEventListener('click', (e) => {
  if (!root.contains(e.target)) {
    dropdown.classList.remove('is-active');
  }
})

onMovieSelect = async (movie) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "fb656db",
      i: movie.imdbID
    }
  });
  document.querySelector('#summary').innerHTML = movieBlueprint(response.data);  
}

const movieBlueprint = (movieSummary) => {
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
  `
}