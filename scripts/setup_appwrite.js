import { Client, Databases, ID, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from parent directory
dotenv.config({ path: path.join(__dirname, '../.env') });

const client = new Client()
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const dbId = process.env.VITE_APPWRITE_DATABASE_ID;

const collections = [
    {
        name: 'users',
        id: 'users', // Try to use this ID
        attributes: [
            { key: 'userId', type: 'string', size: 255, required: true },
            { key: 'name', type: 'string', size: 255, required: true },
            { key: 'email', type: 'string', size: 255, required: true },
            { key: 'globalRole', type: 'string', size: 50, required: false, default: 'user' },
        ],
        indexes: [
            { key: 'userId', type: 'unique', attributes: ['userId'] }
        ]
    },
    {
        name: 'club_requests',
        id: 'club_requests',
        attributes: [
            { key: 'requestedBy', type: 'string', size: 255, required: true },
            { key: 'clubName', type: 'string', size: 255, required: true },
            { key: 'description', type: 'string', size: 1000, required: true },
            { key: 'status', type: 'string', size: 50, required: false, default: 'pending' },
            { key: 'reviewedBy', type: 'string', size: 255, required: false },
        ]
    },
    {
        name: 'clubs',
        id: 'clubs',
        attributes: [
            { key: 'name', type: 'string', size: 255, required: true },
            { key: 'description', type: 'string', size: 5000, required: true },
            { key: 'createdBy', type: 'string', size: 255, required: true },
            { key: 'approved', type: 'boolean', required: false, default: true },
            { key: 'ownerId', type: 'string', size: 255, required: true },
        ]
    },
    {
        name: 'club_members',
        id: 'club_members',
        attributes: [
            { key: 'clubId', type: 'string', size: 255, required: true },
            { key: 'userId', type: 'string', size: 255, required: true },
            { key: 'role', type: 'string', size: 50, required: true },
            { key: 'joinedAt', type: 'datetime', required: false },
        ],
        indexes: [
            { key: 'clubUser', type: 'unique', attributes: ['clubId', 'userId'] }
        ]
    },
    {
        name: 'join_requests',
        id: 'join_requests',
        attributes: [
            { key: 'clubId', type: 'string', size: 255, required: true },
            { key: 'userId', type: 'string', size: 255, required: true },
            { key: 'status', type: 'string', size: 50, required: false, default: 'pending' },
        ]
    },
    {
        name: 'posts',
        id: 'posts',
        attributes: [
            { key: 'clubId', type: 'string', size: 255, required: true },
            { key: 'title', type: 'string', size: 255, required: true },
            { key: 'content', type: 'string', size: 10000, required: true }, // RTE HTML
            { key: 'status', type: 'string', size: 50, required: false, default: 'pending' },
            { key: 'result', type: 'string', size: 255, required: false }, // Renamed from media to result/featuredImage if needed, keeping simple
            { key: 'media', type: 'string', size: 255, required: false },
            { key: 'createdBy', type: 'string', size: 255, required: true },
        ]
    },
    {
        name: 'registrations',
        id: 'registrations',
        attributes: [
            { key: 'userId', type: 'string', size: 255, required: true },
            { key: 'postId', type: 'string', size: 255, required: true },
            { key: 'registeredAt', type: 'datetime', required: false },
        ],
        indexes: [
            { key: 'userPost', type: 'unique', attributes: ['userId', 'postId'] }
        ]
    }
];

async function setup() {
    console.log(`Checking Database: ${dbId}`);
    try {
        await databases.get(dbId);
        console.log('Database exists.');
    } catch (error) {
        console.error('Database not found or error access:', error.message);
        return;
    }

    for (const col of collections) {
        let collectionId = col.id;
        try {
            console.log(`Checking collection: ${col.name}`);
            // Check if collection exists by ID (simplest)
            await databases.getCollection(dbId, collectionId);
            console.log(`Collection ${col.name} (${collectionId}) exists.`);
        } catch (error) {
            if (error.code === 404) {
                console.log(`Creating collection: ${col.name}`);
                try {
                    const newCol = await databases.createCollection(dbId, collectionId, col.name);
                    collectionId = newCol.$id;
                    console.log(`Created collection: ${col.name} (${collectionId})`);
                } catch (createError) {
                    console.error(`Failed to create collection ${col.name}:`, createError);
                    continue;
                }
            } else {
                console.error(`Error checking collection ${col.name}:`, error);
                continue;
            }
        }

        // Create Attributes
        console.log(`Checking attributes for ${col.name}...`);
        // We catch errors individually because attribute might exist
        for (const attr of col.attributes) {
            try {
                if (attr.type === 'string') {
                    await databases.createStringAttribute(dbId, collectionId, attr.key, attr.size, attr.required, attr.default);
                } else if (attr.type === 'boolean') {
                    await databases.createBooleanAttribute(dbId, collectionId, attr.key, attr.required, attr.default);
                } else if (attr.type === 'datetime') {
                    await databases.createDatetimeAttribute(dbId, collectionId, attr.key, attr.required, attr.default);
                }
                // Add integer/float/etc if needed
                console.log(`  + Attribute ${attr.key} created/exists.`);
            } catch (err) {
                // 409 means attribute already exists
                if (err.code !== 409) {
                    console.error(`  ! Failed to create attribute ${attr.key}:`, err.message);
                } else {
                    console.log(`  = Attribute ${attr.key} already exists.`);
                }
            }
            // Wait a bit because Appwrite attribute creation is async and might look busy
            await new Promise(r => setTimeout(r, 500));
        }

        // Create Indexes
        if (col.indexes) {
            for (const idx of col.indexes) {
                try {
                    await databases.createIndex(dbId, collectionId, idx.key, idx.type, idx.attributes);
                    console.log(`  + Index ${idx.key} created.`);
                } catch (err) {
                    if (err.code !== 409) {
                        console.error(`  ! Failed to create index ${idx.key}:`, err.message);
                    } else {
                        console.log(`  = Index ${idx.key} already exists.`);
                    }
                }
                await new Promise(r => setTimeout(r, 500));
            }
        }
    }

    console.log('\n--- Setup Complete ---');
    console.log('Update your config/env with these Collection IDs:');
    collections.forEach(c => {
        console.log(`${c.name.toUpperCase()}_COLLECTION_ID=${c.id}`);
    });
}

setup();
