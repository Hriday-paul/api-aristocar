import { ITraffic } from './traffic.interface';
import { Traffic } from './traffic.models';
import { v4 as uuidv4 } from 'uuid';

// Helper functions for date comparison
export const isSameDay = (date1: Date, date2: Date) =>
  date1.toDateString() === date2.toDateString();

export const isSameMonth = (date1: Date, date2: Date) =>
  date1.getMonth() === date2.getMonth() &&
  date1.getFullYear() === date2.getFullYear();

export const isSameYear = (date1: Date, date2: Date) =>
  date1.getFullYear() === date2.getFullYear();

export const incrementTraffic = async (pageUrl: string, userId: string) => {
  let trafficData = await Traffic.findOne({ pageUrl });
  const now = new Date();

  if (!trafficData) {
    trafficData = new Traffic({
      pageUrl,
      visits: 1,
      dailyVisits: 1,
      monthlyVisits: 1,
      yearlyVisits: 1,
      visitors: { [userId]: now },
      lastUpdated: now,
    });
  } else {
    if (!isSameDay(now, trafficData.lastUpdated)) {
      trafficData.dailyVisits = 1;
    } else {
      trafficData.dailyVisits += 1;
    }

    if (!isSameMonth(now, trafficData.lastUpdated)) {
      trafficData.monthlyVisits = 1;
    } else {
      trafficData.monthlyVisits += 1;
    }

    if (!isSameYear(now, trafficData.lastUpdated)) {
      trafficData.yearlyVisits = 1;
    } else {
      trafficData.yearlyVisits += 1;
    }

    trafficData.visits += 1;

    const lastVisit = trafficData.visitors.get(userId);
    const isUniqueToday = !lastVisit || !isSameDay(now, lastVisit);

    if (isUniqueToday) {
      trafficData.visitors.set(userId, now);
    }

    trafficData.lastUpdated = now;
  }

  await trafficData.save();
  return trafficData;
};

// Get traffic stats for a specific day
export const getTrafficByDay = async (date: Date) => {
  const result = await Traffic.find({
    lastUpdated: {
      $gte: new Date(date.setHours(0, 0, 0, 0)),
      $lt: new Date(date.setHours(23, 59, 59, 999)),
    },
  });
  const count = await Traffic.countDocuments({
    lastUpdated: {
      $gte: new Date(date.setHours(0, 0, 0, 0)),
      $lt: new Date(date.setHours(23, 59, 59, 999)),
    },
  });
  return { result, count };
};

// Get traffic stats for a specific month, with count
export const getTrafficByMonth = async (year: number, month: number) => {
  const result = await Traffic.find({
    lastUpdated: {
      $gte: new Date(year, month - 1, 1),
      $lt: new Date(year, month, 0, 23, 59, 59, 999),
    },
  });
  const count = await Traffic.countDocuments({
    lastUpdated: {
      $gte: new Date(year, month - 1, 1),
      $lt: new Date(year, month, 0, 23, 59, 59, 999),
    },
  });
  return { result, count };
};

// Get traffic stats for a specific year, with count
export const getTrafficByYear = async (year: number) => {
  const trafficData = [];

  for (let month = 0; month < 12; month++) {
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 1);

    const result = await Traffic.find({
      lastUpdated: {
        $gte: startOfMonth,
        $lt: endOfMonth,
      },
    });

    const count = result.length; 

    trafficData.push({
      month: startOfMonth.toLocaleString('default', { month: 'long' }),
      count,
    });
  }

  return trafficData;
};

// Get all traffic stats
export const getAllTrafficStats = async () => {
  const result = await Traffic.find();
  const count = await Traffic.countDocuments();
  return { result, count };
};

export const trafficService = {
  incrementTraffic,
  getAllTrafficStats,
  getTrafficByDay,
  getTrafficByMonth,
  getTrafficByYear,
};
