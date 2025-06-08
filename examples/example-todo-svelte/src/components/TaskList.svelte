<script lang="ts">
  import { store } from '../store';
  import TaskItem from './TaskItem.svelte';

  const tasks = store.on(`tasks.ids`);
</script>

<section class="flex-1 flex flex-col gap-3 overflow-y-auto">
  {#each $tasks as taskId}
    <TaskItem id={taskId} />
  {/each}
</section>
