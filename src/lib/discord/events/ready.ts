import { ActivityType, REST, Routes, type Client } from "discord.js";
import { commands } from "../commands/index";
import { DISCORD_TOKEN, DISCORD_CLIENT_ID } from "$env/static/private";
import type { ClientEvent } from "../types";

const sendCommands = async () => {
	try {
		const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);

		await rest.put(Routes.applicationCommands(DISCORD_CLIENT_ID), {
			body: commands.map(({ execute, ...command }) => ({ ...command })),
		});
	} catch (e) {
		console.error(e);
	}
};

// ready event
export const event: ClientEvent = {
	name: "ready",
	execute: async (client: Client) => {
		console.log("Serial is online!");
		client.user?.setActivity("over servers... miau~", {
			type: ActivityType.Watching,
		});

		// Commands
		sendCommands();
	},
};
