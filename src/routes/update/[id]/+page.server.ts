/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { goto } from '$app/navigation';
import type { ISubtask } from '$lib';
import { prisma } from '$lib/server/prisma';
import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

type subtaskArray = ISubtask | { title: string; goalId: string };

export const load: PageServerLoad = async ({ params }) => {
	const goal = await prisma.goal.findUnique({
		where: {
			id: params.id
		}
	});

	if (!goal) {
		throw error(404, 'Goal not found');
	}

	const subtasks = await prisma.subtask.findMany({
		where: {
			goalId: goal.id
		}
	});

	return { goal: { ...goal, subtasks } };
};

export const actions: Actions = {
	updateGoal: async ({ request, url }) => {
		const { title, content } = Object.fromEntries(await request.formData()) as {
			title: string;
			content: string;
		};
		const id = url.searchParams.get('id') as string;

		if (!id || id.trim() === '') {
			return fail(400, { message: 'Invalid goal ID.' });
		}

		const deadlineInMilliseconds = url.searchParams.get('deadline');
		const deadline = new Date(Number(deadlineInMilliseconds));

		const subtasks = (
			url.searchParams.get('subtasks') !== null
				? JSON.parse(url.searchParams.get('subtasks')!)
				: url.searchParams.get('subtasks')
		) as subtaskArray[];

		try {
			const goal = await prisma.goal.update({
				where: {
					id
				},
				data: {
					title,
					content,
					deadline
				}
			});

			const goalId = goal.id as string;

			const subtasksArrayWithGoalId = subtasks.map((subtask) => ({ ...subtask, goalId }));

			subtasksArrayWithGoalId.forEach(async (subtask: subtaskArray) => {
				if ('id' in subtask) {
					await prisma.subtask.update({
						where: {
							id: subtask.id
						},
						data: subtask
					});
				} else {
					await prisma.subtask.create({
						data: {
							title: subtask.title,
							goalId: subtask.goalId
						}
					});
				}
			});

			await goto(`/${id}`);
		} catch (err) {
			console.error(err);
			return fail(500, { message: 'Could not update the goal.' });
		}
	}
};
