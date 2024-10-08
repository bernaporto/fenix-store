<script lang="ts">
  import Card from '../lib/Card.svelte';
  import Checkbox from '../lib/Checkbox.svelte';
  import { StorePath, store } from '../store';
  import { classNames } from '../utils/classNames';

  export let id: string;

  $: taskPath = StorePath.TASK(id);
  $: completed = store.on<boolean>(`${taskPath}.completed`);
  $: label = store.on<string>(`${taskPath}.label`);

  const toggleCompleted = () => {
    completed.update((curr) => !curr);
  };

  const deleteTask = () => {
    store.on(taskPath).reset();
  };
</script>

<Card className="w-full h-13 px-4 py-3 flex gap-4 items-center">
  <Checkbox checked={$completed} onChange={toggleCompleted} />

  <article
    class={classNames('capitalize truncate flex-1', {
      'line-through opacity-50': $completed,
    })}
    title={$label}
  >
    {$label}
  </article>

  <button
    class="w-7 h-7 text-lg opacity-80 hover:opacity-100 rounded"
    on:click={deleteTask}
  >
    <i class="bi bi-trash3" />
  </button>
</Card>
