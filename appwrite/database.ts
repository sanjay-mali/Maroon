import { Client, Databases, Storage } from "appwrite";

export class DBService {
  client = new Client();
  database;
  storage;

  constructor() {
    this.client
      .setEndpoint("https://nyc.cloud.appwrite.io/v1")
      .setProject("680f3962002aecf25632");

    this.database = new Databases(this.client);
    this.storage = new Storage(this.client);
  }

  // async addNewProduct()
  // async editProduct()
  // async deleteProduct() 
  // async getProduct() {
  // async getAllProducts() 
  // async getAllProductsByCategory() 
}

const dbService = new DBService();

export default dbService;
