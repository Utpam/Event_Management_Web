import { Client, Databases, Storage, Query, ID, Teams } from "appwrite";
import { config } from '../src/config/config';

export class DbService {
    client = new Client();
    databases;
    storage;
    teams;

    constructor() {
        this.client
            .setEndpoint(config.appwriteEndpoint)
            .setProject(config.projectId);

        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
        this.teams = new Teams(this.client);
    }

    // --- Users ---
    async getUserProfile(userId) {
        try {
            return await this.databases.getDocument(
                config.databaseId,
                config.usersCollectionId,
                userId
            );
        } catch (error) {
            // If 404, return null (profile doesn't exist yet)
            if (error.code === 404) return null;
            throw error;
        }
    }

    async createUserProfile(userId, name, email) {
        return await this.databases.createDocument(
            config.databaseId,
            config.usersCollectionId,
            userId, // Use userId as document ID
            {
                userId,
                name,
                email,
                globalRole: 'user' // Default
            }
        );
    }

    async getUserMemberships(userId) {
        return await this.databases.listDocuments(
            config.databaseId,
            config.clubMembersCollectionId,
            [Query.equal('userId', userId)]
        );
    }

    // --- Clubs ---
    async createClubRequest(data) {
        try {
            return await this.databases.createDocument(
                config.databaseId,
                config.clubRequestsCollectionId,
                ID.unique(),
                {
                    ...data,
                    status: 'pending',
                }
            );
        } catch (error) {
            console.error("Failed to create club request", error);
            throw error;
        }
    }

    async deleteClubRequest(requestId) {
        return await this.databases.deleteDocument(
            config.databaseId,
            config.clubRequestsCollectionId,
            requestId
        );
    }

    async getClubRequests(status = 'pending') {
        return await this.databases.listDocuments(
            config.databaseId,
            config.clubRequestsCollectionId,
            [Query.equal('status', status)]
        );
    }

    async getUserClubRequests(userId) {
        return await this.databases.listDocuments(
            config.databaseId,
            config.clubRequestsCollectionId,
            [Query.equal('requestedBy', userId)]
        );
    }

    async updateClubRequestStatus(requestId, status, reviewedBy) {
        return await this.databases.updateDocument(
            config.databaseId,
            config.clubRequestsCollectionId,
            requestId,
            {
                status,
                reviewedBy
            }
        );
    }

    async createClub(data) {
        return await this.databases.createDocument(
            config.databaseId,
            config.clubsCollectionId,
            ID.unique(),
            {
                ...data,
                approved: true,
                linkedEvents: 0
                // ownerId provided in data
            }
        );
    }

    async getClubs() {
        return await this.databases.listDocuments(
            config.databaseId,
            config.clubsCollectionId,
            [Query.equal('approved', true)]
        );
    }

    async getClub(clubId) {
        return await this.databases.getDocument(
            config.databaseId,
            config.clubsCollectionId,
            clubId
        );
    }

    async createClubMember(clubId, userId, role) {
        // Check if already exists? (Index handles unique)
        return await this.databases.createDocument(
            config.databaseId,
            config.clubMembersCollectionId,
            ID.unique(),
            {
                clubId,
                userId,
                role,
                joinedAt: new Date().toISOString()
            }
        );
    }

    async getClubMembers(clubId) {
        return await this.databases.listDocuments(
            config.databaseId,
            config.clubMembersCollectionId,
            [Query.equal('clubId', clubId)]
        );
    }

    // --- Teams (Permissions) ---
    async createClubTeam(clubId, name) {
        // Create a team for the club
        return await this.teams.create(
            `club-${clubId}`, // Team ID
            name
        );
    }

    async addTeamMember(teamId, email, roles = [], url = 'http://localhost:5173') {
        // Appwrite Teams Add Member (Invite)
        return await this.teams.createMembership(
            teamId,
            roles,
            email,
            undefined, // userId (optional)
            undefined, // phone
            url, // redirect url
            undefined // name
        );
    }

    // --- Posts ---
    async getPosts(clubId) {
        const queries = [Query.equal('status', 'approved')];
        if (clubId) {
            queries.push(Query.equal('clubId', clubId));
        }
        return await this.databases.listDocuments(
            config.databaseId,
            config.postsCollectionId,
            queries
        );
    }

    // Get Pending posts for a club (Club Admin view)
    async getClubPosts(clubId, status = null) {
        const queries = [Query.equal('clubId', clubId)];
        if (status) {
            queries.push(Query.equal('status', status));
        }
        return await this.databases.listDocuments(
            config.databaseId,
            config.postsCollectionId,
            queries
        );
    }

    async createPost(data) {
        return await this.databases.createDocument(
            config.databaseId,
            config.postsCollectionId,
            ID.unique(),
            {
                ...data,
                status: 'pending'
            }
        );
    }

    async updatePostStatus(postId, status) {
        return await this.databases.updateDocument(
            config.databaseId,
            config.postsCollectionId,
            postId,
            { status }
        );
    }

    // --- Registrations ---
    async registerEvent(userId, postId) {
        return await this.databases.createDocument(
            config.databaseId,
            config.registrationsCollectionId,
            ID.unique(),
            {
                userId,
                postId,
                registeredAt: new Date().toISOString()
            }
        );
    }

    async getRegistrations(userId) {
        return await this.databases.listDocuments(
            config.databaseId,
            config.registrationsCollectionId,
            [Query.equal('userId', userId)]
        );
    }

    async checkRegistration(userId, postId) {
        const result = await this.databases.listDocuments(
            config.databaseId,
            config.registrationsCollectionId,
            [
                Query.equal('userId', userId),
                Query.equal('postId', postId)
            ]
        );
        return result.documents.length > 0;
    }

    // --- Approvals ---
    async createJoinRequest(clubId, userId) {
        return await this.databases.createDocument(
            config.databaseId,
            config.joinRequestsCollectionId,
            ID.unique(),
            {
                clubId,
                userId,
                status: 'pending'
            }
        );
    }

    async getJoinRequests(clubId, status = 'pending') {
        return await this.databases.listDocuments(
            config.databaseId,
            config.joinRequestsCollectionId,
            [
                Query.equal('clubId', clubId),
                Query.equal('status', status)
            ]
        );
    }

    async updateJoinRequestStatus(requestId, status) {
        return await this.databases.updateDocument(
            config.databaseId,
            config.joinRequestsCollectionId,
            requestId,
            { status }
        );
    }

    // --- Storage ---
    async uploadFile(file) {
        try {
            return await this.storage.createFile(
                config.bucketId,
                ID.unique(),
                file
            );
        } catch (error) {
            console.error("Appwrite service :: uploadFile :: error", error);
            return false;
        }
    }

    async deleteFile(fileId) {
        try {
            await this.storage.deleteFile(
                config.bucketId,
                fileId
            );
            return true;
        } catch (error) {
            console.error("Appwrite service :: deleteFile :: error", error);
            return false;
        }
    }

    getFilePreview(fileId) {
        return this.storage.getFilePreview(
            config.bucketId,
            fileId
        );
    }
}

const dbService = new DbService();
export default dbService;
