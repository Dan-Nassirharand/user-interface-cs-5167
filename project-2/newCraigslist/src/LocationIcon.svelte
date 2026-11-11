<script>
  let { name, size = 24, strokeWidth = 1.7 } = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width={strokeWidth}
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
  {#if name === 'housing' || name === 'home'}
    <path d="m3 10 9-7 9 7M5 9v11h14V9M9 20v-7h6v7" />
  {:else if name === 'jobs'}
    <rect x="3" y="7" width="18" height="14" rx="2" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12a24 24 0 0 0 18 0M12 11v3" />
  {:else if name === 'auto'}
    <path d="m5 8 1.5-4h11L19 8M5 8h14a2 2 0 0 1 2 2v7H3v-7a2 2 0 0 1 2-2ZM5 17v3M19 17v3M6 12h2M16 12h2" />
  {:else if name === 'services'}
    <path d="M14.5 6.5 18 3a6 6 0 0 0-7.6 7.6l-6.8 6.8a2.1 2.1 0 0 0 3 3l6.8-6.8A6 6 0 0 0 21 6l-3.5 3.5Z" />
  {:else if name === 'forums'}
    <path d="M14 15H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6M8 8h6" />
    <path d="M14 11h6a1 1 0 0 1 1 1v9l-3-3h-4a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1Z" />
  {:else if name === 'shopping'}
    <path d="M4 8h16l1 13H3L4 8ZM8 8V6a4 4 0 0 1 8 0v2" />
  {:else if name === 'community'}
    <circle cx="9" cy="7" r="3" />
    <path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 4v3" />
  {:else if name === 'gigs'}
    <path d="m13 2-9 12h7l-1 8 10-12h-7l1-8Z" />
  {:else if name === 'free'}
    <rect x="3" y="8" width="18" height="4" rx="1" />
    <path d="M5 12v9h14v-9M12 8v13" />
    <path d="M12 8H8a3 3 0 1 1 3-3l1 3ZM12 8h4a3 3 0 1 0-3-3l-1 3Z" />
  {:else if name === 'search'}
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="m16 16 5 5" />
  {:else if name === 'arrow-right'}
    <path d="M4 12h16m-6-6 6 6-6 6" />
  {:else if name === 'chevron-down'}
    <path d="m6 9 6 6 6-6" />
  {:else if name === 'chevron-right'}
    <path d="m9 5 7 7-7 7" />
  {:else if name === 'plus'}
    <path d="M12 5v14M5 12h14" />
  {:else if name === 'pin'}
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="2.5" />
  {:else if name === 'settings'}
    <path d="M12.22 2h-.44a2 2 0 0 0-2 1.72l-.12.92a2 2 0 0 1-1.18 1.52l-.28.16a2 2 0 0 1-1.9.18l-.85-.35a2 2 0 0 0-2.45.86l-.22.38a2 2 0 0 0 .45 2.56l.73.57a2 2 0 0 1 .72 1.81v.32a2 2 0 0 1-.72 1.81l-.73.57a2 2 0 0 0-.45 2.56l.22.38a2 2 0 0 0 2.45.86l.85-.35a2 2 0 0 1 1.9.18l.28.16a2 2 0 0 1 1.18 1.52l.12.92a2 2 0 0 0 2 1.72h.44a2 2 0 0 0 2-1.72l.12-.92a2 2 0 0 1 1.18-1.52l.28-.16a2 2 0 0 1 1.9-.18l.85.35a2 2 0 0 0 2.45-.86l.22-.38a2 2 0 0 0-.45-2.56l-.73-.57a2 2 0 0 1-.72-1.81v-.32a2 2 0 0 1 .72-1.81l.73-.57a2 2 0 0 0 .45-2.56l-.22-.38a2 2 0 0 0-2.45-.86l-.85.35a2 2 0 0 1-1.9-.18l-.28-.16a2 2 0 0 1-1.18-1.52l-.12-.92A2 2 0 0 0 12.22 2Z" />
    <circle cx="12" cy="12" r="3" />
  {:else if name === 'user'}
    <circle cx="12" cy="8" r="3.5" />
    <path d="M4.5 21v-2a7.5 7.5 0 0 1 15 0v2" />
  {:else if name === 'camera'}
    <path d="m8 5 1.5-2h5L16 5h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
    <circle cx="12" cy="13" r="4" />
  {:else if name === 'upload'}
    <path d="M12 16V3m-5 5 5-5 5 5M4 15v5h16v-5" />
  {:else if name === 'arrow-left'}
    <path d="M20 12H4m6-6-6 6 6 6" />
  {:else if name === 'trash'}
    <path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7" />
  {:else if name === 'image'}
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8" cy="8" r="1.5" />
    <path d="m21 15-5-5L5 21" />
  {:else if name === 'sun'}
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2m-3-7-1.5 1.5M6.5 17.5 5 19M5 5l1.5 1.5m11 11L19 19" />
  {:else if name === 'moon'}
    <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />
  {:else if name === 'arrow-up-right'}
    <path d="M6 18 18 6M6 6h12v12" />
  {:else if name === 'close'}
    <path d="m6 6 12 12M18 6 6 18" />
  {:else if name === 'check'}
    <path d="m5 12 4 4L19 6" />
  {:else if name === 'globe'}
    <circle cx="12" cy="12" r="9" />
    <ellipse cx="12" cy="12" rx="4" ry="9" />
    <path d="M3 12h18" />
  {:else if name === 'mail'}
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  {:else if name === 'info'}
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v6M12 7h.01" />
  {:else if name === 'heart'}
    <path d="M20.8 4.7a5.5 5.5 0 0 0-7.8 0L12 5.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.5a5.5 5.5 0 0 0 0-7.8Z" />
  {/if}
</svg>

<style>
  svg {
    display: inline-block;
    flex-shrink: 0;
    vertical-align: middle;
  }
</style>
