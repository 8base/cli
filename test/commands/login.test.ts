
import { ExecutionConfig, StaticConfig, setTraceLevel, TraceLevel } from "../../common";
import { CommandManager, BaseCommand } from "../../engine";
import { InvalidArgument } from "../../errors/invalidArgument";

jest.mock("../../engine/commands/login/remoteConnector");
jest.mock("../../common/userDataStorage");

describe("8base login", () => {

    test("check correct login parameters", async () => {
        try {
            await CommandManager.initialize(new ExecutionConfig(["login", "-u", "testuser"]));
        } catch(er) {
            expect(er).toBeInstanceOf(InvalidArgument);
        }
        try {
            await CommandManager.initialize(new ExecutionConfig(["login", "-p", "pass"]));
        } catch(er) {
            expect(er).toBeInstanceOf(InvalidArgument);
        }
    });

    test("check correct instance login command", async () => {
        const cmd = await CommandManager.initialize(new ExecutionConfig(["login", "-u", "testuser", "-p", "password"]));
        expect(cmd).toBeInstanceOf(BaseCommand);
    });

    test("check correct login", async () => {
        const cmd = await CommandManager.initialize(new ExecutionConfig(["login", "-u", "testuser", "-p", "password"]));
        const token = await CommandManager.run(cmd);
        expect(token).toBeDefined();

        const cmdSecond = await CommandManager.initialize(new ExecutionConfig(["login", "-u", "testuser", "-p", "password"]));
        const tokenSecond = await CommandManager.run(cmdSecond);
        expect(token).toEqual(tokenSecond);
    });
});