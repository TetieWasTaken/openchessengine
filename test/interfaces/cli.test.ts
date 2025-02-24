/** @format */

import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execPromise = promisify(exec);

async function runCommand(command: string): Promise<{ stderr: string; stdout: string }> {
	return execPromise(command);
}

describe('cli', () => {
	it('Should return new fen', (done) => {
		const fen = '6k1/8/8/8/8/3K4/4R3/5R2 w - - 0 1';
		const expectedFens = [
			'6k1/8/8/8/8/3K4/6R1/5R2 b - - 1 1',
			'8/k7/7R/1R6/5K2/8/8/8 b - - 1 1'
		];

		(async () => {
			try {
				const { stdout } = await runCommand(`npm run start -- -f "${fen}" -d 4`);
				const isExpectedFen = expectedFens.some(expectedFen => stdout.includes(expectedFen));
				expect(isExpectedFen).toBe(true);
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
