import { prisma } from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

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

	return { goal: { ...goalQueryResult, subtasks } };
};
