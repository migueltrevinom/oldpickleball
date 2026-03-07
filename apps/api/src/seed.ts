import { connectDatabase, disconnectDatabase } from './config/database.js';
import { User } from './models/user.model.js';
import { Court } from './models/court.model.js';
import { Session } from './models/session.model.js';
import bcrypt from 'bcryptjs';

async function seed() {
  await connectDatabase();
  console.log('Seeding database...');

  await User.deleteMany({});
  await Court.deleteMany({});
  await Session.deleteMany({});

  const passwordHash = await bcrypt.hash('password123', 12);

  const [alice, bob] = await User.create([
    {
      email: 'alice@example.com',
      passwordHash,
      role: 'player',
      profile: {
        firstName: 'Alice',
        lastName: 'Johnson',
        location: { type: 'Point', coordinates: [-75.270, 40.015], city: 'Philadelphia', state: 'PA', zip: '19103' },
      },
      skill: { selfRated: 3.5, preferredFormats: ['doubles', 'mixed'] },
      isVerified: true,
    },
    {
      email: 'bob@example.com',
      passwordHash,
      role: 'player',
      profile: {
        firstName: 'Bob',
        lastName: 'Smith',
        location: { type: 'Point', coordinates: [-75.165, 39.952], city: 'Philadelphia', state: 'PA', zip: '19107' },
      },
      skill: { selfRated: 4.0, preferredFormats: ['singles', 'doubles'] },
      isVerified: true,
    },
  ]);

  const [court1, court2] = await Court.create([
    {
      name: 'FDR Park Pickleball Courts',
      slug: 'fdr-park-pickleball-courts',
      description: 'Beautiful outdoor courts in FDR Park with great lighting.',
      location: {
        type: 'Point', coordinates: [-75.177, 39.907],
        address: '1500 Pattison Ave', city: 'Philadelphia', state: 'PA', zip: '19145',
      },
      details: { courtCount: 6, surfaceType: 'asphalt', environment: 'outdoor', lighting: true, hasNets: true },
      amenities: ['restrooms', 'parking', 'water'],
      access: { type: 'public', fee: 0 },
      community: { addedBy: alice._id },
    },
    {
      name: 'Cherry Hill Indoor Pickleball',
      slug: 'cherry-hill-indoor-pickleball',
      description: 'Premium indoor courts with climate control.',
      location: {
        type: 'Point', coordinates: [-75.001, 39.935],
        address: '2100 Route 38', city: 'Cherry Hill', state: 'NJ', zip: '08002',
      },
      details: { courtCount: 4, surfaceType: 'sport_court', environment: 'indoor', lighting: true, hasNets: true },
      amenities: ['restrooms', 'parking', 'water', 'pro_shop', 'lockers'],
      access: { type: 'semi_private', fee: 15, feePer: 'hour' },
      community: { addedBy: bob._id },
    },
  ]);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);
  const tomorrowEnd = new Date(tomorrow);
  tomorrowEnd.setHours(12, 0, 0, 0);

  await Session.create([
    {
      title: 'Morning Doubles - All Levels',
      description: 'Casual doubles session. Bring your own paddles!',
      type: 'open_play',
      format: 'doubles',
      court: court1._id,
      organizer: alice._id,
      schedule: { startTime: tomorrow, endTime: tomorrowEnd },
      skillRange: { min: 2.5, max: 4.0 },
      capacity: { min: 4, max: 12, spotsAvailable: 12 },
      cost: { amount: 0, currency: 'USD', splitEvenly: true },
      status: 'open',
      visibility: 'public',
    },
    {
      title: 'Competitive Singles Practice',
      description: 'Looking for 3.5+ players for singles drills and games.',
      type: 'casual',
      format: 'singles',
      court: court2._id,
      organizer: bob._id,
      schedule: { startTime: tomorrow, endTime: tomorrowEnd },
      skillRange: { min: 3.5, max: 5.0 },
      capacity: { min: 2, max: 4, spotsAvailable: 4 },
      cost: { amount: 15, currency: 'USD', splitEvenly: true, perPlayer: 15 },
      status: 'open',
      visibility: 'public',
    },
  ]);

  console.log('Seed complete: 2 users, 2 courts, 2 sessions');
  await disconnectDatabase();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
