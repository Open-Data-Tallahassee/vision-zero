import { describe, expect, it, vi } from "vitest";
import { purgeExpired } from "./retention";

describe("purgeExpired", () => {
  it("deletes only expired requests without ongoing collaboration, and reports city interest first", async () => {
    const now = new Date("2027-12-01T00:00:00Z");
    const where = { deleteAfter: { lt: now }, ongoingCollaboration: false };
    const db = {
      cityRequest: {
        groupBy: vi.fn().mockResolvedValue([{ city: "Ocala", _count: { _all: 2 } }]),
        deleteMany: vi.fn().mockResolvedValue({ count: 2 }),
      },
      dataRequest: { deleteMany: vi.fn().mockResolvedValue({ count: 1 }) },
    };
    await expect(purgeExpired(db, now)).resolves.toEqual({ deletedCityRequests: 2, deletedDataRequests: 1, expiredCityInterest: { Ocala: 2 } });
    expect(db.cityRequest.groupBy).toHaveBeenCalledWith({ by: ["city"], where, _count: { _all: true } });
    expect(db.cityRequest.deleteMany).toHaveBeenCalledWith({ where });
    expect(db.dataRequest.deleteMany).toHaveBeenCalledWith({ where });
    expect(db.cityRequest.groupBy.mock.invocationCallOrder[0]).toBeLessThan(db.cityRequest.deleteMany.mock.invocationCallOrder[0]);
  });
});
