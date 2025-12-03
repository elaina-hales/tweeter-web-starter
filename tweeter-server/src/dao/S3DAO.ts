export interface S3Dao {
    putImage(fileName: string, imageStringBase64Encoded: string) : Promise<string>
}