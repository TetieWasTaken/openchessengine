import { exec, ExecException } from "node:child_process";

describe("cli", () => {
  it("Should return new fen", (done) => {
    const fen = "6k1/8/8/8/8/3K4/4R3/5R2 w - - 0 1";
    const expectedFen = "6k1/8/8/8/8/3K4/6R1/5R2 b - - 1 1";

    exec(
      `npm run start -- -f "${fen}" -d 4`,
      (error: ExecException | null, stdout: string, stderr: string): void => {
        if (error) {
          console.error(`exec error: ${error}`);
          return done(error);
        }
        try {
          expect(stdout).toContain(expectedFen);
          done();
        } catch (err) {
          done(err);
        }
      },
    );
  });
});
