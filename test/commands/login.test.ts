
import { ExecutionConfig, StaticConfig, setTraceLevel, TraceLevel } from "../../common";
import { CommandManager, BaseCommand } from "../../engine";
import { InvalidArgument } from "../../errors/invalidArgument";

jest.mock("../../engine/commands/login/remoteConnector");

describe("8base login", () => {
    beforeAll(async () => {
        this.token = "";
    });

    test("check correct login parameters", async () => {
        try {
            CommandManager.initialize(new ExecutionConfig(["login", "-u", "testuser"]));
        } catch(er) {
            expect(er).toBeInstanceOf(InvalidArgument);
        }
        try {
            CommandManager.initialize(new ExecutionConfig(["login", "-p", "pass"]));
        } catch(er) {
            expect(er).toBeInstanceOf(InvalidArgument);
        }
    });

    test("check correct instance login command", async () => {
        const cmd = CommandManager.initialize(new ExecutionConfig(["login", "-u", "testuser", "-p", "password"]));
        expect(cmd).toBeInstanceOf(BaseCommand);
    });

    test("check correct login", async () => {
        const cmd = CommandManager.initialize(new ExecutionConfig(["login", "-u", "testuser", "-p", "password"], { login: true }));
        this.token = await CommandManager.run(cmd);
        expect(this.token).toBeDefined();
    });

    test("check second login", async () => {
        const cmd = CommandManager.initialize(new ExecutionConfig(["login", "-u", "testuser", "-p", "password"], { login: true, token: this.token }));
        const token = await CommandManager.run(cmd);
        expect(token).toEqual(this.token);
    });
    
});