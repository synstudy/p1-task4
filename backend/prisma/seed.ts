import { PrismaClient, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { v6 } from 'uuid';

const prisma = new PrismaClient();

export function generateUUIDv6(): string {
  return v6();
}

// Function to check if admin user exists
async function checkAdminExists() {
  const admin = await prisma.user.findFirst({
    where: {
      email: 'admin@example.com',
    },
  });
  return !!admin;
}

async function seedDatabase() {
  // Check if admin user already exists
  const adminExists = await checkAdminExists();
  if (adminExists) {
    console.log('Admin user already exists. Skipping seed.');
    return;
  }

  console.log('Starting database seed...');

  // Create ADMIN user
  const adminUser = await prisma.user.create({
    data: {
      id: generateUUIDv6(),
      email: 'admin@example.com',
      password: await bcrypt.hash('123456', 10),
      firstName: 'System',
      lastName: 'Administrator',
      role: 'ADMIN',
    },
  });

  console.log(`Created admin user: ${adminUser.email}`);

  // Generate 20 USER users
  const firstNames = [
    'John',
    'Emily',
    'Michael',
    'Sarah',
    'David',
    'Jessica',
    'James',
    'Emma',
    'Robert',
    'Olivia',
    'William',
    'Ava',
    'Thomas',
    'Isabella',
    'Christopher',
    'Mia',
    'Daniel',
    'Charlotte',
    'Matthew',
    'Amelia',
  ];

  const lastNames = [
    'Smith',
    'Johnson',
    'Williams',
    'Brown',
    'Jones',
    'Garcia',
    'Miller',
    'Davis',
    'Rodriguez',
    'Martinez',
    'Hernandez',
    'Lopez',
    'Gonzalez',
    'Wilson',
    'Anderson',
    'Thomas',
    'Taylor',
    'Moore',
    'Jackson',
    'Martin',
  ];

  const users: User[] = [];
  for (let i = 0; i < 20; i++) {
    const user = await prisma.user.create({
      data: {
        id: generateUUIDv6(),
        email: `user${i + 1}@example.com`,
        password: await bcrypt.hash('123456', 10),
        firstName: firstNames[i],
        lastName: lastNames[i],
        role: 'USER',
      },
    });
    users.push(user);
    console.log(`Created user: ${user.email}`);
  }

  // Project names
  const projectNames = [
    'Website Redesign Project',
    'Mobile App Development',
    'Marketing Campaign Q3',
    'Database Migration',
    'Customer Onboarding System',
  ];

  // Task titles
  const taskTitles = [
    'Implement responsive design',
    'Fix authentication bug',
    'Create onboarding flow',
    'Optimize database queries',
    'Design new landing page',
    'Integrate payment system',
    'Update documentation',
    'Refactor legacy code',
    'Implement caching layer',
    'Create API endpoints',
    'Setup CI/CD pipeline',
    'Fix memory leaks',
    'Implement audit trail',
    'Create admin dashboard',
    'Setup monitoring system',
    'Migrate database schema',
    'Add new user roles',
    'Implement real-time notifications',
    'Fix accessibility issues',
    'Optimize image loading',
    'Setup automated testing',
    'Implement dark mode',
    'Create backup system',
    'Integrate analytics',
    'Redesign main navigation',
    'Add multilingual support',
    'Create user onboarding emails',
    'Improve search functionality',
    'Setup logging system',
    'Add export features',
  ];

  // Task descriptions (at least 20 words)
  const taskDescriptions = [
    'This task involves creating a responsive layout that works across all device sizes using modern CSS techniques and flexible grid systems to ensure optimal user experience on mobile, tablet and desktop devices with attention to performance and accessibility standards.',
    'We need to fix a critical authentication bug that is preventing users from logging into the application after the recent deployment which affects all user accounts and needs immediate resolution to restore service functionality for all users.',
    'The onboarding flow needs to be created with a step-by-step process that guides new users through the application features to ensure they can quickly understand how to use our platform effectively and become productive users.',
    'Database queries need optimization to improve application performance and reduce loading times especially during peak usage periods to ensure smooth operation and better user experience with faster response times.',
    'Design a new landing page that increases conversion rates and captures user attention with compelling visuals to drive more signups and engagement with our product and services.',
    'The payment system integration requires implementation of secure transactions and multiple payment methods to allow users to make purchases easily and securely within the application environment.',
    'Comprehensive documentation needs to be created for all API endpoints and user guides to help new developers and users understand and utilize the platform features effectively.',
    'Refactor the legacy codebase to improve maintainability and performance while ensuring all existing functionality remains intact during the transition to modern development practices.',
    'Implement a caching layer to improve application performance and reduce database load especially for frequently accessed data to ensure faster response times and better scalability.',
    'Create new API endpoints for the upcoming features following RESTful design principles with proper authentication and authorization to ensure secure and efficient communication with the frontend.',
    'Setup a continuous integration and deployment pipeline to automate testing and deployment processes for faster releases and improved code quality with reduced manual intervention.',
    'Memory leaks in the application need to be identified and fixed to improve stability and performance especially during long-running sessions and heavy usage scenarios.',
    'Implement an audit trail system to track all user actions and changes for compliance and security monitoring purposes with detailed logging of all important events.',
    'Create an admin dashboard with comprehensive statistics and management tools to allow administrators to effectively manage users, projects, and system resources.',
    'Setup a monitoring system to track application performance, errors, and user activity to proactively identify and resolve issues before they impact users.',
    'Migrate the database schema to the new version while ensuring data integrity and minimal downtime during the transition without losing any existing data.',
    'Add new user roles and permissions to support different access levels and capabilities within the application following security best practices for role-based access.',
    'Implement real-time notifications using web sockets to inform users of important updates and activities as they happen in the system.',
    'Fix accessibility issues to ensure the application meets WCAG standards and is usable by people with disabilities following inclusive design principles.',
    'Optimize image loading and caching to improve page load times and reduce bandwidth usage especially for users on slower connections.',
    'Setup automated testing including unit tests, integration tests, and end-to-end tests to ensure code quality and prevent regressions.',
    'Implement dark mode option to provide users with a comfortable viewing experience in low-light conditions and reduce eye strain.',
    'Create a backup system to regularly backup important data and ensure recovery procedures are in place for disaster recovery scenarios.',
    'Integrate analytics to track user behavior, application usage, and performance metrics to drive data-driven decisions and improvements.',
    'Redesign the main navigation to improve user experience and make it easier to find important features and sections within the application.',
    'Add multilingual support to allow users to use the application in their preferred language following internationalization best practices.',
    'Create user onboarding emails to guide new users through the application and help them get started successfully with recommended initial actions.',
    'Improve search functionality to make it easier for users to find content and information within the application using advanced search algorithms.',
    'Setup logging system to track application events, errors, and user activities for debugging, monitoring, and security analysis purposes.',
    'Add export features to allow users to download their data in various formats for reporting and analysis needs.',
  ];

  // Project descriptions
  const projectDescriptions = [
    'Complete redesign of the company website with improved user experience and modern design.',
    'Development of a mobile application for iOS and Android platforms.',
    'Marketing campaign for the third quarter with focus on new customer acquisition.',
    'Migration of legacy database systems to modern cloud infrastructure.',
    'Implementation of a comprehensive customer onboarding system.',
  ];

  // Create 5 projects
  for (let i = 0; i < 5; i++) {
    // Select 4 users for this project (make sure no user is in multiple projects)
    const usersForProject = users.slice(i * 4, i * 4 + 4);
    const manager = usersForProject[0]; // The first user of each group will be the owner

    const project = await prisma.project.create({
      data: {
        id: generateUUIDv6(),
        name: projectNames[i],
        description: projectDescriptions[i],
        status: 'ACTIVE',
        ownerId: manager.id, // Set the manager as the owner
      },
    });

    console.log(`Created project: ${project.name}`);

    // Add users to the project (first as MANAGER, rest as WORKER)
    for (let j = 0; j < usersForProject.length; j++) {
      await prisma.projectMember.create({
        data: {
          id: generateUUIDv6(),
          userId: usersForProject[j].id,
          projectId: project.id,
          role: j === 0 ? 'MANAGER' : 'WORKER',
          assignedById: usersForProject[0].id, // Manager assigns members
        },
      });
    }

    console.log(`Added ${usersForProject.length} users to project ${project.name}`);

    // Create 20 tasks for this project
    // manager is already defined as usersForProject[0]
    for (let j = 0; j < 20; j++) {
      // Randomly select a different user from the project team to assign the task to
      const assignee = usersForProject[Math.floor(Math.random() * usersForProject.length)];

      // Random status
      const statuses: Array<'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'> = [
        'TODO',
        'IN_PROGRESS',
        'REVIEW',
        'DONE',
      ];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      // Random priority
      const priorities: Array<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'> = [
        'LOW',
        'MEDIUM',
        'HIGH',
        'URGENT',
      ];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];

      const task = await prisma.task.create({
        data: {
          id: generateUUIDv6(),
          title: taskTitles[Math.floor(Math.random() * taskTitles.length)],
          description: taskDescriptions[Math.floor(Math.random() * taskDescriptions.length)],
          status: status,
          priority: priority,
          creatorId: manager.id, // Manager creates the task
          projectId: project.id,
          assigneeId: assignee.id, // Assign to someone in the project
        },
      });

      console.log(`Created task: ${task.title} in project ${project.name}`);

      // Create 3-6 comments for this task
      const commentCount = Math.floor(Math.random() * 4) + 3; // 3 to 6 comments

      for (let k = 0; k < commentCount; k++) {
        // Randomly choose between manager and assignee to create the comment
        const author = Math.random() > 0.5 ? manager : assignee;

        const commentTexts = [
          'This task is progressing well and we should be able to complete it on time with current resources and timeline.',
          'I have encountered some issues with the implementation that need to be addressed before proceeding further with the solution.',
          'The requirements for this task have been updated and need to be reviewed for any necessary adjustments.',
          'I have completed the initial phase of this task and ready for the next steps in the process.',
          'We need to coordinate with other teams before moving forward with the implementation of this feature.',
          'The testing results show positive progress but more work is needed to finalize the solution.',
          'I am currently working on this task and should have updates available later today for review.',
          'The approach I am taking for this task seems to be working well with expected outcomes.',
          'There are some dependencies that need to be resolved before I can complete this particular task.',
          'I have identified some potential improvements that could be made to optimize the final solution further.',
          'The code review for this task is completed with only minor suggestions for improvement needed.',
          'I am experiencing some challenges with this task but expect to overcome them soon in development.',
        ];

        await prisma.comment.create({
          data: {
            id: generateUUIDv6(),
            content: commentTexts[Math.floor(Math.random() * commentTexts.length)],
            authorId: author.id,
            taskId: task.id,
          },
        });
      }

      console.log(`Added ${commentCount} comments to task ${task.title}`);
    }
  }

  console.log('Database seeding completed successfully!');
}

seedDatabase()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
