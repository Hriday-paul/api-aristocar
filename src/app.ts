/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middleware/globalErrorhandler';
import notFound from './app/middleware/notfound';
import router from './app/routes';
import { trackPageVisit } from './app/middleware/traffic.middleware';
import multer, { memoryStorage } from 'multer';
import { UploadedFiles } from './app/interface/common.interface';
import { uploadManyToS3 } from './app/utils/s3';
const app: Application = express();
app.use(express.static('public'));
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));
const storage = memoryStorage();
const upload = multer({ storage });
//parsers
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  }),
);

app.post(
  '/upload',
  upload.fields([{ name: 'images', maxCount: 5 }]),
  async (req: Request, res: Response) => {
    if (req.files) {
      const { images } = req.files as UploadedFiles;
      if (images?.length) {
        const imgsArray: { file: any; path: string; key?: string }[] = [];

        images?.map(async image => {
          imgsArray.push({
            file: image,
            path: 'images',
          });
        });

        req.body.image = await uploadManyToS3(imgsArray);
      }
    }
    res.json(req.body);
  },
);
// Remove duplicate static middleware
// app.use(app.static('public'));
app.use(trackPageVisit);
// application routes
app.use('/api/v1', router);
app.get('/', (req: Request, res: Response) => {
  res.send('server is running');
});
app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
