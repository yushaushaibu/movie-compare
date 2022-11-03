const fetchData = async (searchTerm) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "fb656db",
      s: searchTerm,
    },
  });
  console.log(response.data);
};

const input = document.querySelector("input");

const debounce = (func, delay= 1000) => {
    let timeoutId;
    return (...args) => {
        timeoutId = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    }
}

const onInput = (e) => {
    fetchData(e.target.value);
};

input.addEventListener("input", debounce(onInput, 500));
