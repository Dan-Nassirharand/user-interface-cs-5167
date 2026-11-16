<script>
  import { untrack, tick } from 'svelte';
  import LocationIcon from './LocationIcon.svelte';

  let {
    open = false,
    categories = [],
    location = { id: 'cincinnati-oh', city: 'Cincinnati', state: 'OH' },
    profile = { username: '', email: '', phone: '' },
    onclose = () => {},
    onposted = () => {},
  } = $props();

  const DRAFT_KEY = 'craigslist-post-draft-v1';
  const POSTS_KEY = 'craigslist-local-posts-v1';
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  let dialog = $state(null);
  let categoryForm = $state(null);
  let detailsForm = $state(null);
  let step = $state(1);
  let categoryId = $state('');
  let subcategory = $state('');
  let sellerType = $state('owner');
  let title = $state('');
  let description = $state('');
  let price = $state('');
  let neighborhood = $state('');
  let postalCode = $state('');
  let condition = $state('');
  let email = $state('');
  let phone = $state('');
  let sharePhone = $state(false);
  let photos = $state([]);
  let postLocation = $state({ id: 'cincinnati-oh', city: 'Cincinnati', state: 'OH' });
  let error = $state('');
  let notice = $state('');
  let dirty = $state(false);
  let saving = $state(false);
  let processingPhotos = $state(false);
  let savedPost = $state(null);
  const selectedCategory = $derived(categories.find((category) => category.id === categoryId));
  const hasPrice = $derived(['housing', 'auto', 'shopping', 'services'].includes(categoryId));
  const hasCondition = $derived(['auto', 'shopping', 'free'].includes(categoryId));

  function changed() {
    dirty = true;
    error = '';
    notice = '';
  }

  function resetForm() {
    step = 1;
    categoryId = '';
    subcategory = '';
    sellerType = 'owner';
    title = '';
    description = '';
    price = '';
    neighborhood = '';
    postalCode = '';
    condition = '';
    email = profile.email || '';
    phone = profile.phone || '';
    sharePhone = false;
    photos = [];
    postLocation = { ...location };
    error = '';
    notice = '';
    dirty = false;
    saving = false;
    savedPost = null;
  }

  function restoreDraft() {
    resetForm();
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw);
      if (!draft || draft.version !== 1) {
        notice = 'An older draft could not be restored. Start a new post below.';
        return;
      }
      const category = categories.find((item) => item.id === draft.categoryId);
      categoryId = category?.id || '';
      subcategory = category?.subcategories.includes(draft.subcategory) ? draft.subcategory : '';
      sellerType = draft.sellerType === 'business' ? 'business' : 'owner';
      title = typeof draft.title === 'string' ? draft.title.slice(0, 100) : '';
      description = typeof draft.description === 'string' ? draft.description.slice(0, 6000) : '';
      price = draft.price === '' || draft.price == null ? '' : String(draft.price);
      neighborhood = typeof draft.neighborhood === 'string' ? draft.neighborhood.slice(0, 80) : '';
      postalCode = typeof draft.postalCode === 'string' ? draft.postalCode.slice(0, 10) : '';
      condition = ['new', 'like-new', 'good', 'fair', 'for-parts'].includes(draft.condition) ? draft.condition : '';
      email = typeof draft.email === 'string' ? draft.email.slice(0, 254) : email;
      phone = typeof draft.phone === 'string' ? draft.phone.slice(0, 25) : phone;
      sharePhone = draft.sharePhone === true;
      photos = Array.isArray(draft.photos) ? draft.photos.filter((photo) =>
        typeof photo?.src === 'string' && photo.src.startsWith('data:image/jpeg;base64,') && photo.src.length <= 220000
      ).slice(0, 4).map((photo) => ({ src: photo.src, name: String(photo.name || 'Photo').slice(0, 100) })) : [];
      if (draft.location?.id && draft.location?.city && draft.location?.state) postLocation = {
        id: String(draft.location.id).slice(0, 80),
        city: String(draft.location.city).slice(0, 80),
        state: String(draft.location.state).slice(0, 10),
      };
      // Resume at the category step so recovered fields can be checked before preview.
      notice = 'Your saved draft is ready to continue.';
    } catch {
      error = 'Your saved draft could not be read. You can still write a new post; saving needs browser storage.';
    }
  }

  $effect(() => {
    if (!dialog) return;
    if (open && !dialog.open) {
      untrack(restoreDraft);
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  });

  // Draft confirmations and validation errors stay visible even on the long details form.
  $effect(() => {
    const feedbackSelector = error ? '.feedback.error' : notice ? '.feedback.notice' : '';
    if (open && dialog && feedbackSelector) {
      tick().then(() => dialog?.querySelector(feedbackSelector)?.scrollIntoView({ block: 'nearest' }));
    }
  });

  function snapshot() {
    return {
      version: 1,
      categoryId,
      subcategory,
      sellerType,
      title: title.trim(),
      description: description.trim(),
      price: hasPrice && price != null ? String(price) : categoryId === 'free' ? '0' : '',
      neighborhood: neighborhood.trim(),
      postalCode: postalCode.trim(),
      condition: hasCondition ? condition : '',
      email: email.trim(),
      phone: phone.trim(),
      sharePhone,
      photos: photos.map((photo) => ({ ...photo })),
      location: { ...postLocation },
    };
  }

  function saveDraft() {
    if (processingPhotos || saving) return false;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(snapshot()));
      dirty = false;
      error = '';
      notice = 'Draft saved in this browser. Come back whenever you’re ready.';
      return true;
    } catch {
      error = 'The draft could not be saved. Browser storage may be full or unavailable. Try removing a photo, or choose “Close without saving”.';
      return false;
    }
  }

  function requestClose(event) {
    event?.preventDefault();
    if (processingPhotos || saving) {
      error = 'Please wait for the current photo or save to finish.';
      return;
    }
    if (!savedPost && dirty && !saveDraft()) return;
    onclose();
  }

  async function setStep(next) {
    step = next;
    error = '';
    await tick();
    dialog?.querySelector('.step-title')?.focus();
    dialog?.scrollTo({ top: 0 });
  }

  function chooseCategory(event) {
    event.preventDefault();
    if (!categoryForm.reportValidity()) return;
    setStep(2);
  }

  function previewPost(event) {
    event.preventDefault();
    if (!detailsForm.reportValidity()) return;
    if (title.trim().length < 4 || description.trim().length < 10) {
      error = 'Add a title of at least 4 characters and a description of at least 10 characters.';
      return;
    }
    if (hasPrice && price != null && price !== '' && (!Number.isFinite(Number(price)) || Number(price) < 0 || Number(price) > 999999999)) {
      error = 'Enter a price from $0 to $999,999,999, or leave it empty.';
      return;
    }
    const phoneDigits = phone.replace(/\D/g, '').length;
    if (sharePhone && (!/^[+0-9() .-]+$/.test(phone.trim()) || phoneDigits < 7 || phoneDigits > 15)) {
      error = 'Enter a phone number with 7–15 digits, or turn off the phone number option.';
      return;
    }
    if (processingPhotos) {
      error = 'Please wait for your photos to finish loading.';
      return;
    }
    setStep(3);
  }

  function readPhoto(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('This photo could not be read. Try another image.'));
      reader.onload = () => {
        const image = new Image();
        image.onerror = () => reject(new Error('This image could not be opened. Choose a JPG, PNG, or WebP photo.'));
        image.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const scale = Math.min(1, 1100 / Math.max(image.width, image.height));
            canvas.width = Math.max(1, Math.round(image.width * scale));
            canvas.height = Math.max(1, Math.round(image.height * scale));
            const context = canvas.getContext('2d');
            if (!context) throw new Error('Photo previews are not available in this browser.');
            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            let src = canvas.toDataURL('image/jpeg', 0.72);
            if (src.length > 210000) src = canvas.toDataURL('image/jpeg', 0.48);
            if (src.length > 210000) throw new Error('This photo is too detailed for local storage. Try a smaller image.');
            resolve({ name: file.name, src });
          } catch (cause) {
            reject(cause);
          }
        };
        image.src = String(reader.result);
      };
      reader.readAsDataURL(file);
    });
  }

  async function addPhotos(event) {
    const input = event.currentTarget;
    const files = Array.from(input.files || []);
    input.value = '';
    if (!files.length) return;
    if (files.length + photos.length > 4) {
      error = 'Choose up to four photos for this post.';
      return;
    }
    processingPhotos = true;
    error = '';
    try {
      const additions = [];
      for (const file of files) {
        if (!allowedTypes.includes(file.type)) throw new Error('Choose JPG, PNG, or WebP photos.');
        if (file.size > 5 * 1024 * 1024) throw new Error('Each original photo must be 5 MB or smaller.');
        additions.push(await readPhoto(file));
      }
      photos = [...photos, ...additions];
      changed();
    } catch (cause) {
      error = cause instanceof Error ? cause.message : 'The photos could not be added. Please try again.';
    } finally {
      processingPhotos = false;
    }
  }

  function removePhoto(index) {
    photos = photos.filter((_, photoIndex) => index !== photoIndex);
    changed();
  }

  async function savePost() {
    if (saving || savedPost) return;
    saving = true;
    error = '';
    let post;
    try {
      const raw = localStorage.getItem(POSTS_KEY);
      const stored = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(stored)) throw new Error('Existing local posts could not be read. Your draft is still available.');
      post = {
        ...snapshot(),
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        status: 'local',
        // A phone number is only included in the finished post when explicitly selected.
        phone: sharePhone ? phone.trim() : '',
      };
      const next = [post, ...stored].slice(0, 10);
      // Keep recent posts within a bounded browser-storage budget; oldest posts expire first.
      while (next.length > 1 && JSON.stringify(next).length > 1800000) next.pop();
      localStorage.setItem(POSTS_KEY, JSON.stringify(next));
    } catch (cause) {
      error = cause instanceof SyntaxError
        ? 'Existing local posts could not be read. Your post has not been saved. You can save a draft instead.'
        : 'Your post could not be saved. Browser storage may be full or unavailable. Try fewer photos or save a draft.';
      saving = false;
      return;
    }
    // The post write is complete before the draft is cleared or success is shown.
    try { localStorage.removeItem(DRAFT_KEY); } catch { /* A stale draft does not invalidate the saved post. */ }
    dirty = false;
    savedPost = post;
    saving = false;
    onposted(post);
    await tick();
    dialog?.querySelector('.success-state h3')?.focus();
    dialog?.scrollTo({ top: 0 });
  }

  function displayPrice() {
    if (categoryId === 'free') return 'Free';
    if (!hasPrice || price == null || price === '') return '';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(Number(price));
  }
