<script>
  import { untrack, tick } from 'svelte';
  import LocationIcon from './LocationIcon.svelte';

  let {
    open = false,
    profile = { username: '', email: '', phone: '', avatar: '', favoriteLocation: 'cincinnati-oh' },
    locations = [],
    dark = false,
    onsave = () => {},
    onclose = () => {},
    onthemechange = () => {},
  } = $props();

  let dialog = $state(null);
  let photoInput = $state(null);
  let username = $state('');
  let email = $state('');
  let phone = $state('');
  let avatar = $state('');
  let favoriteLocation = $state('cincinnati-oh');
  let photoError = $state('');
  let formError = $state('');
  let loadingPhoto = $state(false);
  let saving = $state(false);
  let photoVersion = 0;

  $effect(() => {
    if (!dialog) return;
    if (open) {
      // Opening starts a fresh draft. Updates elsewhere do not overwrite edits.
      untrack(() => {
        username = profile.username ?? '';
        email = profile.email ?? '';
        phone = profile.phone ?? '';
        avatar = profile.avatar ?? '';
        favoriteLocation = profile.favoriteLocation ?? locations[0]?.id ?? 'cincinnati-oh';
        photoError = '';
        formError = '';
        loadingPhoto = false;
        saving = false;
        photoVersion += 1;
      });
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  });

  function dismiss() {
    photoVersion += 1;
    onclose();
  }

  $effect(() => {
    const selector = formError ? '.form-error' : photoError ? '.photo-error' : '';
    if (open && dialog && selector) {
      tick().then(() => dialog?.querySelector(selector)?.scrollIntoView({ block: 'nearest' }));
    }
  });

  function readPhoto(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('This photo could not be read. Please choose another image.'));
      reader.readAsDataURL(file);
    });
  }

  async function changePhoto(event) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    const version = ++photoVersion;
    photoError = '';
    input.value = '';

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      photoError = 'Choose a JPG, PNG, WebP, or GIF image.';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      photoError = 'Choose an image smaller than 2 MB.';
      return;
    }

    loadingPhoto = true;
    try {
      const dataUrl = await readPhoto(file);
      const image = new Image();
      image.src = dataUrl;
      await image.decode();
      if (!image.naturalWidth || !image.naturalHeight) throw new Error('Choose a valid image.');
      // Save a small square thumbnail so local settings leave room for posts.
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Photo editing is unavailable.');
      const crop = Math.min(image.naturalWidth, image.naturalHeight);
      context.drawImage(image, (image.naturalWidth - crop) / 2, (image.naturalHeight - crop) / 2, crop, crop, 0, 0, 256, 256);
      if (version === photoVersion) avatar = canvas.toDataURL('image/webp', 0.85);
    } catch {
      if (version === photoVersion) photoError = 'This image could not be opened. Please choose another photo.';
    } finally {
      if (version === photoVersion) loadingPhoto = false;
    }
  }

  function removePhoto() {
    photoVersion += 1;
    avatar = '';
    photoError = '';
    loadingPhoto = false;
    if (photoInput) photoInput.value = '';
  }

  async function save(event) {
    event.preventDefault();
    formError = '';
    const nextUsername = username.trim();
    const nextEmail = email.trim();
    const nextPhone = phone.trim();

    if (nextUsername && nextUsername.length < 2) {
      formError = 'Enter a username with at least 2 characters.';
      return;
    }
    const phoneDigits = nextPhone.replace(/\D/g, '').length;
    if (nextPhone && (!/^[+0-9() .-]+$/.test(nextPhone) || phoneDigits < 7 || phoneDigits > 15)) {
      formError = 'Enter a phone number with 7–15 digits. Spaces, +, parentheses, and dashes are welcome.';
      return;
    }
    if (!locations.some((item) => item.id === favoriteLocation)) {
      formError = 'Choose an available favorite location.';
      return;
    }

    saving = true;
    try {
      await onsave({ username: nextUsername, email: nextEmail, phone: nextPhone, avatar, favoriteLocation });
      onclose();
    } catch (error) {
      formError = error instanceof Error ? error.message : 'Your settings could not be saved. Please try again.';
    } finally {
      saving = false;
    }
  }
</script>

