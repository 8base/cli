import * as _ from "lodash";


class DI {

    private objects = new Map<any, any>();

    register(type: any, impl: any) {
        this.remove(type);
        this.insert(type, impl);
    }

    getObject<T>(type: T): any { // type must be removed
        const constr = this.findByType(type);
        if (_.isNil(constr)) {
            throw new Error("DI Error: object type \"" + type + "\" not present");
        }

        return new constr();
    }

    private findByType(type: any) {
        return this.objects.get(type);
    }

    private remove(type: any) {
        this.objects.delete(type);
    }

    private insert(type: any, impl: any) {
        this.objects.set(type, impl);
    }
}

let di = new DI();

export { di };
export * from "./environments";