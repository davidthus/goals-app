import { prisma } from '$lib/server/prisma';
import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const goal: { id: string; title: string; content: string; deadline: Date } =
		await prisma.goal.findUnique({
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
