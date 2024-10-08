<script lang="ts">
  import { StorePath, store } from '../store';
  import TaskItem from './TaskItem.svelte';

  const tasks = store.on<string[]>(StorePath.TASK_IDS);
</script>

<section class="flex-1 flex flex-col gap-3 overflow-y-auto">
  {#each $tasks as taskId}
    <TaskItem id={taskId} />
  {/each}
</section>
