import type { Command } from "commander";
import { resolveCliArgvInvocation } from "../argv-invocation.js";
import {
  shouldEagerRegisterSubcommands,
  shouldRegisterPrimarySubcommandOnly,
} from "../command-registration-policy.js";
import {
  buildCommandGroupEntries,
  defineImportedProgramCommandGroupSpecs,
  type CommandGroupDescriptorSpec,
} from "./command-group-descriptors.js";
import {
  registerCommandGroupByName,
  registerCommandGroups,
  type CommandGroupEntry,
} from "./register-command-groups.js";
import {
  registerSubCliByName as registerSubCliByNameCore,
  registerSubCliCommands as registerSubCliCommandsCore,
<<<<<<< HEAD
=======
  type SubCliRegistrationContext,
>>>>>>> upstream/main
} from "./register.subclis-core.js";
import {
  getSubCliCommandsWithSubcommands,
  getSubCliEntries as getSubCliEntryDescriptors,
  type SubCliDescriptor,
} from "./subcli-descriptors.js";

export { getSubCliCommandsWithSubcommands };

<<<<<<< HEAD
type SubCliRegistrar = (program: Command) => Promise<void> | void;
=======
type SubCliRegistrar = (
  program: Command,
  argv: string[],
  context: SubCliRegistrationContext,
) => Promise<void> | void;
>>>>>>> upstream/main

const entrySpecs: readonly CommandGroupDescriptorSpec<SubCliRegistrar>[] = [
  ...defineImportedProgramCommandGroupSpecs([
    {
      commandNames: ["completion"],
      loadModule: () => import("../completion-cli.js"),
      exportName: "registerCompletionCli",
    },
  ]),
];

<<<<<<< HEAD
function resolveSubCliCommandGroups(): CommandGroupEntry[] {
  return buildCommandGroupEntries(getSubCliEntryDescriptors(), entrySpecs, (register) => register);
=======
function resolveSubCliCommandGroups(
  argv: string[],
  context: SubCliRegistrationContext = {},
): CommandGroupEntry[] {
  return buildCommandGroupEntries(
    getSubCliEntryDescriptors(),
    entrySpecs,
    (register) => async (program) => {
      await register(program, argv, context);
    },
  );
>>>>>>> upstream/main
}

export function getSubCliEntries(): ReadonlyArray<SubCliDescriptor> {
  return getSubCliEntryDescriptors();
}

export async function registerSubCliByName(
  program: Command,
  name: string,
  argv: string[] = process.argv,
<<<<<<< HEAD
): Promise<boolean> {
  if (await registerSubCliByNameCore(program, name, argv)) {
    return true;
  }
  return registerCommandGroupByName(program, resolveSubCliCommandGroups(), name);
=======
  context: SubCliRegistrationContext = {},
): Promise<boolean> {
  if (await registerSubCliByNameCore(program, name, argv, context)) {
    return true;
  }
  return registerCommandGroupByName(program, resolveSubCliCommandGroups(argv, context), name);
>>>>>>> upstream/main
}

export function registerSubCliCommands(program: Command, argv: string[] = process.argv) {
  registerSubCliCommandsCore(program, argv);
  const { primary } = resolveCliArgvInvocation(argv);
<<<<<<< HEAD
  registerCommandGroups(program, resolveSubCliCommandGroups(), {
=======
  registerCommandGroups(program, resolveSubCliCommandGroups(argv), {
>>>>>>> upstream/main
    eager: shouldEagerRegisterSubcommands(),
    primary,
    registerPrimaryOnly: Boolean(primary && shouldRegisterPrimarySubcommandOnly(argv)),
  });
}
