import { exec, type ExecException } from "node:child_process";

async function execPromise(
  command: string,
): Promise<{ stderr: string; stdout: string }> {
  return new Promise((resolve, reject) => {
    exec(
      command,
      (error: ExecException | null, stdout: string, stderr: string) => {
        if (error) {
          reject(error);
          return;
        }

        resolve({ stdout, stderr });
      },
    );
  });
}

describe("cli", () => {
  it("Should return new fen", (done) => {
    const fen = "6k1/8/8/8/8/3K4/4R3/5R2 w - - 0 1";
    const expectedFen = "6k1/8/8/8/8/3K4/6R1/5R2 b - - 1 1";

    (async () => {
      try {
        const { stdout } = await execPromise(
          `npm run start -- -f "${fen}" -d 4`,
        );
        expect(stdout).toContain(expectedFen);
        await done();
      } catch (error) {
        if (error instanceof Error) {
          console.error(`exec error: ${error.message}`);
        } else {
          console.error(`exec error: ${error}`);
        }

        done(error);
      }
    })();
  }, 10_000);
});
