import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  users,
  teams,
  teamMembers,
  type NewUser,
  type NewTeam,
  type NewTeamMember,
} from "../db/schema";

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

// Sample users with realistic roles
const seedUsers: NewUser[] = [
  // Team Leads
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    role: "Engineering Manager",
  },
  {
    name: "Michael Chen",
    email: "michael.chen@company.com",
    role: "Creative Director",
  },
  {
    name: "Emily Rodriguez",
    email: "emily.rodriguez@company.com",
    role: "Product Manager",
  },
  { name: "David Kim", email: "david.kim@company.com", role: "DevOps Lead" },
  {
    name: "Lisa Thompson",
    email: "lisa.thompson@company.com",
    role: "UX Design Lead",
  },

  // Engineering Team Members
  {
    name: "Alex Parker",
    email: "alex.parker@company.com",
    role: "Senior Software Engineer",
  },
  {
    name: "Jessica Wu",
    email: "jessica.wu@company.com",
    role: "Frontend Developer",
  },
  {
    name: "Ryan Mitchell",
    email: "ryan.mitchell@company.com",
    role: "Backend Developer",
  },
  {
    name: "Priya Sharma",
    email: "priya.sharma@company.com",
    role: "Full Stack Developer",
  },
  {
    name: "James Wilson",
    email: "james.wilson@company.com",
    role: "Software Engineer",
  },

  // Creative Team Members
  {
    name: "Maya Patel",
    email: "maya.patel@company.com",
    role: "Content Creator",
  },
  {
    name: "Carlos Martinez",
    email: "carlos.martinez@company.com",
    role: "Graphic Designer",
  },
  {
    name: "Sophie Brown",
    email: "sophie.brown@company.com",
    role: "Social Media Manager",
  },
  {
    name: "Lucas Anderson",
    email: "lucas.anderson@company.com",
    role: "Video Editor",
  },
  { name: "Zoe Taylor", email: "zoe.taylor@company.com", role: "Copywriter" },

  // Product Team Members
  {
    name: "Kevin Lee",
    email: "kevin.lee@company.com",
    role: "Product Analyst",
  },
  {
    name: "Rachel Green",
    email: "rachel.green@company.com",
    role: "Business Analyst",
  },
  {
    name: "Tom Davis",
    email: "tom.davis@company.com",
    role: "Product Designer",
  },
  {
    name: "Anna Kowalski",
    email: "anna.kowalski@company.com",
    role: "Technical Writer",
  },

  // DevOps Team Members
  {
    name: "Marcus Johnson",
    email: "marcus.johnson@company.com",
    role: "DevOps Engineer",
  },
  {
    name: "Nina Petrov",
    email: "nina.petrov@company.com",
    role: "Site Reliability Engineer",
  },
  {
    name: "Chris Wong",
    email: "chris.wong@company.com",
    role: "Cloud Architect",
  },
  {
    name: "Samantha Clark",
    email: "samantha.clark@company.com",
    role: "Security Engineer",
  },

  // UX Design Team Members
  {
    name: "Oliver Jackson",
    email: "oliver.jackson@company.com",
    role: "UX Designer",
  },
  {
    name: "Isabella Garcia",
    email: "isabella.garcia@company.com",
    role: "UI Designer",
  },
  {
    name: "Ethan Moore",
    email: "ethan.moore@company.com",
    role: "UX Researcher",
  },
  {
    name: "Mia Robinson",
    email: "mia.robinson@company.com",
    role: "Interaction Designer",
  },
];

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Clear existing data (in reverse order due to foreign key constraints)
    console.log("🧹 Clearing existing data...");
    await db.delete(teamMembers);
    await db.delete(teams);
    await db.delete(users);

    // Insert users
    console.log("👥 Inserting users...");
    const insertedUsers = await db.insert(users).values(seedUsers).returning();
    console.log(`✅ Inserted ${insertedUsers.length} users`);

    // Create teams with team leads
    console.log("🏢 Creating teams...");
    const teamData: NewTeam[] = [
      {
        name: "Engineering Team",
        teamLeadId: insertedUsers[0].id, // Sarah Johnson - Engineering Manager
      },
      {
        name: "Creative Team",
        teamLeadId: insertedUsers[1].id, // Michael Chen - Creative Director
      },
      {
        name: "Product Team",
        teamLeadId: insertedUsers[2].id, // Emily Rodriguez - Product Manager
      },
      {
        name: "DevOps Team",
        teamLeadId: insertedUsers[3].id, // David Kim - DevOps Lead
      },
      {
        name: "UX Design Team",
        teamLeadId: insertedUsers[4].id, // Lisa Thompson - UX Design Lead
      },
    ];

    const insertedTeams = await db.insert(teams).values(teamData).returning();
    console.log(`✅ Created ${insertedTeams.length} teams`);

    // Add team members
    console.log("👨‍💼 Adding team members...");
    const membershipData: NewTeamMember[] = [
      // Engineering Team Members (indices 5-9)
      { teamId: insertedTeams[0].id, userId: insertedUsers[5].id }, // Alex Parker
      { teamId: insertedTeams[0].id, userId: insertedUsers[6].id }, // Jessica Wu
      { teamId: insertedTeams[0].id, userId: insertedUsers[7].id }, // Ryan Mitchell
      { teamId: insertedTeams[0].id, userId: insertedUsers[8].id }, // Priya Sharma
      { teamId: insertedTeams[0].id, userId: insertedUsers[9].id }, // James Wilson

      // Creative Team Members (indices 10-14)
      { teamId: insertedTeams[1].id, userId: insertedUsers[10].id }, // Maya Patel
      { teamId: insertedTeams[1].id, userId: insertedUsers[11].id }, // Carlos Martinez
      { teamId: insertedTeams[1].id, userId: insertedUsers[12].id }, // Sophie Brown
      { teamId: insertedTeams[1].id, userId: insertedUsers[13].id }, // Lucas Anderson
      { teamId: insertedTeams[1].id, userId: insertedUsers[14].id }, // Zoe Taylor

      // Product Team Members (indices 15-18)
      { teamId: insertedTeams[2].id, userId: insertedUsers[15].id }, // Kevin Lee
      { teamId: insertedTeams[2].id, userId: insertedUsers[16].id }, // Rachel Green
      { teamId: insertedTeams[2].id, userId: insertedUsers[17].id }, // Tom Davis
      { teamId: insertedTeams[2].id, userId: insertedUsers[18].id }, // Anna Kowalski

      // DevOps Team Members (indices 19-22)
      { teamId: insertedTeams[3].id, userId: insertedUsers[19].id }, // Marcus Johnson
      { teamId: insertedTeams[3].id, userId: insertedUsers[20].id }, // Nina Petrov
      { teamId: insertedTeams[3].id, userId: insertedUsers[21].id }, // Chris Wong
      { teamId: insertedTeams[3].id, userId: insertedUsers[22].id }, // Samantha Clark

      // UX Design Team Members (indices 23-26)
      { teamId: insertedTeams[4].id, userId: insertedUsers[23].id }, // Oliver Jackson
      { teamId: insertedTeams[4].id, userId: insertedUsers[24].id }, // Isabella Garcia
      { teamId: insertedTeams[4].id, userId: insertedUsers[25].id }, // Ethan Moore
      { teamId: insertedTeams[4].id, userId: insertedUsers[26].id }, // Mia Robinson
    ];

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
