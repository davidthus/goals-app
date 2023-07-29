<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ goal } = data);

	const formRefsArray =
		goal && Array.isArray(goal.subtasks)
			? goal.subtasks.map(() => undefined as unknown | HTMLFormElement)
			: [];
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
		{#if goal.subtasks.length}
			<p>Subtasks:</p>
			<ul>
				{#each goal.subtasks as subtask, i}
					<li>
						<form
							method="POST"
							action="?/toggleSubtask&id={subtask.id}"
							bind:this={formRefsArray[i]}
							on:change={() => formRefsArray[i].requestSubmit()}
							use:enhance
						>
							<label class="checkbox_group">
								<input type="checkbox" name="subtask" checked={subtask.isCompleted} />
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
