<script>
</script>

<div class="layout">
  <aside class="sidebar">Sidebar</aside>

  <main class="main">Main Area</main>
</div>

<style>
  /* TODO: add :root for specific values you like (mainly thinking color) */
  .layout {
    display: grid;
    grid-template-columns: 250px 1fr;
    height: 100vh;
  }

  .sidebar {
    background: #e5490b;
    color: rgb(247, 247, 247);
    padding: 16px;
  }

  .main {
    background: #eee;
    padding: 16px;
  }
</style>
