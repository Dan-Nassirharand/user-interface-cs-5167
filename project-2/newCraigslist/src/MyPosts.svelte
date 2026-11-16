<script>
  import { untrack, tick } from 'svelte';
  import LocationIcon from './LocationIcon.svelte';

  let { open = false, categories = [], onclose = () => {} } = $props();
  let dialog = $state(null);
  let posts = $state([]);
  let selected = $state(null);
  let error = $state('');
  let selectedIndex = 0;

  function cleanText(value, limit = 100) {
    return typeof value === 'string' ? value.slice(0, limit).trim() : '';
  }

  function loadPosts() {
    posts = [];
    selected = null;
    error = '';
    try {
      const saved = JSON.parse(localStorage.getItem('craigslist-local-posts-v1') || '[]');
      if (!Array.isArray(saved)) throw new Error();
      posts = saved.filter((post) => post && typeof post === 'object' && typeof post.title === 'string').slice(0, 10).map((post) => {
        const date = typeof post.createdAt === 'string' ? Date.parse(post.createdAt) : NaN;
        return {
          title: cleanText(post.title) || 'Untitled post',
          categoryId: cleanText(post.categoryId, 40),
          subcategory: cleanText(post.subcategory),
          description: cleanText(post.description, 6000),
          neighborhood: cleanText(post.neighborhood, 80),
          postalCode: cleanText(post.postalCode, 10),
          city: cleanText(post.location?.city, 80),
          state: cleanText(post.location?.state, 10),
          condition: cleanText(post.condition, 40).replaceAll('-', ' '),
          email: cleanText(post.email, 254),
          phone: post.sharePhone === true ? cleanText(post.phone, 30) : '',
          sellerType: post.sellerType === 'business' ? 'Business / organization' : 'Individual',
          price: typeof post.price === 'string' || typeof post.price === 'number' ? String(post.price).slice(0, 20) : '',
          timestamp: Number.isFinite(date) ? date : 0,
          photos: Array.isArray(post.photos) ? post.photos.filter((photo) => typeof photo?.src === 'string' && photo.src.startsWith('data:image/jpeg;base64,') && photo.src.length <= 220000).slice(0, 4).map((photo) => photo.src) : [],
        };
      }).sort((a, b) => b.timestamp - a.timestamp);
    } catch {
      error = 'We couldn’t load your posts. Please close this window and try again.';
    }
  }

  $effect(() => {
    if (!dialog) return;
    if (open && !dialog.open) {
      untrack(loadPosts);
      dialog.showModal();
    } else if (!open && dialog.open) dialog.close();
  });

  function categoryTitle(post) {
    return categories.find((category) => category.id === post.categoryId)?.title || 'Post';
  }

  function locationLabel(post) {
    return [post.city, post.state].filter(Boolean).join(', ') || 'Local area';
  }

  function dateLabel(post) {
    return post.timestamp ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(post.timestamp) : 'Saved post';
  }

  function priceLabel(post) {
    if (post.categoryId === 'free') return 'Free';
    if (!['housing', 'auto', 'shopping', 'services'].includes(post.categoryId) || post.price === '') return '';
    const price = Number(post.price);
    return Number.isFinite(price) && price >= 0 && price <= 999999999 ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(price) : '';
  }

  async function viewPost(post, index) {
    selectedIndex = index;
    selected = post;
    await tick();
    dialog.querySelector('.post-title')?.focus();
    dialog.scrollTo({ top: 0 });
  }

  async function backToPosts() {
    selected = null;
    await tick();
    dialog.querySelector(`[data-post-index="${selectedIndex}"]`)?.focus();
  }
</script>

