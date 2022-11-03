const fetchData = async () => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: 'fb656db',
            s: 'Pursuit of Happyness'
        }
    });
    console.log(response.data);
}

fetchData();
