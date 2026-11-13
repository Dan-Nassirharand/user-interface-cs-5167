<script>
  import { tick } from 'svelte';
  import { listings, categories } from './listings.js';

  let { query = '', location = 'Cincinnati, OH', onsearch } = $props();
  let filtersOpen = $state(true);
  let category = $state('All categories');
  let subcategory = $state('All subcategories');
  let subcategories = $derived(categories[category] ?? []);
  let condition = $state('Any condition');
  let color = $state('Any color');
  let minimum = $state('');
  let maximum = $state('');
  let sort = $state('newest');
  let saved = $state([]);
  let selected = $state(null);
  let dialog;
  let hidden = $state([]);
  let flagged = $state([]);
  let detailMessage = $state('');
  let replyOpen = $state(false);
  let message = $state('');
  let messageInput = $state(null);
  let scrollY = $state(0);

  $effect(() => {
    if (!selected) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    const previousGutter = root.style.scrollbarGutter;
    const previousBodyOverflow = document.body.style.overflow;
    root.style.scrollbarGutter = 'stable';
    root.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      root.style.overflow = previousOverflow;
      root.style.scrollbarGutter = previousGutter;
      document.body.style.overflow = previousBodyOverflow;
    };
  });
  const pageSize = 12;
  const maxItems = pageSize * 3;
  let visibleCount = $state(pageSize);
  const hasPrice = value => value !== '' && value != null;
  let activeCount = $derived(Number(category !== 'All categories') + Number(subcategory !== 'All subcategories') + Number(condition !== 'Any condition') + Number(color !== 'Any color') + Number(hasPrice(minimum)) + Number(hasPrice(maximum)));
  let matches = $derived.by(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    return listings.filter(item => {
      const text = `${item.title} ${item.mainCategory} ${item.category} ${item.description} ${item.color}`.toLowerCase();
      return words.every(word => text.includes(word))
        && (category === 'All categories' || item.mainCategory === category)
        && (subcategory === 'All subcategories' || item.category === subcategory)
        && (condition === 'Any condition' || item.condition === condition)
        && (color === 'Any color' || item.color === color)
        && (!hasPrice(minimum) || item.price >= Number(minimum))
        && (!hasPrice(maximum) || item.price <= Number(maximum));
    }).sort((a, b) => sort === 'price-low' ? a.price - b.price : sort === 'price-high' ? b.price - a.price : a.age - b.age);
  });

  let results = $derived(matches.length ? Array.from({ length: visibleCount }, (_, index) => {
    const item = matches[index % matches.length];
    return { ...item, id: `${item.id}-${index}`, title: `${item.title}` };
  }).filter(item => !hidden.includes(item.id)) : []);

  $effect(() => {
    matches;
    visibleCount = pageSize;
  });

  // Repeat mock listings when the next page enters the viewport.
  function loadMore() {
    visibleCount = Math.min(visibleCount + pageSize, maxItems);
  }

  function observeNextPage(node) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) loadMore();
    }, { rootMargin: '0px 0px 300px 0px' });
    observer.observe(node);
    return { destroy: () => observer.disconnect() };
  }

  function reset() {
    category = 'All categories'; subcategory = 'All subcategories'; condition = 'Any condition'; color = 'Any color'; minimum = ''; maximum = '';
  }
  function toggleSaved(id) {
    saved = saved.includes(id) ? saved.filter(value => value !== id) : [...saved, id];
  }
  function openListing(item) {
    selected = item;
    detailMessage = '';
    replyOpen = false;
    message = '';
    dialog.showModal();
  }
  async function openReply() {
    replyOpen = true;
    detailMessage = '';
    await tick();
    messageInput?.focus();
  }

  function sendReply(event) {
    event.preventDefault();
    if (!message.trim()) {
      messageInput?.focus();
      return;
    }
    replyOpen = false;
    message = '';
    detailMessage = 'Demo reply submitted. No message was sent.';
  }
  function hideListing() {
    hidden = [...hidden, selected.id];
    dialog.close();
  }

  function flagListing() {
    const id = selected.id;
    flagged = flagged.includes(id) ? flagged.filter(value => value !== id) : [...flagged, id];
    detailMessage = flagged.includes(id) ? 'Listing flagged for review (demo).' : 'Flag removed.';
  }

  async function shareListing() {
    try {
      await navigator.clipboard.writeText(          `${window.location.origin}/search-final?q=${encodeURIComponent(selected.title.replace(/ #\d+$/, ''))}`      );
      detailMessage = 'Search link copied to clipboard.';
    } catch {
      detailMessage = 'Could not copy the link. You can share the page URL from your browser.';
    }
  }
