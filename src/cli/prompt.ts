import { stdin as input, stdout as output } from "node:process";
import readline from "node:readline/promises";
import { isVerbose, isYes } from "../globals.js";
import { normalizeLowercaseStringOrEmpty } from "../shared/string-coerce.js";

<<<<<<< HEAD
=======
export class PromptInputClosedError extends Error {
  constructor() {
    super("Prompt input closed before an answer was received.");
    this.name = "PromptInputClosedError";
  }
}

type ReadlineInterface = ReturnType<typeof readline.createInterface>;

function questionUntilClose(rl: ReadlineInterface, question: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (complete: () => void) => {
      if (settled) {
        return;
      }
      settled = true;
      rl.off("close", onClose);
      complete();
    };
    const onClose = () => finish(() => reject(new PromptInputClosedError()));

    rl.once("close", onClose);
    void rl.question(question).then(
      (answer) => finish(() => resolve(answer)),
      (error: unknown) => finish(() => reject(error)),
    );
  });
}

>>>>>>> upstream/main
export async function promptYesNo(question: string, defaultYes = false): Promise<boolean> {
  // Simple Y/N prompt honoring global --yes and verbosity flags.
  if (isVerbose() && isYes()) {
    return true;
  } // redundant guard when both flags set
  if (isYes()) {
    return true;
  }
  const rl = readline.createInterface({ input, output });
  const suffix = defaultYes ? " [Y/n] " : " [y/N] ";
<<<<<<< HEAD
  const answer = normalizeLowercaseStringOrEmpty(await rl.question(`${question}${suffix}`));
  rl.close();
=======
  const answer = normalizeLowercaseStringOrEmpty(
    await questionUntilClose(rl, `${question}${suffix}`).finally(() => {
      rl.close();
    }),
  );
>>>>>>> upstream/main
  if (!answer) {
    return defaultYes;
  }
  return answer.startsWith("y");
}
