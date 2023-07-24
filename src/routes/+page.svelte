<script lang="ts">
	import { browseWithoutSelecting, fiveYearsInMilliseconds, locale } from '$lib';
	import { DatePicker } from 'date-picker-svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ goals } = data);

	let date = new Date();
	let min = new Date();
	let max = new Date(Number(min.getTime()) + fiveYearsInMilliseconds);
</script>

<main>
	<form action="?/createGoal&deadline={date.getTime()}" method="POST" class="form">
		<h2>Create a goal</h2>
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
		<button type="submit">Add Goal</button>
	</form>
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
</main>

<style>
	.form {
		display: flex;
		flex-flow: column;
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
</style>