<dialog bind:this={dialog} class="settings-dialog" aria-labelledby="settings-title" aria-describedby="settings-description" onclose={dismiss}>
  <form onsubmit={save}>
    <header class="dialog-header">
      <div class="header-copy">
        <span class="header-icon"><LocationIcon name="settings" size={23} /></span>
        <div><h2 id="settings-title">Your settings</h2><p id="settings-description">Make yourself at home.</p></div>
      </div>
      <button class="icon-button" type="button" onclick={dismiss} aria-label="Close settings"><LocationIcon name="close" size={21} /></button>
    </header>

    <div class="dialog-body">
      <section class="photo-section" aria-labelledby="photo-title">
        <div class="avatar-preview">
          {#if avatar}<img src={avatar} alt="Your profile preview" />{:else}<LocationIcon name="user" size={34} />{/if}
        </div>
        <div class="photo-copy">
          <h3 id="photo-title">Profile photo</h3>
          <p>A familiar face for your local connections.</p>
          <div class="photo-actions">
            <button class="secondary-button photo-button" type="button" onclick={() => photoInput.click()} disabled={loadingPhoto}><LocationIcon name="camera" size={16} />{loadingPhoto ? 'Opening photo…' : 'Change photo'}</button>
            {#if avatar}<button class="text-button" type="button" onclick={removePhoto}>Remove</button>{/if}
          </div>
          <small>JPG, PNG, WebP, or GIF · up to 2 MB</small>
        </div>
        <input bind:this={photoInput} class="file-input" type="file" accept="image/jpeg,image/png,image/webp,image/gif" aria-label="Choose profile photo" onchange={changePhoto} />
      </section>
      {#if photoError}<p class="error-message photo-error" role="alert">{photoError}</p>{/if}

      <section class="settings-section" aria-labelledby="account-title">
        <div class="section-title"><h3 id="account-title">Account details</h3><p>Add the details you’re comfortable sharing.</p></div>
        <div class="field-grid">
          <label class="field">Username <span class="optional">Optional</span><input type="text" autocomplete="username" bind:value={username} minlength="2" maxlength="40" placeholder="Your username" /></label>
          <label class="field">Email address <span class="optional">Optional</span><input type="email" autocomplete="email" bind:value={email} maxlength="254" placeholder="you@example.com" /></label>
          <label class="field full-width">Phone number <span class="optional">Optional</span><input type="tel" autocomplete="tel" bind:value={phone} maxlength="25" placeholder="(555) 123-4567" /><small>Use a number where you’re comfortable being contacted.</small></label>
        </div>
      </section>

      <section class="settings-section" aria-labelledby="preferences-title">
        <div class="section-title"><h3 id="preferences-title">Your preferences</h3><p>A few things to make craigslist yours.</p></div>
        <label class="field">Favorite location<select bind:value={favoriteLocation}>{#each locations as item}<option value={item.id}>{item.city}, {item.state}</option>{/each}</select><small>Your preferred starting point for local browsing.</small></label>
        <div class="theme-row">
          <div><strong id="settings-dark-label">Dark mode</strong><p>Switch to a softer look for evening browsing.</p></div>
          <button class="theme-switch" class:checked={dark} type="button" role="switch" aria-checked={dark} aria-labelledby="settings-dark-label" onclick={() => onthemechange(!dark)}><span></span></button>
        </div>
      </section>

      {#if formError}<p class="error-message form-error" role="alert">{formError}</p>{/if}
    </div>

    <footer class="dialog-footer">
      <button class="secondary-button" type="button" onclick={dismiss}>Cancel</button>
      <button class="primary-button" type="submit" disabled={loadingPhoto || saving}><LocationIcon name="check" size={17} />{saving ? 'Saving…' : 'Save changes'}</button>
    </footer>
  </form>
</dialog>

<style>
  .settings-dialog {
    --settings-action: color-mix(in srgb, var(--color-primary) 78%, black);
    width: min(660px, calc(100% - 2rem));
    max-height: calc(100dvh - 2rem);
    margin: auto;
    padding: 0;
    border: 1px solid var(--border-default);
    border-radius: var(--radius-xl);
    color: var(--text-primary);
    background: var(--bg-surface);
    box-shadow: var(--shadow-lg);
  }
  .settings-dialog::backdrop { background: color-mix(in srgb, var(--text-primary) 40%, transparent); backdrop-filter: blur(3px); }
  button, input, select { font: inherit; }
  button { cursor: pointer; }
  button:disabled { cursor: wait; opacity: 0.65; }
  button:focus-visible, input:focus-visible, select:focus-visible { outline: 3px solid var(--color-accent); outline-offset: 3px; }
  h2, h3, p { margin: 0; }
  .dialog-header, .header-copy, .dialog-footer { display: flex; align-items: center; }
  .dialog-header { justify-content: space-between; gap: 1rem; padding: 1.4rem 1.6rem; border-bottom: 1px solid var(--border-subtle); background: var(--bg-surface); }
  .header-copy { gap: 0.85rem; }
  .header-icon { display: grid; place-items: center; width: 43px; height: 43px; border-radius: var(--radius-lg); color: var(--color-primary); background: var(--color-primary-light); }
  h2 { font-size: var(--text-xl); line-height: var(--leading-tight); letter-spacing: -0.025em; }
  .dialog-header p { color: var(--text-secondary); font-size: var(--text-xs); margin-top: 0.25rem; }
  .icon-button { display: grid; place-items: center; width: 34px; height: 34px; padding: 0; border: 0; border-radius: var(--radius-md); color: var(--text-secondary); background: transparent; flex-shrink: 0; }
  .icon-button:hover { background: var(--bg-tertiary); color: var(--text-primary); }
  .dialog-body { padding: 1.5rem 1.6rem; }
  .photo-section { display: flex; align-items: center; gap: 1.1rem; }
  .avatar-preview { display: grid; place-items: center; width: 82px; height: 82px; flex-shrink: 0; overflow: hidden; border: 1px solid var(--border-subtle); border-radius: 50%; color: var(--color-primary); background: var(--color-primary-light); }
  .avatar-preview img { display: block; width: 100%; height: 100%; object-fit: cover; }
  h3 { font-size: var(--text-sm); font-weight: var(--weight-semibold); }
  .photo-copy > p, .section-title > p, .theme-row p { font-size: var(--text-xs); color: var(--text-secondary); margin-top: 0.3rem; }
  .photo-actions { display: flex; align-items: center; gap: 0.8rem; margin: 0.7rem 0 0.3rem; flex-wrap: wrap; }
  .photo-copy > small, .field > small { color: var(--text-secondary); font-size: 0.65rem; font-weight: var(--weight-regular); }
  .file-input { display: none; }
  .primary-button, .secondary-button { display: inline-flex; justify-content: center; align-items: center; gap: 0.5rem; padding: 0.65rem 1rem; border-radius: var(--radius-md); font-size: var(--text-sm); font-weight: var(--weight-medium); line-height: var(--leading-normal); }
  .primary-button { border: 1px solid transparent; color: var(--color-primary-contrast); background: var(--settings-action); }
  .primary-button:hover { background: color-mix(in srgb, var(--color-primary) 68%, black); }
  .secondary-button { border: 1px solid var(--border-default); color: var(--text-primary); background: var(--bg-surface); }
  .secondary-button:hover { background: var(--bg-tertiary); }
  .photo-button { padding: 0.4rem 0.65rem; font-size: var(--text-xs); }
  .text-button { border: 0; padding: 0.25rem 0; color: var(--text-secondary); background: transparent; font-size: var(--text-xs); }
  .text-button:hover { color: var(--color-primary); text-decoration: underline; }
  .settings-section { margin-top: 1.5rem; padding-top: 1.3rem; border-top: 1px solid var(--border-subtle); }
  .section-title { margin-bottom: 1rem; }
  .field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .field { display: flex; flex-direction: column; gap: 0.4rem; position: relative; min-width: 0; font-size: var(--text-xs); font-weight: var(--weight-medium); }
  .full-width { grid-column: 1 / -1; }
  .optional { position: absolute; right: 0; top: 0; font-size: 0.65rem; color: var(--text-secondary); font-weight: var(--weight-regular); }
  input, select { width: 100%; min-width: 0; padding: 0.65rem 0.75rem; border: 1px solid var(--border-default); border-radius: var(--radius-md); background: var(--bg-primary); color: var(--text-primary); font-size: var(--text-sm); }
  input::placeholder { color: var(--text-secondary); }
  select { cursor: pointer; }
  .theme-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding-top: 1.25rem; }
  .theme-row strong { font-size: var(--text-xs); font-weight: var(--weight-medium); }
  .theme-switch { display: inline-flex; align-items: center; width: 43px; height: 25px; padding: 3px; border: 1px solid var(--border-default); border-radius: var(--radius-full); background: var(--bg-tertiary); flex-shrink: 0; }
  .theme-switch > span { width: 17px; height: 17px; border-radius: 50%; background: var(--text-secondary); transition: var(--theme-transition), transform var(--transition-fast); }
  .theme-switch.checked { background: var(--settings-action); border-color: var(--settings-action); }
  .theme-switch.checked > span { transform: translateX(17px); background: var(--color-primary-contrast); }
  .error-message { color: var(--color-danger-text); background: var(--color-danger-bg); border-radius: var(--radius-md); padding: 0.65rem 0.8rem; margin-top: 0.85rem; font-size: var(--text-xs); scroll-margin-bottom: 5.5rem; }
  .dialog-footer { justify-content: flex-end; gap: 0.65rem; padding: 1rem 1.6rem; border-top: 1px solid var(--border-subtle); background: var(--bg-surface); position: sticky; bottom: 0; }
  @media (max-width: 540px) {
    .settings-dialog { width: calc(100% - 1rem); max-height: calc(100dvh - 1rem); }
    .dialog-header { padding: 1.1rem; }
    .dialog-body { padding: 1.2rem 1.1rem; }
    .dialog-footer { padding: 0.85rem 1.1rem; }
    .header-icon { width: 38px; height: 38px; }
    .photo-section { align-items: flex-start; gap: 0.85rem; }
    .avatar-preview { width: 64px; height: 64px; }
    .photo-copy > p { max-width: 210px; }
    .field-grid { grid-template-columns: 1fr; }
    .theme-row p { max-width: 230px; }
    input, select { font-size: var(--text-base); }
  }
  @media (prefers-reduced-motion: reduce) { .theme-switch > span { transition: none; } }
</style>
