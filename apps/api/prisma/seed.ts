import 'dotenv/config';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../src/generated/prisma/client.js';

// One-time bootstrap for the Platforms database — LinkedIn/Facebook/
// Instagram, the app's original three, with the same credential field
// *definitions* the Add Platform UI already had (values start empty; an
// admin fills them in through the UI, never seeded as source code).
const PLATFORMS = [
  {
    name: 'LinkedIn',
    summary: 'Company pages and showcase pages.',
    accountNoun: 'Page',
    accountNounPlural: 'Pages',
    apiBaseUrl: 'https://api.linkedin.com',
    credentialFields: [
      { key: 'access-token', label: 'Access Token', secret: true, value: '', position: 0 },
      { key: 'organization-urn', label: 'Organization URN', secret: false, value: '', position: 1 },
    ],
  },
  {
    name: 'Facebook',
    summary: 'Pages managed through a Facebook Business account.',
    accountNoun: 'Page',
    accountNounPlural: 'Pages',
    apiBaseUrl: 'https://graph.facebook.com',
    credentialFields: [
      { key: 'page-access-token', label: 'Page Access Token', secret: true, value: '', position: 0 },
      { key: 'page-id', label: 'Page ID', secret: false, value: '', position: 1 },
    ],
  },
  {
    name: 'Instagram',
    summary: 'Business and creator accounts.',
    accountNoun: 'Account',
    accountNounPlural: 'Accounts',
    apiBaseUrl: '',
    credentialFields: [],
  },
];

async function main() {
  const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? 'file:./dev.db' });
  const prisma = new PrismaClient({ adapter });

  for (const platform of PLATFORMS) {
    const existing = await prisma.platform.findFirst({ where: { name: platform.name } });
    if (existing) {
      console.log(`Skipping "${platform.name}" — already seeded.`);
      continue;
    }
    await prisma.platform.create({
      data: {
        name: platform.name,
        summary: platform.summary,
        accountNoun: platform.accountNoun,
        accountNounPlural: platform.accountNounPlural,
        apiBaseUrl: platform.apiBaseUrl,
        credentialFields: { create: platform.credentialFields },
      },
    });
    console.log(`Seeded "${platform.name}".`);
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
