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

	const date = writable(goal ? goal.deadline : new Date());
	let min = new Date();
	$: formattedDate = $date ? format($date, 'dd/MM/yyyy') : '';
	$: max = new Date(Number(min.getTime()) + fiveYearsInMilliseconds);

	const subtasks = writable<(ISubtask | { title: string })[]>(goal ? goal.subtasks : []);

	const filterSubtasks = (i: number) => {
		subtasks.update((prev) =>
			prev.filter((subtask: any, index: number) => {
				// returns false if its the correct element that needs be deleted
				return index === i ? false : true;
			})
		);
	};

	const addSubtask = () => {
		subtasks.update((prev) => [...prev, { title: '' }]);
	};

	$: console.log($subtasks);
</script>

{#if goal}
	<form
		method="post"
		action="?deadline={$date.getTime()}&subtasks={JSON.stringify(subtasks)}"
		use:enhance
	>
		<label for="title">
			Title:
			<input type="text" name="title" value={goal.title} />
		</label>
		<label for="content">
			Content:
			<textarea name="content" value={goal.content} cols={5} />
		</label>
		<p>Deadline:</p>
		<DateInput
			bind:value={$date}
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
{/if}
