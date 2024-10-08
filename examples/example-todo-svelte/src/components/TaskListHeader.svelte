<script lang="ts">
  import Card from '../lib/Card.svelte';
  import RadialProgressBar from '../lib/RadialProgressBar.svelte';
  import { StorePath, store } from '../store';

  const total = store.on<number>(StorePath.TOTAL);
  const completed = store.on<number>(StorePath.COMPLETED);

  $: percetage = $total !== 0 ? ($completed / $total) * 100 : 0;
</script>

<Card className="px-10 py-4 flex items-center gap-4">
  <section class="flex-1">
    <h1>Task List</h1>
    <h5 class="flex gap-2 items-center">
      <i class="bi bi-check-circle text-lg" />
      <span>{$total} tasks</span>
    </h5>
  </section>

  <RadialProgressBar className="w-28 h-28" progress={percetage}>
    <h3>{Math.round(percetage)}%</h3>
  </RadialProgressBar>
</Card>
