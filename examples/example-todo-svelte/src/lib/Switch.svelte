<script lang="ts">
  import { classNames } from '../utils/classNames';

  export let checked;
  export let onClick;
</script>

<button
  class={classNames(
    'flex items-center justify-center',
    'w-8 h-5',
    'rounded-full',
    'text-3xl',
    {
      'text-primary-500': checked,
      'text-gray-500': !checked,
    },
  )}
  on:click={onClick}
>
  {#if checked}
    <i class="bi bi-toggle-on" />
  {:else}
    <i class="bi bi-toggle-off" />
  {/if}
</button>
