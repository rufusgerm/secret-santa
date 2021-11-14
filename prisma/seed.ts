import prisma from "@lib/prisma";

const generateVerificationCode = (): string => {
  return String(Math.random()).substring(2, 11);
};

async function main() {
  const alice = await prisma.santa.upsert({
    where: { email: "alice@prisma.io" },
    update: {},
    create: {
      first_name: "Alice",
      last_name: "Bergeron",
      email: "alice@prisma.io",
      verification_code: generateVerificationCode(),
      is_active: true,
    },
  });

  const bob = await prisma.santa.upsert({
    where: { email: "bob@prisma.io" },
    update: {},
    create: {
      email: "bob@prisma.io",
      first_name: "Bob",
      last_name: "Bergeron",
      verification_code: generateVerificationCode(),
      is_active: true,
    },
  });

  const billy = await prisma.santa.upsert({
    where: { email: "billy@prisma.io" },
    update: {},
    create: {
      email: "billy@prisma.io",
      first_name: "Billy",
      last_name: "Flexman",
      verification_code: generateVerificationCode(),
      is_active: true,
    },
  });

  const jane = await prisma.santa.upsert({
    where: { email: "jane@prisma.io" },
    update: {},
    create: {
      email: "jane@prisma.io",
      first_name: "Jane",
      last_name: "Flexman",
      verification_code: generateVerificationCode(),
      is_active: true,
    },
  });

  const bergerons = await prisma.family.upsert({
    where: { name: "Bergeron" },
    update: {},
    create: {
      name: "Bergeron",
    },
  });

  const flexmans = await prisma.family.upsert({
    where: { name: "Flexman" },
    update: {},
    create: {
      name: "Flexman",
    },
  });

  console.log({ alice, bob, billy, jane });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
