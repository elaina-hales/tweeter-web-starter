import { AuthTokenTableData } from "./entity/AuthTokenTableData"

export interface AuthtokenDao {
    getToken(authToken: string) : Promise<AuthTokenTableData | null>
    putToken(alias: string) : Promise<[string, number]>
    deleteToken(token: string): Promise<void>
}