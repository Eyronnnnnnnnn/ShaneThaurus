module.exports = async function handler(request, response) {
  const { word } = request.query || {};

  if (!word) {
    return response.status(400).json({
      error: 'Please provide a word to search.'
    });
  }

  try {
    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;
    const fetchResponse = await fetch(apiUrl);

    if (!fetchResponse.ok) {
      return response.status(fetchResponse.status).json({
        error: 'Word not found.'
      });
    }

    const data = await fetchResponse.json();
    return response.status(200).json(data);
  } catch (error) {
    return response.status(500).json({
      error: 'Something went wrong while fetching the dictionary data.'
    });
  }
};
