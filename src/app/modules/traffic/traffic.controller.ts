import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { trafficService } from './traffic.service';
import sendResponse from '../../utils/sendResponse';

const getAllSTraffic = catchAsync(async (req: Request, res: Response) => {
  const result = await trafficService.getAllTrafficStats();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All subscriptions fetched successfully',
    data: result,
  });
});

// Get traffic stats for a specific day or all data if no day is provided
const getTrafficForDay = catchAsync(async (req: Request, res: Response) => {
  const { date } = req.params;

  if (!date) {
    // If no date is provided, return all traffic data
    const trafficStats = await trafficService.getAllTrafficStats();
    return res.status(200).json({
      success: true,
      data: trafficStats,
    });
  }

  // Parse the date from the request
  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) {
    return res.status(400).json({
      success: false,
      message: 'Invalid date format.',
    });
  }

  const trafficStats = await trafficService.getTrafficByDay(parsedDate);

  res.status(200).json({
    success: true,
    data: trafficStats,
  });
});

// Get traffic stats for a specific month or all data if no month is provided
const getTrafficForMonth = catchAsync(async (req: Request, res: Response) => {
  const { year, month } = req.params;

  if (!year || !month) {
    // If no year or month is provided, return all traffic data
    const trafficStats = await trafficService.getAllTrafficStats();
    return res.status(200).json({
      success: true,
      data: trafficStats,
    });
  }

  const yearInt = parseInt(year, 10);
  const monthInt = parseInt(month, 10);

  if (isNaN(yearInt) || isNaN(monthInt)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid year or month format.',
    });
  }

  const trafficStats = await trafficService.getTrafficByMonth(
    yearInt,
    monthInt,
  );

  res.status(200).json({
    success: true,
    data: trafficStats,
  });
});

// Get traffic stats for a specific year or all data if no year is provided
const getTrafficForYear = catchAsync(async (req: Request, res: Response) => {
  const { year } = req.params;

  if (!year) {
    // If no year is provided, return all traffic data
    const trafficStats = await trafficService.getAllTrafficStats();
    return res.status(200).json({
      success: true,
      data: trafficStats,
    });
  }

  const yearInt = parseInt(year, 10);

  if (isNaN(yearInt)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid year format.',
    });
  }

  const trafficStats = await trafficService.getTrafficByYear(yearInt);

  res.status(200).json({
    success: true,
    data: trafficStats,
  });
});

export const trafficController = {
  getTrafficForDay,
  getTrafficForMonth,
  getTrafficForYear,
  getAllSTraffic
};
