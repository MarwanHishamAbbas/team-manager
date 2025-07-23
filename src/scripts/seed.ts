import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { config } from "dotenv";
import {
  users,
  teams,
  teamMembers,
  type NewUser,
  type NewTeam,
  type NewTeamMember,
} from "../db/schema";

// Load environment variables from .env file
config();

// Database connection (adjust connection string as needed)
const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://username:password@localhost:5432/team_management";

if (!process.env.DATABASE_URL) {
  console.log("⚠️  DATABASE_URL not found in environment variables");
  console.log(
    "💡 Please set your DATABASE_URL or update the connection string in the script"
  );
  console.log(
    '   Example: export DATABASE_URL="postgresql://username:password@localhost:5432/dbname"'
  );
}

const sql = postgres(connectionString);
const db = drizzle(sql);

// Helper function to generate realistic names
const firstNames = [
  "Sarah",
  "Michael",
  "Emily",
  "David",
  "Lisa",
  "Alex",
  "Jessica",
  "Ryan",
  "Priya",
  "James",
  "Maya",
  "Carlos",
  "Sophie",
  "Lucas",
  "Zoe",
  "Kevin",
  "Rachel",
  "Tom",
  "Anna",
  "Marcus",
  "Nina",
  "Chris",
  "Samantha",
  "Oliver",
  "Isabella",
  "Ethan",
  "Mia",
  "Daniel",
  "Emma",
  "Noah",
  "Olivia",
  "Liam",
  "Ava",
  "William",
  "Sophia",
  "Mason",
  "Charlotte",
  "Logan",
  "Amelia",
  "Lucas",
  "Harper",
  "Alexander",
  "Evelyn",
  "Henry",
  "Abigail",
  "Jacob",
  "Emily",
  "Michael",
  "Elizabeth",
  "Benjamin",
  "Mila",
  "Elijah",
  "Ella",
  "James",
  "Avery",
  "Aiden",
  "Sofia",
  "Matthew",
  "Camila",
  "Jackson",
  "Aria",
  "Samuel",
  "Scarlett",
  "Sebastian",
  "Victoria",
  "David",
  "Madison",
  "Carter",
  "Luna",
  "Wyatt",
  "Grace",
  "Jayden",
  "Chloe",
  "John",
  "Penelope",
  "Owen",
  "Layla",
  "Dylan",
  "Riley",
  "Luke",
  "Zoey",
  "Gabriel",
  "Nora",
  "Anthony",
  "Lily",
  "Isaac",
  "Eleanor",
  "Grayson",
  "Hannah",
  "Jack",
  "Lillian",
  "Julian",
  "Addison",
  "Levi",
  "Aubrey",
  "Christopher",
  "Ellie",
];

const lastNames = [
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Perez",
  "Thompson",
  "White",
  "Harris",
  "Sanchez",
  "Clark",
  "Ramirez",
  "Lewis",
  "Robinson",
  "Walker",
  "Young",
  "Allen",
  "King",
  "Wright",
  "Scott",
  "Torres",
  "Nguyen",
  "Hill",
  "Flores",
  "Green",
  "Adams",
  "Nelson",
  "Baker",
  "Hall",
  "Rivera",
  "Campbell",
  "Mitchell",
  "Carter",
  "Roberts",
  "Gomez",
  "Phillips",
  "Evans",
  "Turner",
  "Diaz",
  "Parker",
  "Cruz",
  "Edwards",
  "Collins",
  "Reyes",
  "Stewart",
  "Morris",
  "Morales",
  "Murphy",
  "Cook",
  "Rogers",
  "Gutierrez",
  "Ortiz",
  "Morgan",
  "Cooper",
  "Peterson",
  "Bailey",
  "Reed",
  "Kelly",
  "Howard",
  "Ramos",
  "Kim",
  "Cox",
  "Ward",
  "Richardson",
  "Watson",
  "Brooks",
  "Chavez",
  "Wood",
  "James",
  "Bennett",
  "Gray",
  "Mendoza",
  "Ruiz",
  "Hughes",
  "Price",
];

