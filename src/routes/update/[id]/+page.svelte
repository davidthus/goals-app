<script lang="ts">
	import { enhance } from '$app/forms';
	import { closeOnSelection, fiveYearsInMilliseconds, formatString, locale } from '$lib';
	import { format } from 'date-fns';
	import { DateInput } from 'date-picker-svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ goal } = data);

	let date = goal.deadline;
	let min = date;
	const formattedDate = format(date, 'dd/MM/yyyy');
	let max = new Date(Number(min.getTime()) + fiveYearsInMilliseconds);

	let subtasks = goal.subtasks;

	const filterSubtasks = (i: number) => {
		subtasks = goal.subtasks.filter(
			(
				subtask: { id: string; title: string; isCompleted: boolean; goalId: string },
				index: number
			) => {
				return index === i ? false : true;
			}
		);
	};
</script>

<form
	method="post"
	action="?/updateGoal&deadline={date.getTime()}&subtasks={JSON.stringify(subtasks)}"
	use:enhance
>
	<label for="title">
		Title:
		<input type="text" name="title" value={goal.title} />
	</label>
	<label for="content">
		Content:
		<textarea name="content" value={goal.title} cols={5} />
	</label>
	<p>Deadline:</p>
	<DateInput
		bind:value={date}
		{min}
		{max}
		{locale}
		{closeOnSelection}
		format={formatString}
		placeholder={formattedDate}
	/>
	{#if goal.subtasks}
		<p>Subtasks:</p>
		<ul>
			{#each subtasks as subtask, i}
				<li>
					<input type="text" bind:value={subtask.title} />
					<button type="button" on:click={() => filterSubtasks(i)}>X</button>
				</li>
			{/each}
		</ul>
	{/if}
	<button type="submit">Update Goal</button>
</form>
