<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ goals } = data);
</script>

<main>
	<form action="?/createGoal">
		<h2>Create a goal</h2>
		<label>
			Title:
			<input type="text" id="title" name="title" />
		</label>
		<label>
			Content:
			<textarea rows={5} id="content" name="content" />
		</label>
		<button type="submit">Add Goal</button>
	</form>
	<section>
		<h2>Goals:</h2>
		{#each goals as goal}
			<div>
				<a href={`/goal/${goal.goalId}`}>{goal.title}</a>
				<p>{String(goal.deadline)}</p>
				<form action="?/deleteGoal&id={goal.goalId}">
					<button type="button">Delete</button>
				</form>
			</div>
		{/each}
	</section>
</main>
