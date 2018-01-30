
export interface ICloudConnector {
    /**
     * @returns uploaded file guid
     */
    /* async */ uploadPost(postData: any, filepath: string): Promise<string>;


    /* async */ upload(url: string, filepath: string): Promise<string>;
}