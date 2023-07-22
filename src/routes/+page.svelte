<script lang="ts">
	import { DateInput } from 'date-picker-svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let date = new Date();
	let min = new Date();
	let max = new Date(Number(min.getTime) + 31556926000);

	$: ({ goals } = data);
</script>

<main>
	<form action="?/createGoal&deadline={date.getTime()}" method="POST">
		<h2>Create a goal</h2>
		<label>
			Title:
			<input type="text" id="title" name="title" />
		</label>
		<label>
			Content:
			<textarea rows={5} id="content" name="content" />
		</label>
		<label for="date">
			Deadline:
			<DateInput
				bind:value={date}
				{min}
				{max}
				format="yyyy/MM/dd HH:mm:ss"
				placeholder={min.toLocaleString('en-GB', { timeZone: 'UTC' })}
			/>
		</label>
		<button type="submit">Add Goal</button>
	</form>
	<section>
		<h2>Goals:</h2>
		{#each goals as goal}
			<div>
				<a href={goal.id}>{goal.title}</a>
				<p>{String(goal.deadline)}</p>
				<form action="?/deleteGoal&id={goal.id}">
					<button type="button">Delete</button>
				</form>
			</div>
		{/each}
	</section>
</main>
