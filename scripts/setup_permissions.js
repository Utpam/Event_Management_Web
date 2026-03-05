import { Client, Databases, Permission, Role } from 'node-appwrite';
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

const collectionConfigs = [
    {
        id: process.env.VITE_APPWRITE_USERS_COLLECTION_ID,
        name: 'users',
        permissions: [
            Permission.read(Role.users()), // Authenticated users can read profiles (or use Role.any() if public)
            Permission.create(Role.users()), // User can create their profile (if not using function)
            Permission.update(Role.users()), // Users update themselves (Doc security handles specific check)
            Permission.delete(Role.users())
        ],
        documentSecurity: true
    },
    {
        id: process.env.VITE_APPWRITE_CLUB_REQUESTS_COLLECTION_ID,
        name: 'club_requests',
        permissions: [
            Permission.create(Role.users()),
            Permission.read(Role.team('global_admins')),
            Permission.update(Role.team('global_admins')),
            Permission.delete(Role.team('global_admins'))
        ],
        documentSecurity: true // User who created it can see it
    },
    {
        id: process.env.VITE_APPWRITE_CLUBS_COLLECTION_ID,
        name: 'clubs',
        permissions: [
            Permission.read(Role.any()), // Public
            Permission.create(Role.team('global_admins')), // Only admins/system create
            Permission.update(Role.team('global_admins')),
            Permission.delete(Role.team('global_admins'))
        ],
        documentSecurity: true // Club admins get write access via Doc Perms
    },
    {
        id: process.env.VITE_APPWRITE_CLUB_MEMBERS_COLLECTION_ID,
        name: 'club_members',
        permissions: [
            Permission.read(Role.any()), // Need to see members? specific logic maybe? keeping open for now
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users())
        ],
        documentSecurity: true
    },
    {
        id: process.env.VITE_APPWRITE_JOIN_REQUESTS_COLLECTION_ID,
        name: 'join_requests',
        permissions: [
            Permission.create(Role.users()),
            Permission.read(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users())
        ],
        documentSecurity: true
    },
    {
        id: process.env.VITE_APPWRITE_POSTS_COLLECTION_ID,
        name: 'posts',
        permissions: [
            Permission.read(Role.any()),
            Permission.create(Role.users()),
            Permission.update(Role.users()), // Doc security restricts to Creator/Admin
            Permission.delete(Role.users())
        ],
        documentSecurity: true
    },
    {
        id: process.env.VITE_APPWRITE_REGISTRATIONS_COLLECTION_ID,
        name: 'registrations',
        permissions: [
            Permission.create(Role.users()),
            Permission.read(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users())
        ],
        documentSecurity: true
    }
];

async function setupPermissions() {
    console.log(`Configuring permissions for Database: ${dbId}`);

    for (const config of collectionConfigs) {
        if (!config.id || config.id === 'undefined') {
            console.error(`Skipping ${config.name}: ID not found in env.`);
            continue;
        }

        try {
            console.log(`Updating ${config.name} (${config.id})...`);
            await databases.updateCollection(
                dbId,
                config.id,
                config.name,
                config.permissions,
                config.documentSecurity
            );
            console.log(`  + Permissions updated for ${config.name}`);
        } catch (error) {
            console.error(`  ! Failed to update ${config.name}:`, error.message);
        }
        await new Promise(r => setTimeout(r, 500));
    }
    console.log('\n--- Permissions Setup Complete ---');
}

setupPermissions();
