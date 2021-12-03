import { PrismaClient } from "@prisma/client";

declare global {
	var prisma: PrismaClient;
}

const prisma = global.prisma || new PrismaClient({ log: ["info"] });
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;

// import { PrismaClient } from "@prisma/client";

// declare global {
//   var prisma: PrismaClient;
// }

// if (process.env.NODE_ENV === "production") {
//   prisma = new PrismaClient();
// }
// // `stg` or `dev`
// else {
//   console.log("Checking if prisma instance exists...");
//   if (!global.prisma) {
//     console.log("No prisma instance, creating one...");
//     global.prisma = new PrismaClient({
//       // rejectOnNotFound: true,
//     });
//   } else {
//     console.log("It does, grabbing current prisma instance!");
//     prisma = global.prisma;
//   }
// }