</script>

<dialog bind:this={dialog} class="post-composer" aria-labelledby="composer-title" oncancel={requestClose} onclose={onclose}>
  <header class="composer-header">
    <div class="composer-brand"><span class="heading-icon"><LocationIcon name="plus" size={22} /></span><div><p class="eyebrow">A LITTLE MORE LOCAL</p><h2 id="composer-title">Create a post</h2></div></div>
    <button type="button" class="icon-button" onclick={requestClose} aria-label="Close post composer"><LocationIcon name="close" size={22} /></button>
  </header>

  {#if savedPost}
    <section class="success-state">
      <span class="success-icon"><LocationIcon name="check" size={28} /></span>
      <p class="eyebrow">ALL SET</p>
      <h3 tabindex="-1">Your post is saved.</h3>
      <p>Find <strong>{savedPost.title}</strong> in My posts.</p>
      <div class="saved-summary"><LocationIcon name="pin" size={18} /><span>{postLocation.city}, {postLocation.state} · {selectedCategory?.title}</span></div>
      <div class="success-actions"><button type="button" class="primary-button" onclick={requestClose}>Done <LocationIcon name="check" size={17} /></button></div>
    </section>
  {:else}
    <ol class="step-indicator" aria-label="Posting progress">
      {#each ['Category', 'Details', 'Preview'] as label, index}
        <li class:current={step === index + 1} class:complete={step > index + 1} aria-current={step === index + 1 ? 'step' : undefined}><span>{#if step > index + 1}<LocationIcon name="check" size={14} />{:else}{index + 1}{/if}</span>{label}</li>
      {/each}
    </ol>

    <div class="composer-body">
      <div class="posting-area"><LocationIcon name="pin" size={15} />Posting in <strong>{postLocation.city}, {postLocation.state}</strong></div>

      {#if notice}<p class="feedback notice" role="status">{notice}</p>{/if}
      {#if error}<p class="feedback error" role="alert">{error}</p>{/if}

      {#if step === 1}
        <h3 class="step-title" tabindex="-1">What would you like to post?</h3>
        <p class="step-description">Choose the category where people will look for it.</p>
        <form bind:this={categoryForm} onsubmit={chooseCategory}>
          <label for="post-category">Category <span>*</span></label>
          <select id="post-category" required bind:value={categoryId} onchange={() => { subcategory = ''; changed(); }}>
            <option value="" disabled>Select a category</option>
            {#each categories as category}<option value={category.id}>{category.title}</option>{/each}
          </select>
          <label for="post-subcategory">Subcategory <span>*</span></label>
          <select id="post-subcategory" required bind:value={subcategory} disabled={!selectedCategory} onchange={changed}>
            <option value="" disabled>Select a subcategory</option>
            {#each selectedCategory?.subcategories || [] as item}<option value={item}>{item}</option>{/each}
          </select>
          <fieldset class="seller-options">
            <legend>I’m posting as</legend>
            <label><input type="radio" name="seller-type" value="owner" bind:group={sellerType} onchange={changed} /><span>An individual<small>A neighbor, owner, or job seeker</small></span></label>
            <label><input type="radio" name="seller-type" value="business" bind:group={sellerType} onchange={changed} /><span>A business<small>A business, employer, or organization</small></span></label>
          </fieldset>
          <div class="step-actions"><button type="button" class="secondary-button" onclick={() => saveDraft()}>Save draft</button><button type="submit" class="primary-button">Continue <LocationIcon name="arrow-right" size={17} /></button></div>
        </form>
      {:else if step === 2}
        <h3 class="step-title" tabindex="-1">Tell people about it.</h3>
        <p class="step-description">A clear description and a few photos go a long way.</p>
        <form bind:this={detailsForm} onsubmit={previewPost}>
          <label for="post-title-input">Post title <span>*</span></label>
          <input id="post-title-input" placeholder="e.g. Solid oak desk in great condition" maxlength="100" minlength="4" required bind:value={title} oninput={changed} />
          <div class="field-help">Keep it clear and specific. {title.length}/100</div>
          <label for="post-description">Description <span>*</span></label>
          <textarea id="post-description" placeholder="Share the details someone would want to know…" rows="5" maxlength="6000" minlength="10" required bind:value={description} oninput={changed}></textarea>

          {#if hasPrice || hasCondition}
            <div class="two-columns">
              {#if hasPrice}<div><label for="post-price">Price <small>(optional)</small></label><div class="price-field"><span>$</span><input id="post-price" type="number" min="0" max="999999999" step="0.01" placeholder="0.00" bind:value={price} oninput={changed} /></div></div>{/if}
              {#if hasCondition}<div><label for="post-condition">Condition <small>(optional)</small></label><select id="post-condition" bind:value={condition} onchange={changed}><option value="">Choose condition</option><option value="new">New</option><option value="like-new">Like new</option><option value="good">Good</option><option value="fair">Fair</option><option value="for-parts">For parts</option></select></div>{/if}
            </div>
          {/if}

          <div class="two-columns"><div><label for="post-neighborhood">Neighborhood <small>(optional)</small></label><input id="post-neighborhood" placeholder="e.g. Clifton" maxlength="80" bind:value={neighborhood} oninput={changed} /></div><div><label for="post-postal">ZIP code <small>(optional)</small></label><input id="post-postal" inputmode="numeric" placeholder="45220" pattern={'[0-9]{5}(-[0-9]{4})?'} title="Enter a five-digit ZIP code or ZIP+4" maxlength="10" bind:value={postalCode} oninput={changed} /></div></div>

          <div class="photo-heading"><label for="post-photos">Photos <small>(optional)</small></label><span>{photos.length}/4</span></div>
          <p class="field-help photo-help">JPG, PNG, or WebP · up to 5 MB each.</p>
          <div class="photo-grid">
            {#each photos as photo, index}<div class="photo-preview"><img src={photo.src} alt={`Post photo ${index + 1}: ${photo.name}`} /><button type="button" class="remove-photo" onclick={() => removePhoto(index)} disabled={processingPhotos} aria-label={`Remove photo ${index + 1}`}><LocationIcon name="close" size={15} /></button>{#if index === 0}<span>Cover</span>{/if}</div>{/each}
            {#if photos.length < 4}<label class="photo-upload" class:busy={processingPhotos} for="post-photos"><LocationIcon name="camera" size={25} /><span>{processingPhotos ? 'Loading…' : 'Add photos'}</span><input id="post-photos" type="file" accept="image/jpeg,image/png,image/webp" multiple onchange={addPhotos} disabled={processingPhotos} /></label>{/if}
          </div>

          <div class="reply-section"><h4>How can people reach you?</h4><p>Your contact information is included only in your local preview.</p><label for="post-email">Reply email <span>*</span></label><input id="post-email" type="email" autocomplete="email" placeholder="you@example.com" maxlength="254" required bind:value={email} oninput={changed} /><label class="checkbox-label"><input type="checkbox" bind:checked={sharePhone} onchange={changed} /><span>Also include a phone number</span></label>{#if sharePhone}<label for="post-phone">Phone number <span>*</span></label><input id="post-phone" type="tel" autocomplete="tel" placeholder="(555) 123-4567" title="Enter a phone number with 7 to 15 digits" minlength="7" maxlength="25" required bind:value={phone} oninput={changed} />{/if}</div>
          <div class="step-actions"><button type="button" class="text-button" onclick={() => setStep(1)}><LocationIcon name="arrow-left" size={16} /> Back</button><div><button type="button" class="secondary-button" onclick={() => saveDraft()} disabled={processingPhotos}>Save draft</button><button type="submit" class="primary-button" disabled={processingPhotos}>Preview <LocationIcon name="arrow-right" size={17} /></button></div></div>
        </form>
      {:else}
        <h3 class="step-title" tabindex="-1">Looking good?</h3>
        <p class="step-description">Give your post one last look before saving it locally.</p>
        <article class="post-preview" aria-label="Post preview">
          <div class="preview-category">{selectedCategory?.title} <LocationIcon name="chevron-right" size={13} />{subcategory}</div>
          <div class="preview-title"><h4>{title.trim()}</h4>{#if displayPrice()}<strong>{displayPrice()}</strong>{/if}</div>
          <p class="preview-location"><LocationIcon name="pin" size={15} />{[neighborhood.trim(), `${postLocation.city}, ${postLocation.state}`, postalCode.trim()].filter(Boolean).join(' · ')}</p>
          {#if photos.length}<div class="preview-photos">{#each photos as photo, index}<img src={photo.src} alt={`Post photo ${index + 1}`} />{/each}</div>{/if}
          <p class="preview-description">{description.trim()}</p>
          <dl><div><dt>Posted by</dt><dd>{sellerType === 'business' ? 'Business / organization' : 'Individual'}</dd></div>{#if hasCondition && condition}<div><dt>Condition</dt><dd>{condition.replaceAll('-', ' ')}</dd></div>{/if}<div><dt>Reply email</dt><dd>{email.trim()}</dd></div>{#if sharePhone}<div><dt>Phone</dt><dd>{phone.trim()}</dd></div>{/if}</dl>
        </article>
        <div class="step-actions"><button type="button" class="text-button" onclick={() => setStep(2)} disabled={saving}><LocationIcon name="arrow-left" size={16} /> Edit details</button><button type="button" class="primary-button" onclick={savePost} disabled={saving}>{saving ? 'Saving…' : 'Save post locally'} <LocationIcon name="check" size={17} /></button></div>
      {/if}
    </div>

    {#if error}<footer class="composer-footer"><button type="button" onclick={() => onclose()} disabled={processingPhotos || saving}>Close without saving</button></footer>{/if}
  {/if}
</dialog>

<style>
  .post-composer { --post-action: color-mix(in srgb, var(--color-primary) 78%, black); width: min(700px, calc(100% - 2rem)); max-height: calc(100dvh - 3rem); padding: 0; color: var(--text-primary); background: var(--bg-surface); border: 1px solid var(--border-default); border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); }
  .post-composer::backdrop { background: color-mix(in srgb, var(--text-primary) 40%, transparent); backdrop-filter: blur(3px); }
  button, input, select, textarea { font: inherit; }
  button { cursor: pointer; }
  button:disabled { opacity: 0.55; cursor: wait; }
  button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible, .photo-upload:focus-within { outline: 3px solid var(--color-accent); outline-offset: 3px; }
  h2, h3, h4, p { margin: 0; }
  .composer-header { padding: 1.5rem 1.75rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; border-bottom: 1px solid var(--border-subtle); }
  .composer-brand { display: flex; align-items: center; gap: 0.8rem; }
  .heading-icon { width: 42px; height: 42px; display: grid; place-items: center; border-radius: var(--radius-lg); background: var(--color-primary-light); color: var(--color-primary); }
  .eyebrow { color: var(--text-secondary); font-size: 0.6rem; letter-spacing: 0.12em; font-weight: var(--weight-semibold); }
  .composer-header h2 { font-size: var(--text-xl); font-weight: var(--weight-semibold); letter-spacing: -0.025em; margin-top: 0.15rem; }
  .icon-button { width: 34px; height: 34px; display: grid; place-items: center; padding: 0; background: transparent; color: var(--text-secondary); border: 0; border-radius: var(--radius-md); }
  .icon-button:hover { color: var(--text-primary); background: var(--bg-tertiary); }
  .step-indicator { display: flex; list-style: none; padding: 1.2rem 1.75rem; margin: 0; border-bottom: 1px solid var(--border-subtle); gap: 1.8rem; background: var(--bg-secondary); }
  .step-indicator li { display: flex; align-items: center; gap: 0.5rem; color: var(--text-secondary); font-size: var(--text-xs); }
  .step-indicator li > span { width: 25px; height: 25px; display: grid; place-items: center; border: 1px solid var(--border-default); border-radius: 50%; font-size: 0.7rem; }
  .step-indicator li.current { color: var(--color-primary); font-weight: var(--weight-semibold); }
  .step-indicator li.current > span { border-color: var(--color-primary); background: var(--color-primary-light); }
  .step-indicator li.complete > span { background: var(--post-action); border-color: var(--post-action); color: var(--color-primary-contrast); }
  .composer-body { padding: 1.5rem 1.75rem; }
  .posting-area { display: flex; align-items: center; gap: 0.4rem; color: var(--text-secondary); font-size: var(--text-xs); margin-bottom: 1.3rem; flex-wrap: wrap; }
  .posting-area strong { color: var(--text-primary); font-weight: var(--weight-medium); }
  .step-title { font-size: var(--text-2xl); font-weight: var(--weight-semibold); line-height: var(--leading-tight); letter-spacing: -0.035em; outline: none; }
  .step-description { margin-top: 0.4rem; margin-bottom: 1.5rem; color: var(--text-secondary); font-size: var(--text-sm); }
  form > label, .two-columns label, .reply-section > label:not(.checkbox-label), .photo-heading > label { display: block; margin: 1.1rem 0 0.4rem; font-size: var(--text-sm); font-weight: var(--weight-medium); }
  form > label:first-child { margin-top: 0; }
  label > span:not(.seller-options span), label > small { color: var(--text-secondary); }
  label small { font-weight: var(--weight-regular); font-size: var(--text-xs); }
  input:not([type='radio']):not([type='checkbox']):not([type='file']), select, textarea { display: block; width: 100%; min-width: 0; padding: 0.7rem 0.8rem; border: 1px solid var(--border-default); border-radius: var(--radius-md); color: var(--text-primary); background: var(--bg-primary); font-size: var(--text-sm); }
  input::placeholder, textarea::placeholder { color: var(--text-secondary); opacity: 0.8; }
  select:disabled { opacity: 0.6; }
  textarea { resize: vertical; min-height: 130px; }
  .field-help { font-size: 0.7rem; color: var(--text-secondary); margin-top: 0.35rem; }
  .two-columns { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
  .price-field { display: flex; align-items: center; border: 1px solid var(--border-default); border-radius: var(--radius-md); padding-left: 0.8rem; background: var(--bg-primary); color: var(--text-secondary); }
  .price-field input { border: 0 !important; }
  .price-field:focus-within { outline: 3px solid var(--color-accent); outline-offset: 3px; }
  .price-field input:focus { outline: none; box-shadow: none; }
  .seller-options { padding: 0; margin: 1.4rem 0 0; border: 0; display: grid; gap: 0.65rem; }
  .seller-options legend { margin-bottom: 0.65rem; font-size: var(--text-sm); font-weight: var(--weight-medium); }
  .seller-options label { display: flex; align-items: center; gap: 0.7rem; padding: 0.8rem; border: 1px solid var(--border-subtle); border-radius: var(--radius-md); background: var(--bg-secondary); cursor: pointer; }
  .seller-options label:has(input:checked) { border-color: var(--color-primary); background: var(--color-primary-light); }
  .seller-options span { display: grid; gap: 0.1rem; color: var(--text-primary); font-size: var(--text-sm); }
  .seller-options small { font-size: 0.7rem; color: var(--text-secondary); }
  input[type='radio'], input[type='checkbox'] { width: 16px; height: 16px; accent-color: var(--post-action); flex-shrink: 0; }
  .photo-heading { display: flex; align-items: center; justify-content: space-between; margin-top: 1.1rem; }
  .photo-heading > label { margin: 0; }
  .photo-heading > span { font-size: var(--text-xs); color: var(--text-secondary); }
  .photo-help { margin-bottom: 0.7rem; }
  .photo-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.65rem; }
  .photo-preview { position: relative; aspect-ratio: 1; border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border-subtle); }
  .photo-preview img { width: 100%; height: 100%; object-fit: cover; }
  .photo-preview > span { position: absolute; left: 0.35rem; bottom: 0.35rem; border-radius: var(--radius-sm); background: var(--bg-surface); color: var(--text-primary); padding: 0.1rem 0.35rem; font-size: 0.6rem; }
  .remove-photo { position: absolute; right: 0.25rem; top: 0.25rem; width: 25px; height: 25px; padding: 0; display: grid; place-items: center; background: var(--bg-surface); color: var(--text-primary); border: 1px solid var(--border-default); border-radius: 50%; }
  .photo-upload { min-height: 100px; aspect-ratio: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; background: var(--bg-secondary); color: var(--color-primary); border: 1px dashed var(--border-strong); border-radius: var(--radius-md); position: relative; cursor: pointer; }
  .photo-upload > span { font-size: 0.7rem; color: var(--color-primary); }
  .photo-upload input { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
  .photo-upload.busy { opacity: 0.55; }
  .photo-upload:focus-within { outline: 3px solid var(--color-accent); outline-offset: 3px; }
  .reply-section { border-top: 1px solid var(--border-subtle); margin-top: 1.5rem; padding-top: 1.3rem; }
  .reply-section h4 { font-size: var(--text-sm); font-weight: var(--weight-semibold); }
  .reply-section > p { color: var(--text-secondary); font-size: 0.7rem; margin-top: 0.3rem; }
  .checkbox-label { display: flex; align-items: center; gap: 0.55rem; margin-top: 1rem; font-size: var(--text-xs); cursor: pointer; }
  .step-actions { margin-top: 1.7rem; padding-top: 1.3rem; border-top: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
  .step-actions > div { display: flex; gap: 0.6rem; }
  .primary-button, .secondary-button, .text-button { display: inline-flex; align-items: center; justify-content: center; gap: 0.6rem; padding: 0.7rem 1rem; border: 1px solid transparent; border-radius: var(--radius-md); font-size: var(--text-xs); font-weight: var(--weight-semibold); }
  .primary-button { color: var(--color-primary-contrast); background: var(--post-action); }
  .primary-button:hover { background: color-mix(in srgb, var(--color-primary) 68%, black); }
  .secondary-button { background: var(--bg-surface); color: var(--text-primary); border-color: var(--border-default); }
  .secondary-button:hover { background: var(--bg-tertiary); }
  .text-button { color: var(--text-secondary); background: transparent; padding-left: 0; }
  .text-button:hover { color: var(--color-primary); }
  .feedback { padding: 0.8rem 0.9rem; border-radius: var(--radius-md); font-size: var(--text-xs); line-height: var(--leading-relaxed); margin-bottom: 1.3rem; }
  .notice { color: var(--color-info-text); background: var(--color-info-bg); }
  .error { color: var(--color-danger-text); background: var(--color-danger-bg); }
  .composer-footer { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.7rem; padding: 1rem 1.75rem; border-top: 1px solid var(--border-subtle); color: var(--text-secondary); background: var(--bg-secondary); font-size: 0.65rem; }
  .composer-footer button { background: transparent; color: var(--color-danger-text); border: 0; padding: 0; font-size: 0.7rem; text-decoration: underline; }
  .post-preview { border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 1.25rem; }
  .preview-category { display: flex; align-items: center; flex-wrap: wrap; gap: 0.4rem; font-size: 0.65rem; color: var(--text-secondary); }
  .preview-title { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-top: 0.8rem; }
  .preview-title h4 { font-size: var(--text-xl); font-weight: var(--weight-semibold); line-height: var(--leading-tight); overflow-wrap: anywhere; }
  .preview-title strong { color: var(--color-primary); font-size: var(--text-lg); white-space: nowrap; }
  .preview-location { display: flex; align-items: center; gap: 0.35rem; margin-top: 0.6rem; color: var(--text-secondary); font-size: 0.7rem; }
  .preview-photos { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.6rem; margin-top: 1.2rem; }
  .preview-photos img { width: 100%; height: 155px; object-fit: cover; border-radius: var(--radius-md); }
  .preview-photos img:only-child { grid-column: 1 / -1; height: 240px; }
  .preview-description { white-space: pre-wrap; overflow-wrap: anywhere; font-size: var(--text-sm); line-height: var(--leading-relaxed); margin-top: 1.2rem; }
  dl { border-top: 1px solid var(--border-subtle); padding-top: 0.7rem; margin: 1.2rem 0 0; display: grid; gap: 0.4rem; font-size: var(--text-xs); }
  dl > div { display: flex; gap: 1rem; }
  dt { color: var(--text-secondary); width: 90px; flex-shrink: 0; }
  dd { margin: 0; overflow-wrap: anywhere; }
  .success-state { padding: 2.5rem 2rem; text-align: center; }
  .success-icon { width: 60px; height: 60px; margin: 0 auto 1.25rem; border-radius: 50%; display: grid; place-items: center; background: var(--color-success-bg); color: var(--color-success-text); }
  .success-state h3 { margin: 0.5rem 0 0.8rem; font-size: var(--text-3xl); line-height: var(--leading-tight); letter-spacing: -0.04em; }
  .success-state > p:not(.eyebrow) { color: var(--text-secondary); font-size: var(--text-sm); line-height: var(--leading-relaxed); max-width: 430px; margin-left: auto; margin-right: auto; overflow-wrap: anywhere; }
  .saved-summary { display: inline-flex; align-items: center; gap: 0.4rem; margin: 1.1rem 0; color: var(--text-secondary); font-size: var(--text-xs); }
  .success-actions { display: flex; justify-content: center; }
  .success-state .primary-button { margin-top: 0.6rem; min-width: 130px; }
  @media (max-width: 540px) {
    .post-composer { width: calc(100% - 1rem); max-height: calc(100dvh - 1rem); }
    .composer-header { padding: 1.1rem; }
    .step-indicator { padding: 1rem 1.1rem; gap: 1rem; justify-content: space-between; }
    .step-indicator li { gap: 0.35rem; font-size: 0.65rem; }
    .composer-body { padding: 1.2rem 1.1rem; }
    .step-title { font-size: var(--text-xl); }
    .step-description { font-size: var(--text-xs); }
    .two-columns { grid-template-columns: 1fr; gap: 0; }
    .photo-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .step-actions { gap: 0.5rem; }
    .step-actions > div { gap: 0.35rem; }
    .primary-button, .secondary-button, .text-button { padding: 0.65rem 0.7rem; font-size: 0.7rem; gap: 0.4rem; }
    .composer-footer { padding: 0.9rem 1.1rem; }
    .preview-title { flex-direction: column; gap: 0.5rem; }
    .preview-photos img { height: 110px; }
    .preview-photos img:only-child { height: 180px; }
    .success-state { padding: 2rem 1.2rem; }
  }
</style>
