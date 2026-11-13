<script>
    import WordCard from "./WordCard.svelte";
    import DictionaryWordCard from "./DictionaryWordCard.svelte";
    let { isStandard, word, description, color = "inherit", pronunciation = "", partOfSpeech = ""} = $props();
</script>
<div class="WordCardWrapper">
    {#if isStandard}
        <WordCard 
        word = {word} 
        description = {description}
        color = {color} />
    {:else}
        <DictionaryWordCard 
        word = {word} 
        description = {description}
        color = {color}
        pronunciation = "/faɪnd/"
        partOfSpeech = "verb"
        />
    {/if}
</div>
<style>
/* I don't think this needs style lol */
</style>
