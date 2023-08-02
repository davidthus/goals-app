<script lang="ts">
	import { enhance } from '$app/forms';
	import { closeOnSelection, fiveYearsInMilliseconds, formatString, locale } from '$lib';
	import { format } from 'date-fns';
	import { DateInput } from 'date-picker-svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ goal } = data);

	$: date = goal.deadline;
	$: min = date;
	$: formattedDate = format(date, 'dd/MM/yyyy');
	$: max = new Date(Number(min.getTime()) + fiveYearsInMilliseconds);

	$: subtasks = goal.subtasks;

	const filterSubtasks = (i: number) => {
		console.log(i);
		subtasks = goal.subtasks.filter((subtask: any, index: number) => {
			return index === i ? false : true;
		});
	};

	const addSubtask = () => {
		subtasks = [...subtasks, { title: '' }];
	};

	$: console.log(subtasks);
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
	{#if subtasks}
		<p>Subtasks:</p>
		<ul>
			{#each subtasks as subtask, i}
				<li>
					<input type="text" bind:value={subtasks[i].title} />
					<button type="button" on:click={() => filterSubtasks(i)}>X</button>
				</li>
			{/each}
		</ul>
		<button type="button" on:click={addSubtask}>Add subtask</button>
	{/if}
	<button type="submit">Update Goal</button>
</form>
