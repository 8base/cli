
import { InvalidArgument } from "../../errors";
import { ExecutionConfig } from "../../common";
import { CommandController, BaseCommand } from "../../engine";

jest.mock("../../engine/connectors/serverConnector");
jest.mock("../../common/userDataStorage");

describe("8base login", () => {

    test("check correct login parameters", async () => {
        try {
            await CommandController.initialize(new ExecutionConfig(["login", "-u", "testuser"]));
        } catch(er) {
            expect(er).toBeInstanceOf(InvalidArgument);
        }
        try {
            await CommandController.initialize(new ExecutionConfig(["login", "-p", "pass"]));
        } catch(er) {
            expect(er).toBeInstanceOf(InvalidArgument);
        }
    });

    test("check correct instance login command", async () => {
        const cmd = await CommandController.initialize(new ExecutionConfig(["login", "-u", "testuser", "-p", "password"]));
        expect(cmd).toBeInstanceOf(BaseCommand);
    });

    test("check correct login", async () => {
        const cmd = await CommandController.initialize(new ExecutionConfig(["login", "-u", "testuser", "-p", "password"]));
        const token = await CommandController.run(cmd);
        expect(token).toBeDefined();

        const cmdSecond = await CommandController.initialize(new ExecutionConfig(["login", "-u", "testuser", "-p", "password"]));
        const tokenSecond = await CommandController.run(cmdSecond);
        expect(token).toEqual(tokenSecond);
    });
});