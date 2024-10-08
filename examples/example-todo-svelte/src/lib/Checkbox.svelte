<script lang="ts">
  import { classNames } from '../utils/classNames';

  export let checked: boolean;
  export let onChange: (checked: boolean) => void;
</script>

<button
  class={classNames(
    'relative h-5 w-5',
    'flex items-center justify-center',
    'border rounded',
    'border-gray-400 dark:border-gray-600',
    'text-gray-100 dark:text-gray-900',
    {
      'border-0 bg-primary-400 dark:bg-primary-500': checked,
    },
  )}
  on:click={() => onChange(!checked)}
>
  <span class="h-full w-full opacity-0 absolute cursor-pointer" />

  {#if checked}
    <i class="bi bi-check-lg" />
  {/if}
</button>
