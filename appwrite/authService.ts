import { Client, Account, ID } from "appwrite";
import dbService from "./database";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint("https://nyc.cloud.appwrite.io/v1")
      .setProject("680f3962002aecf25632");

    this.account = new Account(this.client);
  }

  async createAccount({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
  }) {
    try {
      // Create user in Auth service
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );
      console.log("userAccount", userAccount);
      if (userAccount) {
        await dbService.createUser({
          userId: userAccount.$id,
          name: name,
          email: email,
          isActive: true,
          role: "customer",
        });
        return userAccount;
      } else {
        return userAccount;
      }
    } catch (error) {
      throw error;
    }
  }

  async Login({ email, password }: { email: string; password: string }) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      throw error;
    }
  }

  async Logout() {
    try {
      return await this.account.deleteSessions();
    } catch (error) {
      throw error;
    }
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      const data = await this.getCurrentUser();
      return Boolean(data);
    } catch (error) {}

    return false;
  }

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error: any) {
      throw new Error(`Failed to get current user: ${error}`);
    }
  }
}

const authService = new AuthService();

export default authService;
