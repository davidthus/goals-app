import { prisma } from '$lib/server/prisma';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const goals = await prisma.goal.findMany();
	return { goals };
};

export const actions: Actions = {
	createGoal: async ({ request, url }) => {
		const { title, content } = Object.fromEntries(await request.formData()) as {
			title: string;
			content: string;
		};
		const timeInMilliseconds = url.searchParams.get('deadline');
		const deadline = new Date(Number(timeInMilliseconds));

		try {
			await prisma.goal.create({
				data: {
					title,
					content,
					deadline
				}
			});
		} catch (err) {
			console.error(err);
			return fail(500, { message: 'Could not create the goal.' });
		}

		return {
			status: 201
		};
	},
	deleteGoal: async ({ url }) => {
		const id = url.searchParams.get('id');

		if (!id) {
			return fail(400, { message: 'Invalid request' });
		}

		try {
			await prisma.goal.delete({
				where: {
					id: Number(id)
				}
			});
		} catch (err) {
			console.error(err);
			return fail(500, {
				message: 'Something went wrong deleting your goal'
			});
		}

		return {
			status: 200
		};
	}
};
