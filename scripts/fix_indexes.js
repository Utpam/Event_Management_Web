import { Client, Databases } from 'node-appwrite';
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

const missingIndexes = [
    {
        collectionId: 'club_requests',
        key: 'status',
        type: 'key',
        attributes: ['status']
    },
    {
        collectionId: 'club_requests',
        key: 'requestedBy',
        type: 'key',
        attributes: ['requestedBy']
    },
    {
        collectionId: 'clubs',
        key: 'approved',
        type: 'key',
        attributes: ['approved']
    },
    {
        collectionId: 'club_members',
        key: 'userId',
        type: 'key',
        attributes: ['userId']
    },
    {
        collectionId: 'club_members',
        key: 'clubId',
        type: 'key',
        attributes: ['clubId']
    },
    {
        collectionId: 'join_requests',
        key: 'clubId',
        type: 'key',
        attributes: ['clubId']
    },
    {
        collectionId: 'join_requests',
        key: 'status',
        type: 'key',
        attributes: ['status']
    },
    {
        collectionId: 'posts',
        key: 'clubId',
        type: 'key',
        attributes: ['clubId']
    },
    {
        collectionId: 'posts',
        key: 'status',
        type: 'key',
        attributes: ['status']
    },
    {
        collectionId: 'registrations',
        key: 'userId',
        type: 'key',
        attributes: ['userId']
    }
];

async function fixIndexes() {
    console.log(`Checking and fixing indexes for Database: ${dbId}`);

    for (const idx of missingIndexes) {
        try {
            console.log(`Creating index '${idx.key}' on '${idx.collectionId}'...`);
            await databases.createIndex(
                dbId,
                idx.collectionId,
                idx.key,
                idx.type,
                idx.attributes
            );
            console.log(`  + Index created successfully.`);
            // Wait for Appwrite to process
            await new Promise(r => setTimeout(r, 1000));
        } catch (error) {
            if (error.code === 409) {
                console.log(`  = Index '${idx.key}' already exists.`);
            } else {
                console.error(`  ! Failed to create index:`, error.message);
            }
        }
    }
    console.log('\n--- Index Fix Complete ---');
}

fixIndexes();