const engineeringRoles = [
  "Senior Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Software Engineer",
  "Lead Developer",
  "Principal Engineer",
  "Software Architect",
  "Mobile Developer",
  "Web Developer",
  "Systems Engineer",
  "Platform Engineer",
  "API Developer",
  "Database Developer",
  "JavaScript Developer",
  "Python Developer",
  "Java Developer",
  "React Developer",
  "Node.js Developer",
  "Go Developer",
];

const creativeRoles = [
  "Content Creator",
  "Graphic Designer",
  "Social Media Manager",
  "Video Editor",
  "Copywriter",
  "Brand Designer",
  "Motion Graphics Designer",
  "Illustrator",
  "Art Director",
  "Creative Writer",
  "Content Strategist",
  "Visual Designer",
  "UX Writer",
  "Marketing Designer",
  "Digital Artist",
  "Photographer",
  "Content Producer",
  "Social Media Coordinator",
  "Brand Manager",
  "Creative Coordinator",
];

const productRoles = [
  "Product Analyst",
  "Business Analyst",
  "Product Designer",
  "Technical Writer",
  "Product Owner",
  "Product Coordinator",
  "Business Intelligence Analyst",
  "Data Analyst",
  "Market Research Analyst",
  "Product Marketing Manager",
  "Requirements Analyst",
  "System Analyst",
  "Quality Assurance Analyst",
  "Product Specialist",
  "Business Consultant",
  "Process Analyst",
  "Strategy Analyst",
  "Operations Analyst",
  "Financial Analyst",
  "Research Analyst",
];

const devopsRoles = [
  "DevOps Engineer",
  "Site Reliability Engineer",
  "Cloud Architect",
  "Security Engineer",
  "Infrastructure Engineer",
  "Platform Engineer",
  "Build Engineer",
  "Release Engineer",
  "Cloud Engineer",
  "System Administrator",
  "Network Engineer",
  "Monitoring Engineer",
  "Automation Engineer",
  "CI/CD Engineer",
  "Kubernetes Engineer",
  "Docker Engineer",
  "AWS Engineer",
  "Azure Engineer",
  "GCP Engineer",
  "Linux Engineer",
];

const designRoles = [
  "UX Designer",
  "UI Designer",
  "UX Researcher",
  "Interaction Designer",
  "Product Designer",
  "Visual Designer",
  "Service Designer",
  "Design Systems Designer",
  "User Researcher",
  "Information Architect",
  "Usability Analyst",
  "Design Researcher",
  "Experience Designer",
  "Interface Designer",
  "Design Strategist",
  "Creative Designer",
  "Digital Designer",
  "Web Designer",
  "Mobile Designer",
  "Design Consultant",
];

const marketingRoles = [
  "Marketing Manager",
  "Digital Marketing Specialist",
  "SEO Specialist",
  "PPC Specialist",
  "Email Marketing Manager",
  "Growth Marketing Manager",
  "Performance Marketing Manager",
  "Brand Marketing Manager",
  "Content Marketing Manager",
  "Social Media Specialist",
  "Marketing Analyst",
  "Campaign Manager",
  "Marketing Coordinator",
  "Demand Generation Manager",
  "Lead Generation Specialist",
  "Conversion Rate Optimizer",
  "Marketing Automation Specialist",
  "Influencer Marketing Manager",
  "Affiliate Marketing Manager",
  "PR Specialist",
];

const salesRoles = [
  "Sales Representative",
  "Account Executive",
  "Sales Manager",
  "Business Development Manager",
  "Sales Coordinator",
  "Inside Sales Representative",
  "Outside Sales Representative",
  "Key Account Manager",
  "Territory Manager",
  "Regional Sales Manager",
  "Sales Analyst",
  "Customer Success Manager",
  "Account Manager",
  "Sales Operations Manager",
  "Lead Qualification Specialist",
  "Sales Development Representative",
  "Enterprise Sales Manager",
  "Channel Sales Manager",
  "Partner Manager",
  "Revenue Operations Manager",
];

