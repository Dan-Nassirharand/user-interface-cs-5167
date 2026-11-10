<script>
  import HomeBackground from './HomeBackground.svelte';
  import Title from './Title.svelte';
  import SearchBar from './SearchBar.svelte';
  import WordCard from './WordCard.svelte';
  import DictionaryWordCard from './DictionaryWordCard.svelte';
  import ThemeToggle from './ThemeToggle.svelte';
</script>

<HomeBackground />
<ThemeToggle />

<main>
  <div class="header">
    <Title showLogo={true}/>
    <div class="words">
      
      <WordCard word="Find." description="Find housing, jobs, listings, events, and more in your area." color="var(--color-accent)" />
      <WordCard word="Shop." description="Shop everything that craigslist users are selling." color="var(--color-primary)" />
      <WordCard word="List." description="List items, services, and more to users in your area." color="var(--color-sage)" />
     
      <!-- <DictionaryWordCard word="Find." pronunciation="/faɪnd/" partOfSpeech="verb" description="Find housing, jobs, listings, events, and more in your area." color="var(--color-accent)" />
      <DictionaryWordCard word="Shop." pronunciation="/ʃɑp/" partOfSpeech="verb" description="Shop everything that craigslist users are selling." color="var(--color-primary)" />
      <DictionaryWordCard word="List." pronunciation="/lɪst/" partOfSpeech="verb" description="List items, services, and more to users in your area." color="var(--color-sage)" /> -->
    </div>
  </div>
  <SearchBar />
</main>

<style>
  main {
    position: fixed;
    inset: 0;
    /* Equal top and bottom rows put the middle row (the search bar) at the exact center */
    display: grid;
    grid-template-rows: 1fr auto 1fr;
    justify-items: center;
    row-gap: 1.5rem;
    /* Nudge everything slightly below center */
    translate: 0 1.5rem;
  }

  .header {
    align-self: end;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .words {
    display: flex;
    gap: 1.5rem;
  }
</style>
