import express, { Application, Request, Response, Router } from 'express';



import userAuthRoutes from './user/auth.routes';
import userProfileRoutes from './user/profile.routes';
import agencyJobRoutes from './agency/jobs.routes';
import agentJobRoutes from './agent/jobs.routes';
import adminJobRoutes from './admin/jobs.routes';
import messageRoutes from './message.routes';
import countryRoutes from './master/country.routes';
import stateRoutes from './master/state.routes';
import cityRoutes from './master/city.routes';
import categoryRoutes from './category/category.routes';
import locationRoutes from './master/location.routes';



/**
 *
 * @param {_express.Application} app - The `app` parameter is an instance of the Express application. It is used to define the
 * routes and middleware for the application.
 * @returns The `router` function is returning the `app` object after configuring the routes for
 * various endpoints.
 * @description The router function sets up the routes for various API endpoints in the application.
 */
const router = (app: Application) => {
    const router:Router = Router()
    router.use('/user/auth', userAuthRoutes);
    router.use('/user/profile', userProfileRoutes);
    router.use('/agency/jobs', agencyJobRoutes);
    router.use('/agent/jobs', agentJobRoutes);
    router.use('/admin/jobs', adminJobRoutes);
    router.use('/messages', messageRoutes);


    router.use('/master/country', countryRoutes)
    router.use('/master/state', stateRoutes)
    router.use('/master/city', cityRoutes)
    router.use('/category', categoryRoutes);
    router.use('/master/location', locationRoutes);

    router.get('/', (req: Request, res: Response) => {
        res.send('<h1>Welcome To The Blitz</h1>');
    })


    app.use('/api',router)
    
    return app;

}

export default router;