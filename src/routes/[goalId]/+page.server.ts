import { prisma } from '$lib/server/prisma';
import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const goalQueryResult = await prisma.goal.findUnique({
		where: {
			id: params.goalId
		}
	});

	if (!goalQueryResult) {
		throw error(404, 'Goal not found');
	}

	let subtasks;
	const subtasksQueryResult = await prisma.subtask.findMany({
		where: {
			goalId: goalQueryResult.goalId
		}
	});

	if (subtasksQueryResult) {
		subtasks = subtasksQueryResult;
	}

	console.log(subtasks, goalQueryResult);

	return { goal: { ...goalQueryResult, subtasks } };
};

export const actions: Actions = {
	toggleSubtask: async ({ url }) => {
		const id = url.searchParams.get('id');

		if (!id) {
			return fail(400, { message: 'Invalid request' });
		}

		const subtask = await prisma.subtask.findUnique({ where: { id } });

		if (!subtask) {
			throw error(404, 'Subtask not found');
		}

		await prisma.subtask.update({
			where: {
				id
			},
			data: {
				isCompleted: !subtask.isCompleted
			}
		});
	}
};
