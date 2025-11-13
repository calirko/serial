import type { ClientCommand } from "../types";
import db from "../../prisma";
import { createClient } from "redis";

const nameLocalizations = {
	"pt-BR": "ping",
	"en-US": "ping",
};

const descriptionLocalizations = {
	"pt-BR": "Verificar latência e status dos sistemas",
	"en-US": "Check latency and system status",
};

export const command: ClientCommand = {
	name: nameLocalizations["en-US"],
	category: "system",
	nameLocalizations,
	descriptionLocalizations,
	description: descriptionLocalizations["en-US"],
	execute: async (interaction) => {
		const local = interaction.guild?.preferredLocale;
		const startTime = Date.now();
		
		// Discord API ping
		const discordPing = Date.now() - interaction.createdTimestamp;
		
		// Database ping
		let dbPing = "❌";
		try {
			const dbStart = Date.now();
			await db.user.count();
			dbPing = `${Date.now() - dbStart}ms`;
		} catch (error) {
			dbPing = "Error";
		}
		
		// Redis ping
		let redisPing = "❌";
		try {
			const redisClient = createClient();
			await redisClient.connect();
			const redisStart = Date.now();
			await redisClient.ping();
			redisPing = `${Date.now() - redisStart}ms`;
			await redisClient.disconnect();
		} catch (error) {
			redisPing = "Error";
		}
		
		const responseText = local === "pt-BR" 
			? `🏓 pong! miau~\n\n` +
			  `📡 **Discord:** \`${discordPing}ms\`\n` +
			  `🗄️ **Database:** \`${dbPing}\`\n` +
			  `📦 **Redis:** \`${redisPing}\`\n` +
			  `⏱️ **Total:** \`${Date.now() - startTime}ms\``
			: `🏓 pong! meow~\n\n` +
			  `📡 **Discord:** \`${discordPing}ms\`\n` +
			  `🗄️ **Database:** \`${dbPing}\`\n` +
			  `📦 **Redis:** \`${redisPing}\`\n` +
			  `⏱️ **Total:** \`${Date.now() - startTime}ms\``;
		
		await interaction.reply(responseText);
	},
};
