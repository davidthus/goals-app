<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ goal } = data);
</script>

<form>
	<h3>{goal.title}</h3>
	{#if goal?.content}
		<p>{goal.content}</p>
	{/if}
	<p>Deadline;</p>
	<p>Subtasks:</p>
	<ul>
		{#each goal.subtasks as subtask (subtask.id)}
			<li>
				<form method="POST" action="?/toggleSubtask&id={subtask.id}">
					<label>
						{subtask.title}
						<input type="checkbox" name="subtask" value={subtask.isCompleted} />
					</label>
				</form>
			</li>
		{/each}
	</ul>
	<button><a href={`/update/${goal.id}`}>Update Goal</a></button>
</form>
