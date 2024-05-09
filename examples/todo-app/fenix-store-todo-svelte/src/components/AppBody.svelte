<script lang="ts">
  import { classNames } from '../utils/classNames';
  import TaskListHeader from './TaskListHeader.svelte';
  import TaskInput from './TaskInput.svelte';
  import TaskList from './TaskList.svelte';
</script>

<main class={classNames('w-full flex-1 overflow-y-auto')}>
  <section class="max-w-md h-full m-auto flex flex-col gap-6">
    <TaskListHeader />
    <TaskInput />
    <TaskList />
  </section>
</main>
