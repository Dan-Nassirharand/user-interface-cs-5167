<script>
  import HomeBackground from './HomeBackground.svelte';
  import Title from './Title.svelte';
  import SearchBar from './SearchBar.svelte';
  import WordCard from './WordCard.svelte';
  import ThemeToggle from './ThemeToggle.svelte';
</script>

<HomeBackground />
<ThemeToggle />

<main>
  <Title showLogo={true}/>
  <div class="words">
    <WordCard word="Find." color="var(--color-accent)" />
    <WordCard word="Shop." color="var(--color-primary)" />
    <WordCard word="List." color="var(--color-sage)" />
  </div>
  <SearchBar />
</main>

<style>
  main {
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
  }

  .words {
    display: flex;
    gap: 1.5rem;
  }
</style>
