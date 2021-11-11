import { PrismaClient } from '@prisma/client'

declare global {
    var prisma: PrismaClient
}


if (process.env.NODE_ENV === 'production') {
	prisma = new PrismaClient()
}
// `stg` or `dev`
else {
	console.log("Checking if prisma instance exists...")
	if (!global.prisma) {
		console.log("No prisma instance, creating one...")
		global.prisma = new PrismaClient()
	}

	prisma = global.prisma
}

export default prisma