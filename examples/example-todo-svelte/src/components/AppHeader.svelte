<script lang="ts">
  import Switch from '../lib/Switch.svelte';
  import { store } from '../store';

  const darkMode = store.on('darkMode');
  const toggleDarkMode = () => darkMode.update((curr) => !curr);
</script>

<header class="w-full p-4 mb-2 flex items-center">
  <p class="flex-1 text-sm text-gray-500">
    Fenix Store Example - Todo App (Svelte)
  </p>

  <article class="flex items-center gap-3 text-lg">
    <i class="bi bi-sun" />
    <Switch checked={$darkMode} onClick={toggleDarkMode} />
    <i class="bi bi-moon" />
  </article>
</header>
