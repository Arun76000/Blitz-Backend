import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet'
import {allExceptionsMiddleware} from './middlewares/All-Exception-filter';
import { interceptorMiddleware } from './middlewares/interceptor.middleware';
import morgan from 'morgan';
import { GlobalMiddleware } from './middlewares/global.middleware';
import { asyncHandler } from './utils/asyncHandler';
import { createRateLimitMiddleware } from './middlewares/guards/rateLimit.guard';




import userAuthRoutes from './routes/user/auth.routes';
import userProfileRoutes from './routes/user/profile.routes';
import agencyJobRoutes from './routes/agency/jobs.routes';
import agentJobRoutes from './routes/agent/jobs.routes';
import adminJobRoutes from './routes/admin/jobs.routes';
import messageRoutes from './routes/message.routes';
import countryRoutes from './routes/master/country.routes';
import stateRoutes from './routes/master/state.routes';
import cityRoutes from './routes/master/city.routes';
import categoryRoutes from './routes/category/category.routes';
import locationRoutes from './routes/master/locarion.routes';



const app: Application = express();

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PATCH', 'DELETE'] }));


app.use(
    createRateLimitMiddleware(
        5 * 60 * 1000,
        100,
        'Too many requests. Please try again later.'
    )
);
app.use(helmet())
app.use(express.json());
app.use(morgan('combined'))

app.use(interceptorMiddleware)

const globalMiddleware = new GlobalMiddleware().middleware;

app.use(asyncHandler(globalMiddleware));

app.get('/api/home', (req, res) => {
    res.json({ success: true, data: req.body });
})
app.get('/', (req, res) => {
    res.send('<h1>Welcome To The Blitz</h1>');
})

//.'.'.'.'.'.'.'.'.'.'.'.'.'.'.'.'.'.'.'.'.'.'.==__ROUTES__==.'.'.'.'.'.'.'.'.'.'.'.'.'.'.'.'.'.'.'.'.'.'//

app.use('/api/user/auth', userAuthRoutes);
app.use('/api/user/profile', userProfileRoutes);
app.use('/api/agency/jobs', agencyJobRoutes);
app.use('/api/agent/jobs', agentJobRoutes);
app.use('/api/admin/jobs', adminJobRoutes);
app.use('/api/messages', messageRoutes);


app.use('/api/master/country', countryRoutes)
app.use('/api/master/state', stateRoutes)
app.use('/api/master/city', cityRoutes)
app.use('/api/master/category', categoryRoutes);
app.use('/api/master/location', locationRoutes);

//  -> api/v1/

// const exceptionHandler: ErrorRequestHandler = allExceptionsMiddleware();
// app.use(exceptionHandler());

app.use(allExceptionsMiddleware())

export default app;