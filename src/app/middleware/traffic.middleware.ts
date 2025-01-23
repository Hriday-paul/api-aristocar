import { Request, Response, NextFunction } from 'express';
import { trafficService } from '../modules/traffic/traffic.service';
import { v4 as uuidv4 } from 'uuid'; // To generate a unique userId

export const trackPageVisit = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  
  let userId = req.cookies.userId;

  
  if (!userId) {
    userId = uuidv4();
    res.cookie('userId', userId, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    }); 
  }

  const pageUrl = req.originalUrl;

  try {
    
    await trafficService.incrementTraffic(pageUrl, userId);
    next();
  } catch (error) {
    next(error); 
  }
};
