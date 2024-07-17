// import prisma from '../utils/prismaClient.js';

// export async function authenticate(req, res, next) {
//   const Apikey = req.headers['x-api-key'];
//   if (!Apikey) {
//     return res.status(401).json({ error: 'API key is missing' });
//   }

//   const subscription = await prisma.subscription.findUnique({ where: { apikey : Apikey } });
//   if (!subscription) {
//     return res.status(401).json({ error: 'Invalid API key' });
//   }

//   req.user = subscription.user ;
//   next();
// }
