<script lang="ts">
  import AppBody from './components/AppBody.svelte';
  import AppFooter from './components/AppFooter.svelte';
  import AppHeader from './components/AppHeader.svelte';
  import { store } from './store';
  import { classNames } from './utils/classNames';

  const darkMode = store.on('darkMode');
</script>

<div
  class={classNames(
    'w-full h-full flex flex-col',
    'bg-gray-100 dark:bg-gray-900',
    'text-gray-700 dark:text-gray-300',
    {
      dark: $darkMode,
    },
  )}
>
  <AppHeader />
  <AppBody />
  <AppFooter />
</div>
