import { prisma } from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const goal = await prisma.goal.findUnique({
		where: {
			id: params.goalId
		}
	});
	if (!goal) {
		throw error(404, 'Goal not found');
	}
	return { goal };
};
