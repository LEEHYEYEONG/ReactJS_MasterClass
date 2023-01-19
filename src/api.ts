const API_KEY = "d44328af66c7b912250dca6b1d3216a0";
const BASE_PATH = "https://api.themoviedb.org/3/";

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
