import { GraphqlController } from '../../../../controllers';

export namespace Routes {

    export function cli(req: any, res: any) {
        GraphqlController.lambda("", {}, req, res);
    }
}
