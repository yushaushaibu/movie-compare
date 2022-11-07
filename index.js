createAutocomplete({
 root: document.querySelector('.autocomplete'),
 renderOption(movie) {
  const imgSRC = movie.Poster === "N/A" ? "" : movie.Poster;
    return `<img src="${imgSRC}" />
            ${movie.Title} (${movie.Year})`;
 },
 onOptionSelect(movie) {
  onMovieSelect(movie);
 },
 inputValue(movie) {
  return movie.Title;
 },
 async fetchData(searchTerm) {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: "fb656db",
      s: searchTerm
    }
  })
  if (response.data.Error) {
    return []
  }
  return response.data.Search;
 }
});


onMovieSelect = async (movie) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "fb656db",
      i: movie.imdbID
    }
  });
  document.querySelector('#summary').innerHTML = movieBlueprint(response.data);
};

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
    <article class="notification is-primary">
      <p class="title">${movieSummary.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieSummary.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieSummary.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieSummary.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieSummary.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};
