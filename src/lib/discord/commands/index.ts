import { command as ping } from "./ping";
import { command as cute } from "./cute";
import { command as about } from "./about";
import { command as meow } from "./meow";
import { command as purr } from "./purr";
import { command as hug } from "./hug";
import { command as boop } from "./boop";
import { command as pat } from "./pat";
import { command as nap } from "./nap";
import { command as uwu } from "./uwu";
import { command as status } from "./status";
import { command as uptime } from "./uptime";
import { command as uwufy } from "./uwufy";
import { command as ship } from "./ship";
import { command as morse } from "./morse";
import { command as pick } from "./pick";
import { command as eightball } from "./8ball";
import { command as reverse } from "./reverse";
import { command as dice } from "./dice";
import { command as userinfo } from "./userinfo";
import { command as serverinfo } from "./serverinfo";
import { command as avatar } from "./avatar";
import { command as banner } from "./banner";
import { command as roles } from "./roles";
import { command as membercount } from "./membercount";
import { command as channelinfo } from "./channelinfo";
import { command as lock } from "./lock";
import { command as unlock } from "./unlock";
import { command as level } from "./level";
import { command as leaderboard } from "./leaderboard";
import type { ClientCommand } from "../types";

export const commands: ClientCommand[] = [
	// System commands
	ping, status, uptime,
	// Utility commands
	userinfo, serverinfo, avatar, banner, roles, membercount, channelinfo,
	// Moderation commands
	lock, unlock,
	// Leveling commands
	level, leaderboard,
	// Interaction commands
	cute, about, meow, purr, hug, boop, pat, nap, uwu,
	// Fun commands
	uwufy, ship, morse, pick, eightball, reverse, dice
];
