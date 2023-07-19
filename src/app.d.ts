declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
	const prisma: typeof import('@prisma/client').PrismaClient;
}

export {};
