export enum TriggerStageType {
    before = "Before",
    after = "After"
  }

  export interface TriggerStage {
    /* pre post */
    stageName: string;

    functionName: string;
  }

  export interface TriggerDefinition {
    name: string;
    table: string;
    stages: TriggerStage[];
  }

  export enum TriggerType {
    create = "Create",
    update = "Update",
    delete = "Delete"
  }