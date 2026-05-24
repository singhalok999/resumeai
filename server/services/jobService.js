const axios = require("axios");

const searchJobs = async (role) => {

  try {

    const response = await axios.get(
      "https://jsearch.p.rapidapi.com/search",
      {
        params: {
          query: `${role} jobs in India`,
          page: "1",
          num_pages: "1"
        },

        headers: {
          "X-RapidAPI-Key":
            process.env.RAPID_API_KEY,

          "X-RapidAPI-Host":
            "jsearch.p.rapidapi.com"
        }
      }
    );

    return response.data.data;

  } catch (error) {

    console.log(error);

    return [];

  }
};

module.exports = {
  searchJobs
};