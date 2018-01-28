
export interface ICloudConnector {
    /* async */ upload(data: any): Promise<any>;
}