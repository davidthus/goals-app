<script lang="ts">
	import { enhance } from '$app/forms';
	import {
		closeOnSelection,
		fiveYearsInMilliseconds,
		formatString,
		locale,
		type IGoal,
		type ISubtask
	} from '$lib';
	import { format } from 'date-fns';
	import { DateInput } from 'date-picker-svelte';
	import { writable } from 'svelte/store';
	import type { PageData } from './$types';

	export let data: PageData;

	let goal: IGoal | null;

	if (data) {
		goal = data.goal;
	} else {
		goal = null;
	}

	$: date = goal ? goal.deadline : new Date();
	$: min = date;
	$: formattedDate = goal ? format(date, 'dd/MM/yyyy') : '';
	$: max = new Date(Number(min.getTime()) + fiveYearsInMilliseconds);

	const subtasks = writable<(ISubtask | { title: string })[]>(goal ? goal.subtasks : []);

	const filterSubtasks = (i: number) => {
		subtasks.update((prev) =>
			prev.filter((subtask: any, index: number) => {
				return index === i ? false : true;
			})
		);
	};

	const addSubtask = () => {
		subtasks.update((prev) => [...prev, { title: '' }]);
	};

	$: console.log($subtasks);
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
			{#each $subtasks as subtask, i}
				<li>
					<input type="text" bind:value={$subtasks[i].title} />
					<button type="button" on:click={() => filterSubtasks(i)}>X</button>
				</li>
			{/each}
		</ul>
		<button type="button" on:click={addSubtask}>Add subtask</button>
	{/if}
	<button type="submit">Update Goal</button>
</form>
