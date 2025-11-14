
const qs = (sel) => document.querySelector(sel);
const resultsEl = qs('#results');
const statusEl  = qs('#status');
const queryEl   = qs('#query');
const limitEl   = qs('#limit');
const entityEl  = qs('#entity');
const searchBtn = qs('#searchBtn');
const luckyBtn  = qs('#luckyBtn');

const luckyTerms = [
  'Taylor Swift', 'Eminem', 'Imagine Dragons', 'Coldplay', 'Billie Eilish',
  'Arabic LoFi', 'Khalid', 'Amr Diab', 'Nancy Ajram', 'The Weeknd',
  'Lo-fi beats', 'Game OST', 'Mozart', 'Adele', 'Fairuz'
];

function setStatus(msg, isError=false) {
  statusEl.textContent = msg || '';
  statusEl.style.color = isError ? '#ff9aa2' : '#c7d8eb';
}

function templateCard(item) {
  const art = item.artworkUrl100?.replace('100x100', '300x300') || '';
  const kind = item.kind || item.wrapperType || '—';
  const track = item.trackName || item.collectionName || 'Untitled';
  const artist = item.artistName || 'Unknown Artist';
  const album = item.collectionName || '';
  const audio = item.previewUrl ? `<audio class="audio" controls src="${item.previewUrl}" preload="none"></audio>` : '';

  return `
    <article class="card" tabindex="0">
      ${art ? `<img class="cover" src="${art}" alt="Cover art for ${album || track}">` : ''}
      <div class="content">
        <div class="badge">${kind}</div>
        <div class="title">${track}</div>
        <div class="meta">by ${artist}${album ? ' • ' + album : ''}</div>
        ${audio}
      </div>
    </article>
  `;
}

async function search(term) {
  const limit = parseInt(limitEl.value, 10) || 10;
  const entity = entityEl.value || 'song';
  const url = new URL('https://itunes.apple.com/search');
  url.searchParams.set('term', term);
  url.searchParams.set('media', 'music');
  url.searchParams.set('limit', String(limit));

 
  const entityMap = {
    'song': 'song',
    'musicArtist': 'musicArtist',
    'album': 'album',
    'musicVideo': 'musicVideo',
    'podcast': 'podcast'
  };
  if (entityMap[entity]) url.searchParams.set('entity', entityMap[entity]);

  try {
    setStatus('Searching...');
    resultsEl.innerHTML = '';

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const items = data.results || [];
    if (!items.length) {
      setStatus('No results. Try another keyword.');
      return;
    }

    resultsEl.innerHTML = items.map(templateCard).join('');
    setStatus(`Found ${items.length} result(s).`);
  } catch (err) {
    console.error(err);
    setStatus('Failed to fetch results. Please try again.', true);
  }
}

searchBtn.addEventListener('click', () => {
  const term = queryEl.value.trim();
  if (!term) {
    setStatus('Please type something to search.', true);
    queryEl.focus();
    return;
  }
  search(term);
});

queryEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    searchBtn.click();
  }
});

luckyBtn.addEventListener('click', () => {
  const term = luckyTerms[Math.floor(Math.random() * luckyTerms.length)];
  queryEl.value = term;
  search(term);
});


search('Drake');