</script>

<svelte:window bind:scrollY />

<svelte:head><title>{query ? `${query} — ` : ''}Search | craigslist</title></svelte:head>

<main>
  <div class="toolbar">
    <button class="filter-toggle" aria-label={filtersOpen ? 'Hide filters' : 'Show filters'} aria-expanded={filtersOpen} aria-controls={filtersOpen ? 'search-filters' : undefined} title={filtersOpen ? 'Hide filters' : 'Show filters'} onclick={() => filtersOpen = !filtersOpen}><span aria-hidden="true">☷</span> <span>{filtersOpen ? 'Hide filters' : 'Show filters'}</span>{activeCount ? ` (${activeCount})` : ''}</button>
    <p aria-live="polite"><strong>{results.length}</strong> {results.length === 1 ? 'result' : 'results'}</p>
  </div>
  <div class="layout" class:expanded={!filtersOpen}>
    {#if filtersOpen}
      <aside id="search-filters" aria-label="Search filters">
        <div class="filter-heading"><h2>Filters</h2><button class="text-button" onclick={reset}>Reset all</button></div>
        <label>Sort by <select bind:value={sort}><option value="newest">Newest first</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label>
        <label>Main category<select bind:value={category} onchange={() => subcategory = 'All subcategories'}><option>All categories</option>{#each Object.keys(categories) as value}<option>{value}</option>{/each}</select></label>
        {#if category !== 'All categories'}
          <label>Subcategory<select bind:value={subcategory}><option>All subcategories</option>{#each subcategories as value}<option>{value}</option>{/each}</select></label>
        {/if}
        <fieldset><legend>Price</legend><div class="price-inputs"><label><span>Min ($)</span><input type="number" min="0" placeholder="0" bind:value={minimum} /></label><span>–</span><label><span>Max ($)</span><input type="number" min="0" placeholder="Any" bind:value={maximum} /></label></div></fieldset>
        <label>Condition<select bind:value={condition}><option>Any condition</option><option>Like new</option><option>Good</option><option>Fair</option></select></label>
        <label>Color<select bind:value={color}><option>Any color</option>{#each ['Black', 'Blue', 'Brown', 'Gray', 'Green', 'White'] as value}<option>{value}</option>{/each}</select></label>
        <div class="local-note"><strong>A little closer. A little better.</strong><p>Discover pre-loved finds from your local community.</p></div>
      </aside>
    {/if}
    <section aria-label="Search results">
      {#if results.length}
        <div class="cards">
          {#each results as item (item.id)}
            <article>
              <div class="image-wrap"><button class="image-button" onclick={() => openListing(item)} aria-label={`View ${item.title}`}><img src={item.image} alt={item.title} /></button><button class="save" class:saved={saved.includes(item.id)} aria-label={`${saved.includes(item.id) ? 'Unsave' : 'Save'} ${item.title}`} aria-pressed={saved.includes(item.id)} onclick={() => toggleSaved(item.id)}>{saved.includes(item.id) ? '♥' : '♡'}</button></div>
              <div class="card-body"><div class="card-top"><span>{item.category}</span><strong>${item.price}</strong></div><h2><button onclick={() => openListing(item)}>{item.title}</button></h2><p class="description">{item.description}</p><div class="meta"><span>{item.neighborhood}</span><span>{item.age}h ago</span></div></div>
            </article>
          {/each}
        </div>
        {#if visibleCount < maxItems}
          <div class="load-more" use:observeNextPage>
            <button onclick={loadMore}>Load more listings</button>
          </div>
        {:else}
          <p class="end-message">You've reached the end of the listings.</p>
        {/if}
      {:else}
        <div class="empty"><h2>No matches just yet</h2><p>Try a different search or loosen your filters.</p>{#if activeCount}<button onclick={reset}>Clear filters</button>{/if}<button onclick={() => onsearch('', 'search')}>Browse all listings</button></div>
      {/if}
    </section>
  </div>
</main>
{#if scrollY > 100}
<button
  class="back-to-top"
  aria-label="Back to top"
  title="Back to top"
  onclick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}
>
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="m6 10 6-6 6 6M12 4v16" />
  </svg>
</button>
{/if}
<dialog bind:this={dialog} onclose={() => selected = null}>
  {#if selected}
    <button class="close" aria-label="Close listing" onclick={() => dialog.close()}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button>
    <div class="detail-layout">
    <img class="detail-image" src={selected.image} alt={selected.title} />
    <div class="detail-body">
      <div class="listing-actions">
        <button onclick={() => toggleSaved(selected.id)} aria-pressed={saved.includes(selected.id)}>
          <svg class:favorite-filled={saved.includes(selected.id)} viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" /></svg>
          <span>Favorite</span>
        </button>
        <button onclick={hideListing}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 3 18 18M10.5 10.5a2 2 0 0 0 3 3M9 5.5A12 12 0 0 1 12 5c6 0 10 7 10 7a19 19 0 0 1-4 4M6 6C3.5 8 2 12 2 12s4 7 10 7a12 12 0 0 0 5-1" /></svg><span>Hide</span></button>
        <button onclick={flagListing} aria-pressed={flagged.includes(selected.id)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 21V3m0 1c5-4 9 4 14 0v10c-5 4-9-4-14 0" /></svg><span>{flagged.includes(selected.id) ? 'Flagged' : 'Flag'}</span></button>
        <button onclick={shareListing}><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4m-6.8 7 6.8 4" /></svg><span>Share</span></button>
      </div>
      <p class="eyebrow">{selected.category} ? {selected.condition}</p>
      <h2>{selected.title}</h2>
      <strong class="detail-price">${selected.price}</strong>
      <p>{selected.description}</p>
      <p class="subtitle">{selected.neighborhood} ? {location} ? {selected.age}h ago</p>
      <div class="listing-map" class:reply-open={replyOpen}>
          <form class="reply-form" inert={!replyOpen} aria-hidden={!replyOpen} onsubmit={sendReply}>
            <label for="reply-message">Message to seller</label>
            <textarea id="reply-message" bind:this={messageInput} bind:value={message} placeholder="Hi, is this still available?" required maxlength="2000"></textarea>
            <div class="reply-actions">
              <button type="button" onclick={() => replyOpen = false}>Cancel</button>
              <button type="submit" class="send-reply" disabled={!message.trim()}>Send message</button>
            </div>
          </form>
        <div class="map-content" aria-hidden={replyOpen}>
        <svg viewBox="0 0 480 180" role="img" aria-label={`Mock map of ${selected.neighborhood}`}>
          <rect width="480" height="180" fill="var(--bg-tertiary)" />
          <path d="M0 35h480M0 100h480M70 0v180M200 0v180M350 0v180" stroke="var(--bg-surface)" stroke-width="15" />
          <path d="m0 160 480-130" stroke="var(--color-accent)" stroke-width="20" opacity=".2" />
          <circle cx="240" cy="90" r="42" fill="var(--color-primary)" opacity=".12" />
          <path d="M240 56a19 19 0 0 0-19 19c0 16 19 34 19 34s19-18 19-34a19 19 0 0 0-19-19Z" fill="var(--color-primary)" />
          <circle cx="240" cy="75" r="6" fill="var(--color-primary-contrast)" />
        </svg>
        <p>{selected.neighborhood} ? Approximate location ? Mock map</p>
        </div>
      </div>
      <button class="reply-button" class:reply-hidden={replyOpen} inert={replyOpen} aria-hidden={replyOpen} onclick={openReply}>Reply</button>
      <p class="action-message" role="status">{detailMessage}</p>
    </div>
    </div>
  {/if}
</dialog>

<style>
  .listing-actions { display:flex; justify-content:flex-start; flex-wrap:wrap; gap:.75rem; padding-right:2.5rem; margin-bottom:1.25rem; }
  .listing-actions button { display:flex; flex-direction:column; align-items:center; gap:.35rem; min-width:3rem; padding:.5rem; border:0; background:none; font-size:.75rem; }
  .listing-actions button:hover, .listing-actions button[aria-pressed="true"] { color:var(--color-primary); background:var(--color-primary-light); }
  .listing-actions svg { width:1.4rem; height:1.4rem; fill:none; stroke:currentColor; stroke-width:1.7; stroke-linecap:round; stroke-linejoin:round; }
  .listing-map { position:relative; margin-top:1.25rem; border:1px solid var(--border-subtle); border-radius:var(--radius-md); overflow:hidden; }
  .listing-map svg { display:block; width:100%; }
  .listing-map p { margin:0; padding:.6rem; font-size:.75rem; color:var(--text-secondary); }
  .map-content { display:flex; flex-direction:column; min-height:220px; opacity:1; transition:opacity 220ms ease; }
  .map-content svg { flex:1; min-height:0; }
  .reply-open .map-content { opacity:0; }
  .reply-form { position:absolute; inset:0; z-index:1; display:flex; flex-direction:column; gap:.6rem; padding:1rem; background:var(--bg-surface); opacity:0; transform:translateY(8px); pointer-events:none; transition:opacity 220ms ease, transform 220ms ease; }
  .reply-open .reply-form { opacity:1; transform:translateY(0); pointer-events:auto; }
  .reply-hidden { visibility:hidden; }
  @media(prefers-reduced-motion:reduce) { .map-content, .reply-form { transition:none; transform:none; } }
  .reply-form label { font-size:.875rem; font-weight:600; }
  .reply-form textarea { width:100%; flex:1; min-height:0; resize:none; padding:.75rem; font:inherit; font-size:.875rem; color:var(--text-primary); background:var(--bg-primary); border:1px solid var(--border-default); border-radius:var(--radius-md); }
  .reply-form textarea:focus-visible { outline:2px solid var(--color-accent); outline-offset:2px; }
  .reply-actions { display:flex; justify-content:flex-end; gap:.5rem; }
  .reply-actions .send-reply { background:var(--color-primary); color:var(--color-primary-contrast); border-color:var(--color-primary); }
  .send-reply:disabled { opacity:.5; cursor:default; }
  .detail-body .reply-button { width:100%; color:var(--color-primary-contrast); background:var(--color-primary); border:0; }
  .detail-body .reply-button:hover { background:var(--color-primary-hover); }
  .action-message { margin:0; font-size:.8rem; color:var(--text-secondary); }
  main { position:relative; max-width:1500px; margin:auto; padding:1.5rem 3rem; }
  .back-to-top {
    position:fixed;
    right:max(1.25rem, env(safe-area-inset-right));
    bottom:max(1.25rem, env(safe-area-inset-bottom));
    z-index:20;
    display:grid;
    place-items:center;
    width:3rem;
    height:3rem;
    padding:0;
    border:0;
    border-radius:50%;
    color:var(--color-primary-contrast);
    background:var(--color-primary);
    box-shadow:var(--shadow-lg);
  }
  .back-to-top:hover { background:var(--color-primary-hover); }
  .back-to-top svg { width:1.4rem; height:1.4rem; fill:none; stroke:currentColor; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }
  .load-more { display:flex; justify-content:center; padding:2rem 0; }
  .end-message { text-align:center; padding:2rem 0; color:var(--text-secondary); font-size:.875rem; }
  .toolbar {
    position:sticky;
    top:1rem;
    z-index:10;
    display:flex;
    align-items:center;
    flex-wrap:wrap;
    gap:.6rem;
    width:fit-content;
    max-width:calc(100% + 3rem);
    min-height:2.75rem;
    margin-left:-3rem;
    padding:.4rem 1.75rem .4rem .5rem;
    color:var(--color-primary-contrast);
    background:var(--color-primary);
    font-size:.85rem;
    clip-path:polygon(0 0,100% 0,calc(100% - .75rem) 50%,100% 100%,0 100%);
  }
  .toolbar:focus-within { clip-path:none; }
  .toolbar .filter-toggle {
    display:flex;
    align-items:center;
    gap:.5rem;
    border:0;
    padding:.35rem .5rem;
    color:inherit;
    background:transparent;
    white-space:nowrap;
  }
  .toolbar .filter-toggle:hover { background:var(--color-primary-hover); }
  .toolbar .filter-toggle:focus-visible { outline:2px solid currentColor; outline-offset:0; }
  .toolbar p { margin:0; padding-left:.75rem; border-left:1px solid currentColor; white-space:nowrap; }
  @media(max-width:760px) {
    .toolbar { margin-left:-1rem; max-width:calc(100% + 1rem); }
  }
  .eyebrow { color:var(--color-primary); font-size:.7rem; font-weight:700; letter-spacing:.13em; margin:0 0 .5rem; } .subtitle { color:var(--text-secondary); font-size:.875rem; margin:0; }
  button,input,select { font:inherit; } button { cursor:pointer; } button,select,input { border:1px solid var(--border-default); border-radius:var(--radius-md); background:var(--bg-surface); color:var(--text-primary); padding:.6rem .8rem; } button:hover { border-color:var(--color-primary); } :is(button,input,select):focus-visible { outline:2px solid var(--color-accent); outline-offset:3px; }
  .layout { display:grid; grid-template-columns:220px minmax(0,1fr); gap:2rem; padding-top:1.5rem; } .layout.expanded { grid-template-columns:minmax(0,1fr); } aside {
    position:sticky;
    top:5.25rem;
    align-self:start;
    max-height:calc(100dvh - 6.25rem);
    overflow-y:auto;
    overscroll-behavior:contain;
    min-width:0;
    margin-left:-2rem;
    padding:.35rem 1rem .35rem .35rem;
    border-right:1px solid var(--border-subtle);
    background:var(--bg-primary);
    z-index:5;
  } .filter-heading { display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem; } .filter-heading h2 { font-size:1rem; margin:0; } .text-button { border:0; padding:0; color:var(--color-accent); font-size:.75rem; background:none; }
  aside > label,fieldset { display:block; font-size:.8rem; font-weight:600; margin:0 0 1.5rem; } aside select { display:block; width:100%; margin-top:.6rem; font-size:.8rem; font-weight:400; } fieldset { padding:0; border:0; min-width:0; } legend { margin-bottom:.6rem; } .price-inputs { display:flex; align-items:end; gap:.4rem; } .price-inputs label { min-width:0; flex:1; } .price-inputs span { font-size:.7rem; color:var(--text-secondary); } .price-inputs input { width:100%; margin-top:.3rem; font-size:.8rem; } .local-note { border-top:1px solid var(--border-subtle); padding-top:1.5rem; font-size:.8rem; color:var(--color-sage); } .local-note p { color:var(--text-secondary); line-height:1.7; }
  .cards { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:1.5rem; } article { border:1px solid var(--border-subtle); border-radius:var(--radius-lg); overflow:hidden; background:var(--bg-surface); transition:box-shadow .2s; } article:hover { box-shadow:var(--shadow-md); } .image-wrap { position:relative; } .image-button { display:block; width:100%; padding:0; border:0; border-radius:0; } img { display:block; width:100%; aspect-ratio:4/3; object-fit:cover; } .save { position:absolute; right:.75rem; top:.75rem; width:2rem; height:2rem; padding:0; border:0; border-radius:50%; background:var(--bg-surface); font-size:1.35rem; box-shadow:var(--shadow-sm); } .saved { color:var(--color-primary); } .card-body { padding:1rem; } .card-top,.meta { display:flex; justify-content:space-between; align-items:center; gap:.5rem; } .card-top span { color:var(--color-primary); font-size:.7rem; } .card-top strong { font-size:1.1rem; } article h2 { margin:.35rem 0 .5rem; font-size:1rem; } article h2 button { border:0; padding:0; background:none; text-align:left; font-weight:600; } article h2 button:hover { color:var(--color-primary); } .description { font-size:.8rem; color:var(--text-secondary); margin:0; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; min-height:2.4rem; } .meta { border-top:1px solid var(--border-subtle); padding-top:.8rem; margin-top:1rem; font-size:.7rem; color:var(--text-secondary); }
  .empty { text-align:center; padding:5rem 1rem; color:var(--text-secondary); } .empty h2 { color:var(--text-primary); } .empty button { margin:.5rem; }
  dialog { padding:0; border:1px solid var(--border-subtle); border-radius:var(--radius-xl); background:var(--bg-surface); color:var(--text-primary); width:min(1000px,94vw); max-height:90dvh; overflow-y:auto; overscroll-behavior:contain; } dialog::backdrop { background:#0f172a99; } .close { position:absolute; right:1rem; top:1rem; z-index:2; display:grid; place-items:center; width:2.5rem; height:2.5rem; padding:0; border:1px solid var(--border-default); border-radius:50%; background:var(--bg-surface); color:var(--text-primary); box-shadow:var(--shadow-md); }
  .close svg { width:1.25rem; height:1.25rem; fill:none; stroke:currentColor; stroke-width:2; stroke-linecap:round; }
  .listing-actions svg.favorite-filled { fill:currentColor; } .detail-layout { display:grid; grid-template-columns:minmax(0,1.1fr) minmax(0,1fr); }
  .detail-image { position:sticky; top:0; height:100%; max-height:90dvh; aspect-ratio:auto; object-fit:contain; background:var(--bg-secondary); }
  .detail-body { min-width:0; }
  @media(max-width:700px) {
    .detail-layout { grid-template-columns:1fr; }
    .detail-image { position:static; height:auto; max-height:300px; aspect-ratio:4/3; }
  } .detail-body { padding:1.5rem; } .detail-body h2 { margin:.5rem 0; } .detail-price { color:var(--color-primary); font-size:1.5rem; } .detail-body > button { margin:1rem 0; }
  @media(min-width:1450px) { .expanded .cards { grid-template-columns:repeat(4,minmax(0,1fr)); } }
  @media(max-width:1100px) { .cards { grid-template-columns:repeat(2,minmax(0,1fr)); } }
  @media(max-width:760px) { main { padding:1.25rem 1rem; } .layout { grid-template-columns:1fr; gap:1rem; } aside { margin-left:0; padding:1rem; border:1px solid var(--border-subtle); border-radius:var(--radius-md); } .local-note { display:none; } .cards { gap:1rem; } }
  @media(max-width:440px) { .cards { grid-template-columns:1fr; } }
</style>
