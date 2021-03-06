import { prisma } from "../../../../../generated/prisma-client";
import mysql from "mysql2/promise";
import { dbConfig } from "../../../../../config/db.config";
const pool = mysql.createPool(dbConfig);

export default {
  Query: {
    UserBusStationList: async (_, args) => {
      const { latitude, longitude, orderBy } = args;
      console.log(latitude, longitude);
      let busStations = [];
      const connection = await pool.getConnection(async (conn) => conn);
      const [results] = await connection.query(
        // `SELECT BUS_STOP_ID ,BUS_NODE_ID, BUSSTOP_NM, GPS_LATI, GPS_LONG, distance_between(GPS_LATI, GPS_LONG, ${latitude}, ${longitude}) AS DISTANCE FROM BusStation WHERE distance_between(GPS_LATI, GPS_LONG, ${latitude}, ${longitude}) <= 0.5 ORDER BY DISTANCE ASC `
        `SELECT BUS_STOP_ID ,BUS_NODE_ID, BUSSTOP_NM, GPS_LATI, GPS_LONG,(6371*acos(cos(radians(${latitude}))*cos(radians(GPS_LATI))*cos(radians(GPS_LONG) -radians(${longitude}))+sin(radians(${latitude}))*sin(radians(GPS_LATI)))) AS DISTANCE FROM BusStation Having DISTANCE <= 0.5 order by DISTANCE`
      );
      connection.release();

      results.map((obejct, index) => {
        const busStation = {
          BUS_STOP_ID: obejct.BUS_STOP_ID,
          BUS_NODE_ID: obejct.BUS_NODE_ID,
          BUSSTOP_NM: obejct.BUSSTOP_NM,
          DISTANCE: obejct.DISTANCE,
          GPS_LATI: obejct.GPS_LATI,
          GPS_LONG: obejct.GPS_LONG,
          orderBy: orderBy,
        };
        busStations.push(busStation);
      });

      const count = busStations.length;

      return { busStations, count };
    },
  },
};
