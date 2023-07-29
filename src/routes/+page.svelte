<script lang="ts">
	import { browseWithoutSelecting, fiveYearsInMilliseconds, locale } from '$lib';
	import { DatePicker } from 'date-picker-svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ goals } = data);

	let date = new Date();
	let min = new Date();
	let max = new Date(Number(min.getTime()) + fiveYearsInMilliseconds);

	let subtasks = [{ title: '' }, { title: '' }];
</script>

<main class="container">
	<h2>Create a goal</h2>
	<form
		action="?/createGoal&deadline={date.getTime()}&subtasks={JSON.stringify(subtasks)}"
		method="POST"
		class="form"
	>
		<div class="stack">
			<label>
				Title:
				<input type="text" id="title" name="title" />
			</label>
			<label>
				Content:
				<textarea rows={5} id="content" name="content" />
			</label>
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label>
				Deadline:
				<DatePicker bind:value={date} {min} {max} {locale} {browseWithoutSelecting} />
			</label>
		</div>
		<div>
			<label>
				Subtasks:
				<ul>
					{#each subtasks as subtask, i}
						<li>
							<input type="text" bind:value={subtask.title} />
							<button
								type="button"
								on:click={() => {
									subtasks = subtasks.filter((subtask, index) => {
										return index === i ? false : true;
									});
								}}>X</button
							>
						</li>
					{/each}
				</ul>
				<button
					type="button"
					on:click={() => {
						subtasks = [...subtasks, { title: '' }];
					}}>Add subtask</button
				>
			</label>
			<button type="submit">Add Goal</button>
		</div>
	</form>
	{#if goals.length > 0}
		<section class="goals_list">
			<h2>Goals:</h2>
			{#each goals as goal}
				<div>
					<a href={goal.id}>{goal.title}</a>
					<p>
						{goal.deadline.toLocaleString('en-GB', {
							weekday: 'long',
							year: 'numeric',
							month: 'long',
							day: 'numeric'
						})}
					</p>
					<form action="?/deleteGoal&id={goal.id}" method="POST">
						<button type="submit">Delete</button>
					</form>
				</div>
			{/each}
		</section>
	{/if}
</main>

<style>
	.form {
		display: flex;
		width: 100vw;
		justify-content: space-around;
		gap: 2rem;
	}

	label {
		display: flex;
		flex-flow: column;
	}

	.goals_list {
		display: flex;
		flex-flow: column;
		gap: 2rem;
	}

	.container {
		display: flex;
		flex-flow: column;
		gap: 2rem;
	}

	.stack {
		display: flex;
		flex-flow: column;
		gap: 1rem;
	}
</style>
