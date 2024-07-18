import { NextResponse } from 'next/server';
import prisma from '../../../utils/prismaClient';
import { authenticate } from '../../../middlewares/authenticate';

// Middleware for authentication
const authMiddleware = async (req) => {
  try {
    await authenticate(req);
    return true;
  } catch (error) {
    return false;
  }
};

// Helper function to run middleware
const runMiddleware = async (req, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      resolve();
    });
  });
};

// GET handler
const getRatings = async (req) => {
  try {
    const ratings = await prisma.rating.findMany({
      where: { userId: req.user.id },
    });
    return NextResponse.json(ratings, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch ratings' }, { status: 500 });
  }
};

// POST handler
const createRating = async (req) => {
  try {
    const { rating, customerId } = await req.json();
    const newRating = await prisma.rating.create({
      data: {
        rating,
        customerId,
        userId: req.user.id,
      },
    });
    return NextResponse.json(newRating, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create rating' }, { status: 500 });
  }
};

// Main handler function for GET and POST requests
export async function GET(req) {
  const authenticated = await runMiddleware(req, authMiddleware);
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return getRatings(req);
}

export async function POST(req) {
  const authenticated = await runMiddleware(req, authMiddleware);
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return createRating(req);
}

export async function PUT(req) {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}

export async function DELETE(req) {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
