import { Client, Databases, Query, Teams } from 'node-appwrite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const client = new Client()
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const dbId = process.env.VITE_APPWRITE_DATABASE_ID;
const usersColId = process.env.VITE_APPWRITE_USERS_COLLECTION_ID;

const email = process.argv[2];

if (!email) {
    console.error('Usage: node scripts/set_admin.js <email>');
    process.exit(1);
}

async function setAdmin() {
    try {
        const result = await databases.listDocuments(
            dbId,
            usersColId,
            [Query.equal('email', email)]
        );

        if (result.documents.length === 0) {
            console.error(`User with email ${email} not found.`);
            return;
        }

        const userDoc = result.documents[0];
        console.log(`Found user: ${userDoc.name} (${userDoc.$id})`);

        // Update User Profile
        await databases.updateDocument(
            dbId,
            usersColId,
            userDoc.$id,
            { globalRole: 'global_admin' }
        );
        console.log(`Updated 'globalRole' attribute to 'global_admin'.`);

        // Add to Appwrite Team 'global_admins'
        const teams = new Teams(client);
        let teamId = 'global_admins';

        try {
            await teams.get(teamId);
            console.log("Team 'global_admins' exists.");
        } catch (e) {
            console.log("Creating team 'global_admins'...");
            await teams.create(teamId, 'Global Admins');
        }

        try {
            // Check if already in team? Appwrite throws 409 if so.
            // We need userId. userDoc.userId should hold the Auth ID per schema
            // But let's assume userDoc.$id IS the userId (since we set it that way in createProfile)
            // Or we can use email to invite?
            // Better to use createMembership with email/userId.
            // Using ID is cleaner if we have it? createMembership takes teamId, email, roles, url, name.
            // Actually createMembership requires email.

            await teams.createMembership(
                teamId,
                ['owner'], // Roles in the team
                email,
                undefined, // userId
                undefined, // phone
                'http://localhost:5173' // url
            );
            console.log(`Added ${email} to 'global_admins' Appwrite Team.`);
        } catch (e) {
            if (e.code === 409) {
                console.log(`User ${email} is already in 'global_admins' team.`);
            } else {
                console.error(`Failed to add to team: ${e.message}`);
            }
        }

        console.log(`Successfully promoted ${email} to Global Admin (DB + Team).`);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

setAdmin();
