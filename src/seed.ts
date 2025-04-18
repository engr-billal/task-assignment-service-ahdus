import { db, pool } from './db';
import { users, tasks, NewUser, NewTask } from './schema';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
  try {
    console.log('Seeding database...');

    // Create admin user
    const adminId = uuidv4();
    const adminUser: NewUser = {
      id: adminId,
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
    };
    await db.insert(users).values(adminUser);

    // Create regular user
    const userId = uuidv4();
    const regularUser: NewUser = {
      id: userId,
      name: 'Regular User',
      email: 'user@example.com',
      role: 'user',
    };
    await db.insert(users).values(regularUser);

    // Create some tasks
    const seedTasks: NewTask[] = [
      {
        id: uuidv4(),
        title: 'Implement Task Service',
        description:
          'Create the NestJS task service with all required functionality',
        assignedUserId: userId,
        status: 'pending',
      },
      {
        id: uuidv4(),
        title: 'Set up Authentication',
        description: 'Implement JWT authentication for the service',
        assignedUserId: adminId,
        status: 'pending',
      },
      {
        id: uuidv4(),
        title: 'Write Documentation',
        description: 'Document the API endpoints and usage',
        status: 'pending',
      },
    ];
    await db.insert(tasks).values(seedTasks);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the pool
    await pool.end();
  }
}

seed();
