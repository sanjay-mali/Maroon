export const config = {
  appwriteUrl: String(process.env.NEXT_PUBLIC_APPWRITE_URL),
  appwriteProjectId: String(process.env.NEXT_PUBLIC_PROJECT_ID),
  appwriteCollectionId: process.env.NEXT_PUBLIC_COLLECTION_ID,
  appwriteBucketId: process.env.NEXT_PUBLIC_BUCKET_ID,
  appwriteDatabaseId: process.env.NEXT_PUBLIC_DATABASE_ID,
  announcementsCollectionId: "68233e9700242bd9a521",
  bannersCollectionId: "6819d90000299c92d966",
};
