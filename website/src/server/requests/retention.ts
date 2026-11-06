// Deletes request records whose 12-month retention has passed, unless the person agreed to ongoing
// collaboration. Anonymous city counts are taken first so published interest survives deletion.
// Kept free of path aliases so scripts/retention.ts can run it with plain `node`.

interface RequestTable {
  deleteMany(args: { where: { deleteAfter: { lt: Date }; ongoingCollaboration: false } }): Promise<{ count: number }>;
}

export interface RetentionDb {
  cityRequest: RequestTable & {
    groupBy(args: { by: ["city"]; where: { deleteAfter: { lt: Date }; ongoingCollaboration: false }; _count: { _all: true } }): Promise<{ city: string; _count: { _all: number } }[]>;
  };
  dataRequest: RequestTable;
}

export async function purgeExpired(db: RetentionDb, now = new Date()) {
  const where = { deleteAfter: { lt: now }, ongoingCollaboration: false } as const;
  const cityCounts = await db.cityRequest.groupBy({ by: ["city"], where, _count: { _all: true } });
  const city = await db.cityRequest.deleteMany({ where });
  const data = await db.dataRequest.deleteMany({ where });
  return {
    deletedCityRequests: city.count,
    deletedDataRequests: data.count,
    // Record these in the funding/progress update before they're gone from the database.
    expiredCityInterest: Object.fromEntries(cityCounts.map((c) => [c.city, c._count._all])),
  };
}
