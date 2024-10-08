<script lang="ts">
  import { classNames } from '../utils/classNames';

  export let progress: number;
  export let className: string = '';
</script>

<section
  class={classNames('relative flex items-center justify-center', className)}
>
  <svg class="absolute w-full h-full" viewBox="0 0 100 100">
    <!-- Background circle -->
    <circle
      class="text-gray-200 dark:text-gray-800 stroke-current"
      cx="50"
      cy="50"
      fill="transparent"
      r="40"
      stroke-width="10"
    ></circle>
    <!-- Progress circle -->
    <circle
      class="text-primary-400 dark:text-primary-500 stroke-current"
      cx="50"
      cy="50"
      fill="transparent"
      r="40"
      style={`
        transition: stroke-dashoffset 0.2s;
        transform: rotate(-90deg);
        transform-origin: 50% 50%;
      `}
      stroke-dasharray="251.2"
      stroke-dashoffset={`calc(251.2px - (251.2px * ${progress}) / 100)`}
      stroke-linecap="round"
      stroke-width="10"
    ></circle>
  </svg>

  <slot />
</section>