const hrRoles = [
  "HR Generalist",
  "Recruiter",
  "Talent Acquisition Specialist",
  "HR Coordinator",
  "People Operations Manager",
  "Employee Relations Specialist",
  "Compensation Analyst",
  "Benefits Administrator",
  "Training Coordinator",
  "HR Business Partner",
  "Organizational Development Specialist",
  "Performance Management Specialist",
  "Diversity & Inclusion Specialist",
  "HR Information Systems Analyst",
  "Payroll Specialist",
  "Learning & Development Manager",
  "Culture & Engagement Manager",
  "HR Data Analyst",
  "Employee Experience Manager",
  "Workforce Planning Analyst",
];

const financeRoles = [
  "Financial Analyst",
  "Accountant",
  "Senior Accountant",
  "Accounting Manager",
  "Finance Manager",
  "Controller",
  "Budget Analyst",
  "Cost Analyst",
  "Revenue Analyst",
  "Investment Analyst",
  "Risk Analyst",
  "Credit Analyst",
  "Treasury Analyst",
  "Tax Specialist",
  "Audit Specialist",
  "Compliance Officer",
  "Financial Planning Analyst",
  "Business Finance Partner",
  "Pricing Analyst",
  "FP&A Analyst",
];

const operationsRoles = [
  "Operations Manager",
  "Operations Coordinator",
  "Process Manager",
  "Project Manager",
  "Program Manager",
  "Operations Analyst",
  "Supply Chain Manager",
  "Logistics Coordinator",
  "Facilities Manager",
  "Office Manager",
  "Executive Assistant",
  "Administrative Assistant",
  "Operations Specialist",
  "Workflow Manager",
  "Efficiency Analyst",
  "Quality Manager",
  "Compliance Manager",
  "Risk Manager",
  "Vendor Manager",
  "Contract Manager",
];

