export const config = {
    projectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    projectName: String(import.meta.env.VITE_APPWRITE_PROJECT_NAME),
    appwriteEndpoint: String(import.meta.env.VITE_APPWRITE_ENDPOINT),
    bucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
    databaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    tableId: String(import.meta.env.VITE_APPWRITE_TABLE_ID)
}