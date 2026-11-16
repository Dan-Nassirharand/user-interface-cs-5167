<script>
  import HomeBackground from './HomeBackground.svelte';
  import Title from './Title.svelte';
  import SearchBar from './SearchBar.svelte';
  import WordCard from './WordCard.svelte';
  import Suggestion from './Suggestion.svelte';
  import WordCardWrapper from './WordCardWrapper.svelte';

  let { onsearch } = $props();
</script>

<HomeBackground />
<main>
  <div class="header">
    <Title showLogo={true}/>
    <div class="words">
      
      <WordCardWrapper word="Find." isStandard ={true} description="Find housing, jobs, listings, events, and more in your area." color="var(--color-accent)" 
        pronunciation = "/faɪnd/"
        partOfSpeech = "verb"/>
      <WordCardWrapper word="Shop." isStandard ={true} description="Shop everything that craigslist users are selling." color="var(--color-primary)"
        pronunciation = "/ʃɑp/"
        partOfSpeech = "verb"/>
      <WordCardWrapper word="List." isStandard ={true} description="List items, services, and more to users in your area." color="var(--color-sage)"
        pronunciation = "/lɪst/"
        partOfSpeech = "verb"/>
    </div>
  </div>
  <SearchBar {onsearch} />
  <Suggestion/>
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
    padding: 1rem;
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

  @media (max-width: 600px) {
    .words { flex-wrap: wrap; justify-content: center; gap: 0.75rem; }
  }
</style>
