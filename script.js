const getinput = document.querySelector('#btn');
const getvalue = document.querySelector('#inputs');
const display = document.querySelector('#display');
const load = document.querySelector('.loader');

function loadingstart() {
  load.style.display = 'block';
}

function loadingstop() {
  load.style.display = 'none';
}

function renderDefinitions(data) {
  if (!Array.isArray(data) || !data.length) {
    display.innerHTML = 'No word found. Try another one.';
    return;
  }

  const entries = data
    .map((entry) => ({
      word: entry.word || 'Word',
      meanings: Array.isArray(entry.meanings) ? entry.meanings : []
    }))
    .filter((entry) => entry.meanings.length > 0);

  if (!entries.length) {
    display.innerHTML = 'No word found. Try another one.';
    return;
  }

  const cards = entries
    .map((entry) => {
      const meaningBlocks = entry.meanings
        .map((meaning, meaningIndex) => {
          const definitions = Array.isArray(meaning.definitions) ? meaning.definitions : [];
          if (!definitions.length) return '';

          const listItems = definitions
            .map((def, defIndex) => {
              const example = def.example ? `<div class="example">Example: ${def.example}</div>` : '';
              const synonyms = Array.isArray(def.synonyms) && def.synonyms.length
                ? `<div class="synonyms">Synonyms: ${def.synonyms.slice(0, 5).join(', ')}</div>`
                : '';

              return `
                <li>
                  <strong>${meaning.partOfSpeech || 'Definition'} ${defIndex + 1}:</strong>
                  <span>${def.definition || 'No definition available.'}</span>
                  ${example}
                  ${synonyms}
                </li>
              `;
            })
            .join('');

          return `
            <div class="meaning-block">
              <h3>${meaning.partOfSpeech || `Meaning ${meaningIndex + 1}`}</h3>
              <ul>${listItems}</ul>
            </div>
          `;
        })
        .join('');

      return `
        <div class="meaning-group">
          <h2>${entry.word}</h2>
          ${meaningBlocks}
        </div>
      `;
    })
    .join('');

  display.innerHTML = `<div class="word-result">${cards}</div>`;
}

function searchWord() {
  const inputValue = getvalue.value.trim();

  if (!inputValue) {
    display.innerHTML = 'Please type a word first.';
    return;
  }

  display.innerHTML = '';
  loadingstart();

  const endpoint = `/api/dictionary?word=${encodeURIComponent(inputValue)}`;

  fetch(endpoint)
    .then((response) => response.json())
    .then((data) => {
      if (data && data.error) {
        throw new Error(data.error);
      }
      renderDefinitions(data);
    })
    .catch((error) => {
      console.error(error);
      display.innerHTML = 'No word found. Please try another one.';
    })
    .finally(() => {
      loadingstop();
    });
}

getinput.addEventListener('click', searchWord);

getvalue.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    searchWord();
  }
});
