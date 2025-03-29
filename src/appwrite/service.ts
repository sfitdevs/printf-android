import { ID, Account, Client } from 'appwrite'
import Config from 'react-native-config'

const appwriteClient = new Client()

// Use environment variables if available, otherwise use hardcoded values
// Also fix the typo in the APPWRITE_ENDPOINT environment variable name
const APPWRITE_ENDPOINT: string = Config.APPWRITE_ENDPOINT || Config.APPWRTIE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID: string = Config.APPWRITE_PROJECT_ID || '67bf1f4d0017b5c00d1a';

type CreateUserAccount = {
    email: string;
    password: string;
    name: string
}
type LoginUserAccount = {
    email: string;
    password: string;
}

class AppwriteService {
    account;

    constructor() {
        appwriteClient
            .setEndpoint(APPWRITE_ENDPOINT)
            .setProject(APPWRITE_PROJECT_ID)

        this.account = new Account(appwriteClient)
    }

    //create a new record of user inside appwrite

    async createAccount({ email, password, name }: CreateUserAccount) {
        try {
            const userAccount = await this.account.create(
                ID.unique(),
                email,
                password,
                name
            )
            if (userAccount) {
                //TODO: create login feature
                return this.login({ email, password })
            } else {
                return userAccount
            }
        } catch (error) {
            console.log("Appwrite service :: createAccount() :: ", error);
            throw error;
        }
    }

    async login({ email, password }: LoginUserAccount) {
        try {
            return await this.account.createEmailPasswordSession(email, password)
        } catch (error) {
            console.log("Appwrite service :: loginAccount() :: ", error);
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get()
        } catch (error) {
            console.log("Appwrite service :: getCurrentAccount() :: ", error);
            return null;
        }
    }

    async logout() {
        try {
            return await this.account.deleteSession('current')
        } catch (error) {
            console.log("Appwrite service :: logout() :: ", error);
            throw error;
        }
    }
}

export default AppwriteService