<dialog bind:this={dialog} class="posts-dialog" aria-labelledby="my-posts-title" onclose={onclose}>
  <header>
    <div class="heading"><span class="heading-icon"><LocationIcon name="jobs" size={23} /></span><div><h2 id="my-posts-title">My posts</h2><p>Your listings, all in one place.</p></div></div>
    <button class="icon-button" onclick={onclose} aria-label="Close my posts"><LocationIcon name="close" size={21} /></button>
  </header>
  <div class="dialog-body">
    {#if error}
      <p class="error" role="alert">{error}</p>
    {:else if selected}
      <button class="back-button" onclick={backToPosts}><LocationIcon name="arrow-left" size={17} />Back to my posts</button>
      <article>
        <p class="category-line">{categoryTitle(selected)}{#if selected.subcategory}<LocationIcon name="chevron-right" size={13} />{selected.subcategory}{/if}</p>
        <div class="title-row"><h3 class="post-title" tabindex="-1">{selected.title}</h3>{#if priceLabel(selected)}<strong>{priceLabel(selected)}</strong>{/if}</div>
        <p class="location"><LocationIcon name="pin" size={15} />{[selected.neighborhood, locationLabel(selected), selected.postalCode].filter(Boolean).join(' · ')}</p>
        <p class="saved-date">Saved {dateLabel(selected)}</p>
        {#if selected.photos.length}<div class="photos">{#each selected.photos as photo, index}<img src={photo} alt={`Listing photo ${index + 1}`} />{/each}</div>{/if}
        <p class="description">{selected.description}</p>
        <dl>
          <div><dt>Posted by</dt><dd>{selected.sellerType}</dd></div>
          {#if selected.condition}<div><dt>Condition</dt><dd>{selected.condition}</dd></div>{/if}
          {#if selected.email}<div><dt>Reply email</dt><dd>{selected.email}</dd></div>{/if}
          {#if selected.phone}<div><dt>Phone</dt><dd>{selected.phone}</dd></div>{/if}
        </dl>
      </article>
    {:else if posts.length}
      <ul class="posts-list">
        {#each posts as post, index}
          <li><button class="post-row" data-post-index={index} onclick={() => viewPost(post, index)}>
            <span class="thumbnail">{#if post.photos.length}<img src={post.photos[0]} alt="" />{:else}<LocationIcon name="image" size={25} />{/if}</span>
            <span class="post-copy"><strong>{post.title}</strong><span>{categoryTitle(post)} · {locationLabel(post)}</span><small>{dateLabel(post)}</small></span>
            <span class="row-end">{#if priceLabel(post)}<strong>{priceLabel(post)}</strong>{/if}<LocationIcon name="chevron-right" size={17} /></span>
          </button></li>
        {/each}
      </ul>
    {:else}
      <div class="empty-state"><span><LocationIcon name="jobs" size={30} /></span><h3>No posts yet</h3><p>Create a post, then come back here to view it.</p></div>
    {/if}
  </div>
</dialog>

<style>
  .posts-dialog { width: min(700px, calc(100% - 2rem)); max-height: calc(100dvh - 2rem); margin: auto; padding: 0; border: 1px solid var(--border-default); border-radius: var(--radius-xl); background: var(--bg-surface); color: var(--text-primary); box-shadow: var(--shadow-lg); }
  .posts-dialog::backdrop { background: color-mix(in srgb, var(--text-primary) 40%, transparent); backdrop-filter: blur(3px); }
  button { font: inherit; cursor: pointer; }
  button:focus-visible { outline: 3px solid var(--color-primary); outline-offset: 3px; }
  h2, h3, p { margin: 0; }
  header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1.4rem 1.6rem; border-bottom: 1px solid var(--border-subtle); }
  .heading { display: flex; align-items: center; gap: 0.85rem; }
  .heading-icon { display: grid; place-items: center; width: 43px; height: 43px; border-radius: var(--radius-lg); color: var(--color-primary); background: var(--color-primary-light); }
  h2 { font-size: var(--text-xl); letter-spacing: -0.025em; line-height: var(--leading-tight); }
  .heading p { color: var(--text-secondary); font-size: var(--text-xs); margin-top: 0.25rem; }
  .icon-button { display: grid; place-items: center; width: 34px; height: 34px; padding: 0; flex-shrink: 0; border: 0; border-radius: var(--radius-md); color: var(--text-secondary); background: transparent; }
  .icon-button:hover { background: var(--bg-tertiary); color: var(--text-primary); }
  .dialog-body { padding: 1.4rem 1.6rem; }
  .posts-list { list-style: none; display: grid; gap: 0.7rem; padding: 0; margin: 0; }
  .post-row { display: flex; align-items: center; gap: 0.9rem; width: 100%; padding: 0.9rem; text-align: left; border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); background: var(--bg-surface); color: var(--text-primary); }
  .post-row:hover { border-color: var(--color-primary); background: var(--bg-surface-hover); }
  .thumbnail { display: grid; place-items: center; width: 68px; height: 68px; overflow: hidden; border-radius: var(--radius-md); background: var(--bg-tertiary); color: var(--text-secondary); flex-shrink: 0; }
  .thumbnail img { width: 100%; height: 100%; object-fit: cover; }
  .post-copy { display: grid; gap: 0.25rem; flex: 1; min-width: 0; }
  .post-copy > strong { font-size: var(--text-sm); font-weight: var(--weight-semibold); overflow-wrap: anywhere; }
  .post-copy > span { color: var(--text-secondary); font-size: var(--text-xs); overflow-wrap: anywhere; }
  .post-copy > small { color: var(--text-secondary); font-size: 0.65rem; }
  .row-end { display: flex; align-items: center; gap: 0.7rem; color: var(--color-primary); }
  .row-end strong { font-size: var(--text-sm); white-space: nowrap; }
  .back-button { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.3rem 0; margin-bottom: 1.25rem; border: 0; background: transparent; color: var(--color-primary); font-size: var(--text-xs); font-weight: var(--weight-medium); }
  .back-button:hover { text-decoration: underline; }
  .category-line { display: flex; align-items: center; gap: 0.35rem; flex-wrap: wrap; color: var(--text-secondary); font-size: var(--text-xs); }
  .title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-top: 0.8rem; }
  .post-title { font-size: var(--text-2xl); line-height: var(--leading-tight); letter-spacing: -0.03em; overflow-wrap: anywhere; outline: none; }
  .title-row > strong { color: var(--color-primary); font-size: var(--text-lg); white-space: nowrap; }
  .location { display: flex; align-items: center; gap: 0.35rem; margin-top: 0.65rem; color: var(--text-secondary); font-size: var(--text-xs); }
  .saved-date { margin-top: 0.4rem; color: var(--text-secondary); font-size: 0.65rem; }
  .photos { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.6rem; margin-top: 1.2rem; }
  .photos img { width: 100%; height: 170px; object-fit: cover; border-radius: var(--radius-md); }
  .photos img:only-child { grid-column: 1 / -1; height: 260px; }
  .description { margin-top: 1.25rem; white-space: pre-wrap; overflow-wrap: anywhere; font-size: var(--text-sm); line-height: var(--leading-relaxed); }
  dl { display: grid; gap: 0.5rem; border-top: 1px solid var(--border-subtle); padding-top: 1rem; margin: 1.2rem 0 0; font-size: var(--text-xs); }
  dl > div { display: flex; gap: 1rem; }
  dt { width: 90px; flex-shrink: 0; color: var(--text-secondary); }
  dd { margin: 0; overflow-wrap: anywhere; }
  .empty-state { text-align: center; padding: 2.2rem 1rem; }
  .empty-state > span { width: 58px; height: 58px; display: grid; place-items: center; margin: 0 auto 1rem; border-radius: var(--radius-full); color: var(--color-primary); background: var(--color-primary-light); }
  .empty-state h3 { font-size: var(--text-xl); letter-spacing: -0.025em; }
  .empty-state p { color: var(--text-secondary); font-size: var(--text-sm); margin-top: 0.5rem; }
  .error { padding: 0.8rem 1rem; border-radius: var(--radius-md); color: var(--color-danger-text); background: var(--color-danger-bg); font-size: var(--text-sm); }
  @media (max-width: 540px) {
    .posts-dialog { width: calc(100% - 1rem); max-height: calc(100dvh - 1rem); }
    header { padding: 1.1rem; }
    .dialog-body { padding: 1.1rem; }
    .post-row { gap: 0.65rem; padding: 0.7rem; flex-wrap: wrap; }
    .thumbnail { width: 52px; height: 52px; }
    .row-end { margin-left: auto; gap: 0.5rem; }
    .title-row { flex-direction: column; gap: 0.5rem; }
    .post-title { font-size: var(--text-xl); }
    .photos img { height: 110px; }
    .photos img:only-child { height: 180px; }
  }
</style>
