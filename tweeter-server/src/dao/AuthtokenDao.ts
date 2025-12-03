export interface AuthtokenDao {
    getToken(authToken: string) : Promise<string | null>
    putToken() : Promise<[string, number]>
}