import type { ClientEvent } from "../types";

// events
import { event as ready } from "./ready";
import { event as interactionCreate } from "./interactionCreate";
import { event as guildCreate } from "./guildCreate";
import { event as guildMemberAdd } from "./guildMemberAdd";
import { event as guildMemberRemove } from "./guildMemberRemove";
import { event as messageCreate } from "./messageCreate";

export const events: ClientEvent[] = [ready, interactionCreate, guildCreate, guildMemberAdd, guildMemberRemove, messageCreate];