// Function to generate random user data
function generateUsers(count: number): NewUser[] {
  const users: NewUser[] = [];
  const usedEmails = new Set<string>();

  // Team leads (first 30 users)
  const leadRoles = [
    "Frontend Engineering Manager",
    "Backend Engineering Manager",
    "Full Stack Development Lead",
    "Mobile Development Lead",
    "Platform Engineering Lead",
    "Creative Design Director",
    "Brand Marketing Director",
    "Content Creation Lead",
    "Video Production Manager",
    "Graphic Design Manager",
    "Senior Product Manager",
    "Product Analytics Lead",
    "User Research Manager",
    "Product Design Manager",
    "Technical Writing Manager",
    "DevOps Infrastructure Lead",
    "Site Reliability Manager",
    "Cloud Security Manager",
    "Network Operations Manager",
    "System Administration Lead",
    "UX Research Director",
    "UI Design Manager",
    "Design Systems Lead",
    "Interaction Design Lead",
    "Service Design Manager",
    "Digital Marketing Director",
    "Performance Marketing Manager",
    "SEO & Content Manager",
    "Social Media Manager",
    "Email Marketing Manager",
  ];

  for (let i = 0; i < 30; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`;

    if (!usedEmails.has(email)) {
      users.push({
        name: `${firstName} ${lastName}`,
        email,
        role: leadRoles[i],
      });
      usedEmails.add(email);
    } else {
      // If email collision, try with a number
      const emailWithNumber = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(
        Math.random() * 100
      )}@company.com`;
      users.push({
        name: `${firstName} ${lastName}`,
        email: emailWithNumber,
        role: leadRoles[i],
      });
      usedEmails.add(emailWithNumber);
    }
  }

  // Generate remaining users
  const allRoles = [
    ...engineeringRoles,
    ...creativeRoles,
    ...productRoles,
    ...devopsRoles,
    ...designRoles,
    ...marketingRoles,
    ...salesRoles,
    ...hrRoles,
    ...financeRoles,
    ...operationsRoles,
  ];

  while (users.length < count) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(
      Math.random() * 100
    )}@company.com`;

    if (!usedEmails.has(email)) {
      const role = allRoles[Math.floor(Math.random() * allRoles.length)];
      users.push({
        name: `${firstName} ${lastName}`,
        email,
        role,
      });
      usedEmails.add(email);
    }
  }

  return users;
}

async function seedDatabase() {
  try {
    console.log(
      "🌱 Starting database seeding with 200+ users across 30 teams..."
    );

    // Clear existing data (in reverse order due to foreign key constraints)
    console.log("🧹 Clearing existing data...");
    await db.delete(teamMembers);
    await db.delete(teams);
    await db.delete(users);

    // Generate and insert users
    console.log("👥 Generating and inserting users...");
    const seedUsers = generateUsers(200); // Generate 200 users for 30 teams
    const insertedUsers = await db.insert(users).values(seedUsers).returning();
    console.log(`✅ Inserted ${insertedUsers.length} users`);

    // Create teams with team leads
    console.log("🏢 Creating teams...");
    const teamNames = [
      "Frontend Engineering",
      "Backend Engineering",
      "Full Stack Development",
      "Mobile Development",
      "Platform Engineering",
      "Creative Design",
      "Brand Marketing",
      "Content Creation",
      "Video Production",
      "Graphic Design",
      "Product Management",
      "Product Analytics",
      "User Research",
      "Product Design",
      "Technical Writing",
      "DevOps Infrastructure",
      "Site Reliability",
      "Cloud Security",
      "Network Operations",
      "System Administration",
      "UX Research",
      "UI Design",
      "Design Systems",
      "Interaction Design",
      "Service Design",
      "Digital Marketing",
      "Performance Marketing",
      "SEO & Content",
      "Social Media",
      "Email Marketing",
    ];

    const teamData: NewTeam[] = teamNames.map((name, index) => ({
      name,
      teamLeadId: insertedUsers[index].id,
    }));

    const insertedTeams = await db.insert(teams).values(teamData).returning();
    console.log(`✅ Created ${insertedTeams.length} teams`);

    // Distribute remaining users among teams
    console.log("👨‍💼 Adding team members...");
    const membershipData: NewTeamMember[] = [];
    const availableUsers = insertedUsers.slice(10); // Skip the first 10 (team leads)

    // Shuffle users for random distribution
    const shuffledUsers = [...availableUsers].sort(() => Math.random() - 0.5);

    // Distribute users among teams (roughly equal distribution)
    const usersPerTeam = Math.floor(
      shuffledUsers.length / insertedTeams.length
    );
    let userIndex = 0;

    insertedTeams.forEach((team, teamIndex) => {
      const teamSize =
        teamIndex < shuffledUsers.length % insertedTeams.length
          ? usersPerTeam + 1
          : usersPerTeam;

      for (let i = 0; i < teamSize && userIndex < shuffledUsers.length; i++) {
        membershipData.push({
          teamId: team.id,
          userId: shuffledUsers[userIndex].id,
        });
        userIndex++;
      }
    });

    // Add any remaining users to random teams
    while (userIndex < shuffledUsers.length) {
      const randomTeam =
        insertedTeams[Math.floor(Math.random() * insertedTeams.length)];
      membershipData.push({
        teamId: randomTeam.id,
        userId: shuffledUsers[userIndex].id,
      });
      userIndex++;
    }

    await db.insert(teamMembers).values(membershipData);
    console.log(`✅ Added ${membershipData.length} team memberships`);

    // Display summary
    console.log("\n📊 Seeding Summary:");
    console.log("===================");
    console.log(`👥 Users: ${insertedUsers.length}`);
    console.log(`🏢 Teams: ${insertedTeams.length}`);
    console.log(`🤝 Memberships: ${membershipData.length}`);

    console.log("\n🏢 Teams Created:");
    insertedTeams.forEach((team) => {
      const leadUser = insertedUsers.find((u) => u.id === team.teamLeadId);
      const memberCount = membershipData.filter(
        (m) => m.teamId === team.id
      ).length;
      console.log(
        `  • ${team.name} (Lead: ${leadUser?.name} - ${leadUser?.role}) - ${memberCount} members`
      );
    });

    // Display role distribution
    console.log("\n📈 Role Distribution:");
    const roleCount = insertedUsers.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(roleCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .forEach(([role, count]) => {
        console.log(`  • ${role}: ${count}`);
      });

    console.log("\n🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await sql.end();
  }
}

// Run the seed script
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log("✅ Seed script completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Seed script failed:", error);
      process.exit(1);
    });
}

export { seedDatabase };
