import "dotenv/config";
import { prisma } from "../src/lib/db";
import { hashPassword, verifyPassword } from "../src/lib/auth";

async function main() {
  const email = (process.env.ADMIN_EMAIL || "admin@zeynepceltekguzellik.local").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const hash = await hashPassword(password);

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    await prisma.adminUser.update({
      where: { email },
      data: {
        passwordHash: hash,
        role: "SUPER",
        name: existing.name || "Zeynep Admin",
      },
    });
    console.log("Updated admin", email);
  } else {
    await prisma.adminUser.create({
      data: {
        email,
        passwordHash: hash,
        name: "Zeynep Admin",
        role: "SUPER",
      },
    });
    console.log("Created admin", email);
  }

  const user = await prisma.adminUser.findUnique({ where: { email } });
  const ok = user ? await verifyPassword(password, user.passwordHash) : false;
  console.log("verify", password, "=>", ok);
  console.log(
    "all admins:",
    await prisma.adminUser.findMany({
      select: { email: true, role: true },
    })
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
