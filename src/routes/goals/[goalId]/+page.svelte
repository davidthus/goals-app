<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ goal } = data);
</script>

<main>
	<h3>{goal.title}</h3>
	{#if goal?.content}
		<p>{goal.content}</p>
	{/if}
	<p>Deadline;</p>
	<p>{String(goal.deadline)}</p>
	<p>Subtasks:</p>
	<ul>
		{#each goal.subtasks as subtask (subtask.subtaskId)}
			<li>
				<form method="post" action="?/toggleSubtask?id={subtask.subtaskId}">
					<label>
						{subtask.title}
						<input type="checkbox" name="subtask" value={subtask.isCompleted} />
					</label>
				</form>
			</li>
		{/each}
	</ul>
</main>
