/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { prisma } from '$lib/server/prisma';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

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

		const deadlineInMilliseconds = url.searchParams.get('deadline');
		const deadline = new Date(Number(deadlineInMilliseconds));

		const subtasks = (
			url.searchParams.get('subtasks') !== null
				? JSON.parse(url.searchParams.get('subtasks')!)
				: url.searchParams.get('subtasks')
		) as { title: string }[];

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
			const goalId = goal.id;

			const subtasksArrayWithGoalId = subtasks.map((subtask) => ({ ...subtask, goalId }));

			await prisma.subtask.updateMany({ where: { goalId }, data: subtasksArrayWithGoalId });

			throw redirect(303, `/${id}`);
		} catch (err) {
			console.error(err);
			return fail(500, { message: 'Could not update the goal.' });
		}
	}
};
