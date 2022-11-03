const fetchData = async (searchTerm) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "fb656db",
      s: searchTerm,
    },
  });
  console.log(response.data);
};

const input = document.querySelector('input');
input.addEventListener('input', (e) => {
   fetchData(e.target.value);
});
