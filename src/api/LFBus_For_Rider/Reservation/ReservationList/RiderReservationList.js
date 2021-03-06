import { prisma } from "../../../../../generated/prisma-client";

export default {
  Query: {
    RiderReservationList: async (_, args, { request, isUserAuthenticated }) => {
      const { orderBy, skip, after, before, first, last, CAR_REG_NO } = args;

      let where = {
        CAR_REG_NO: CAR_REG_NO,
        status: "S",
      };

      const reservations = await prisma.reservations({
        where,
        orderBy,
        skip, //offset
        after,
        before,
        first, //limit
        last,
      });

      const count = await prisma
        .reservationsConnection({
          where,
        })
        .aggregate()
        .count();

      return { reservations, count };
    },
  },
};
