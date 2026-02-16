import {Client, Storage, TablesDB, ID} from 'appwrite';
import { config } from '../src/config/config'

class AppwriteConfig {
    client = new Client();
    database;
    bucket;

    constructor() {
        this.client
            .setProject(config.projectId)
            .setEndpoint(config.appwriteEndpoint)
            this.database = new TablesDB(this.client)
            this.bucket = new Storage(this.client)
    }

    // Upload File
    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                config.bucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Error uploading file:", error)
        }
    }

    // Delete File
    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile(config.bucketId, fileId)
        } catch (error) {
            console.log("Error deleting file:", error)
        }
    }

    // Get File Preview
    getFilePreview(fileId) {
        return this.bucket.getFilePreview(config.bucketId, fileId)
    }

    // Get File
    getFile(fileId) {
        return this.bucket.getFile(config.bucketId, fileId)
    }
    
    // Create Post - Only for Club Memebers
    async createPost(data) {
        try {
            return await this.database.createDocument(
                config.databaseId,
                config.collectionId,
                ID.unique(),
                data
            )
        } catch (error) {
            console.log("Error creating post:", error)
        }
    }
    
    // update Post
    async updatePost(postId, data) {
        try {
            return await this.database.updateDocument(
                config.databaseId,
                config.collectionId,
                postId,
                data
            )
        } catch (error) {
            console.log("Error updating post:", error)
        }
    }

    // Delete Post
    async deletePost(postId) {
        try {
            await this.database.deleteDocument(
                config.databaseId,
                config.collectionId,
                postId
            )
        } catch (error) {
            console.log("Error deleting post:", error)
        }
    }
    
    // Get All Posts
    async getAllPosts() {
        try {
            return await this.database.listDocuments(
                config.databaseId,
                config.collectionId
            )
        } catch (error) {
            console.log("Error getting all posts:", error)
        }
    }

    // Get Post by ID
    async getPostById(postId) {
        try {
            return await this.database.getDocument(
                config.databaseId,
                config.collectionId,
                postId
            )
        } catch (error) {
            console.log("Error getting post by ID:", error)
        }
    }

}