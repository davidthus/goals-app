<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ goal } = data);

	$: console.log(goal);
</script>

<a href={`/update/${goal.id}`}>Go to update</a>
<section class="goal">
	<div>
		<h2>{goal.title}</h2>
		{#if goal?.content}
			<p>{goal.content}</p>
		{/if}
		<p>
			Due {goal.deadline.toLocaleString('en-GB', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			})}
		</p>
	</div>
	<div>
		{#if goal.subtasks}
			<p>Subtasks:</p>
			<ul>
				{#each goal.subtasks as subtask (subtask.id)}
					<li>
						<form method="POST" action="?/toggleSubtask&id={subtask.id}">
							<label class="checkbox_group">
								<input type="checkbox" name="subtask" value={subtask.isCompleted} />
								{subtask.title}
							</label>
						</form>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</section>

<style>
	.goal {
		display: flex;
		justify-content: center;
		gap: 2rem;
	}

	.checkbox_group {
		display: flex;
		gap: 2rem;
	}
</style>
