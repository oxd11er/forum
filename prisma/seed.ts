import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { computeAnomalyScore } from '../src/lib/anomaly';
import { extractEntities } from '../src/lib/entities';
import { normalizeToken } from '../src/lib/puzzle';

const prisma = new PrismaClient();

const tokenData = [
  ['en','Latin','jesus'],['en','Latin','christ'],['ru','Cyrillic','иисус'],['ru','Cyrillic','христос'],
  ['el','Greek','ιησούς'],['el','Greek','χριστός'],['la','Latin','iesus'],['la','Latin','christus'],
  ['es','Latin','jesús'],['es','Latin','cristo'],['pt','Latin','jesus'],['pt','Latin','cristo'],
  ['fr','Latin','jésus'],['fr','Latin','christ'],['de','Latin','jesus'],['de','Latin','christus'],
  ['it','Latin','gesù'],['it','Latin','cristo'],['pl','Latin','jezus'],['pl','Latin','chrystus'],
  ['uk','Cyrillic','ісус'],['uk','Cyrillic','христос'],['be','Cyrillic','іісус'],['be','Cyrillic','хрыстос'],
  ['ar','Arabic','يسوع'],['ar','Arabic','المسيح'],['he','Latin','yeshua'],['he','Latin','mashiach'],
  ['tr','Latin','isa'],['tr','Latin','mesih'],['fa','Arabic','عیسی'],['fa','Arabic','مسیح'],
  ['hi','Latin','yeshu'],['hi','Latin','masih'],['zh','Han','耶稣'],['zh','Latin','yesu'],
  ['ja','Kana','イエス'],['ja','Latin','iesu'],['ko','Hangul','예수'],['ko','Latin','yesu'],
  ['id','Latin','yesus'],['sw','Latin','yesu'],['vi','Latin','giêsu'],['th','Latin','yesu'],
  ['am','Latin','iyesus'],['am','Latin','kristos']
];

async function main() {
  const password = await hash('password123', 10);

  await prisma.category.createMany({
    data: [
      { name: 'Open Archive', slug: 'open-archive', accessLevel: 0 },
      { name: 'Sealed', slug: 'sealed', accessLevel: 1 },
      { name: 'Under Seal', slug: 'under-seal', accessLevel: 2 }
    ],
    skipDuplicates: true
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.local' },
    update: {},
    create: { name: 'ADMIN', email: 'admin@example.local', passwordHash: password, role: 'ADMIN', reputation: 1000, approvedUnderSeal: true }
  });

  await prisma.user.upsert({ where: { email: 'archivist@example.local' }, update: {}, create: { name: 'ARCHIVIST', email: 'archivist@example.local', role: 'MOD', reputation: 9999 } });
  const user1 = await prisma.user.upsert({ where: { email: 'field1@example.local' }, update: {}, create: { name: 'field1', email: 'field1@example.local', passwordHash: password, reputation: 220 } });
  const user2 = await prisma.user.upsert({ where: { email: 'field2@example.local' }, update: {}, create: { name: 'field2', email: 'field2@example.local', passwordHash: password, reputation: 840, approvedUnderSeal: true } });

  const open = await prisma.category.findUniqueOrThrow({ where: { slug: 'open-archive' } });
  const samples = [
    ['Repeating numbers at station gate', 'On 2021 logs from Station Echo, @field1 noted 11:11 patterns repeating around Ledger entries.'],
    ['Archive shelf 19 resonance', 'The Archive shelf 19 had the same misfile date 1998 across three boxes marked Meridian.'],
    ['Coincidence in weather journals', 'Three journals mention Aurum rain on 2003-10-04 and list Protocol markers.'],
    ['Night transit map anomaly', 'A map pin named Krest shifted to North Hall in 2019 with identical symbols.'],
    ['Library index and old names', 'Mentions of Antioch, Rome, and Alexandria appear together with 2020 corrections.']
  ];

  for (const [title, body] of samples) {
    const thread = await prisma.thread.create({ data: { title, body, categoryId: open.id, authorId: Math.random() > 0.5 ? user1.id : user2.id } });
    const entities = extractEntities(`${title} ${body}`);
    for (const e of entities) {
      const ent = await prisma.entity.upsert({
        where: { id: `${e.type}-${e.normalized}` },
        update: {},
        create: { id: `${e.type}-${e.normalized}`, ...e }
      }).catch(async () => prisma.entity.findFirstOrThrow({ where: { type: e.type, normalized: e.normalized } }));
      await prisma.threadEntity.upsert({ where: { threadId_entityId: { threadId: thread.id, entityId: ent.id } }, update: { weight: 1 }, create: { threadId: thread.id, entityId: ent.id, weight: 1 } });
    }
    const score = computeAnomalyScore({ uniqueEntities: entities.length, numEntities: entities.length + 2, crossLinks: Math.floor(entities.length / 2), penalties: 0.2, reasons: ['baseline archival uncertainty'] });
    await prisma.anomalyScore.create({ data: { threadId: thread.id, score: score.score, factors: score.factors } });
  }

  for (const [languageCode, script, token] of tokenData) {
    await prisma.puzzleToken.create({
      data: {
        languageCode,
        script,
        token,
        normalized: normalizeToken(token),
        hintLevel: 1,
        weight: 1
      }
    }).catch(() => null);
  }

  const archivist = await prisma.user.findUniqueOrThrow({ where: { email: 'archivist@example.local' } });
  await prisma.thread.create({
    data: {
      title: 'Daily Archivist Note',
      body: 'Archive handling note: compare margins, preserve calm language, and avoid certainty claims.',
      categoryId: open.id,
      authorId: archivist.id,
      isEphemeral: true,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }
  }).catch(() => null);

  await prisma.auditLog.create({ data: { actorId: admin.id, action: 'seed_completed', meta: { ok: true } } });
}

main().finally(() => prisma.$disconnect());
