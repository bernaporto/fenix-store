<script lang="ts">
  import { store } from '../store';
  import { classNames } from '../utils/classNames';

  let value = '';
  const handleAddTask = () => {
    const id = Date.now().toString();

    store.on(`tasks.items.${id}`).set({
      id,
      completed: false,
      label: value,
    });

    value = '';
  };
</script>

<section class="w-full flex gap-3">
  <input
    class="bg-gray-200 dark:bg-gray-800 py-4 px-6 rounded-xl flex-1"
    placeholder="Enter your next task..."
    bind:value
  />

  <button
    class={classNames(
      'w-13 h-13 p-2',
      'flex items-center justify-center',
      'text-gray-100 dark:text-gray-900 text-2xl',
      'bg-primary-400 dark:bg-primary-500',
      'rounded-xl',
    )}
    on:click={handleAddTask}
  >
    <i class="bi bi-plus-lg" />
  </button>
</section>
