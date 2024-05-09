<script lang="ts">
  import { classNames } from '../utils/classNames';

  export let className = '';
</script>

<section
  class={classNames(
    'bg-gray-500 bg-opacity-10 dark:bg-opacity-5',
    'border border-gray-300 dark:border-gray-700',
    'rounded-xl',
    className,
  )}
>
  <slot />
</section>
