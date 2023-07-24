<script lang="ts">
	import { format } from 'date-fns';
	import { DateInput } from 'date-picker-svelte';
	import { closeOnSelection, fiveYearsInMilliseconds, formatString, locale } from '../../lib/';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ goal } = data);

	let date = goal.deadline;
	let min = date;
	const formattedDate = format(date, 'dd/MM/yyyy');
	let max = new Date(Number(min.getTime()) + fiveYearsInMilliseconds);
</script>

<form>
	<label for="title">
		Title:
		<input type="text" name="title" value={goal.title} />
	</label>
	<label for="title">
		Content:
		<textarea name="content" value={goal.title} cols={5} />
	</label>
	<p>Deadline:</p>
	<DateInput
		bind:value={date}
		{min}
		{max}
		{locale}
		format={formatString}
		placeholder={formattedDate}
	/>
	{#if goal.subtasks}
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
	{/if}
	<a href={`/update/${goal.id}`}>Update Goal</a>
</form>
