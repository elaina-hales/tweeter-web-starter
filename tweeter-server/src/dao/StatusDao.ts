import { DataPage } from "./entity/DataPage";
import { StatusTableData } from "./entity/StatusTableData";

export interface StatusDao {
    getPageOfStoryItems(userAlias: string, pageSize: number, lastTimestamp: number | undefined): Promise<DataPage<StatusTableData>>
    putStatus(follows: StatusTableData): Promise<void>
}