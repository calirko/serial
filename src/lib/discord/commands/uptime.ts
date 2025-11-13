import type { ClientCommand } from "../types";

const nameLocalizations = {
	"pt-BR": "uptime",
	"en-US": "uptime",
};

const descriptionLocalizations = {
	"pt-BR": "Mostrar há quanto tempo o bot está online",
	"en-US": "Show how long the bot has been online",
};

export const command: ClientCommand = {
	name: nameLocalizations["en-US"],
	category: "system",
	nameLocalizations,
	descriptionLocalizations,
	description: descriptionLocalizations["en-US"],
	execute: async (interaction) => {
		const local = interaction.guild?.preferredLocale;
		
		const uptimeSeconds = process.uptime();
		const days = Math.floor(uptimeSeconds / 86400);
		const hours = Math.floor((uptimeSeconds % 86400) / 3600);
		const minutes = Math.floor((uptimeSeconds % 3600) / 60);
		const seconds = Math.floor(uptimeSeconds % 60);
		
		const startTime = new Date(Date.now() - uptimeSeconds * 1000);
		
		const responseText = local === "pt-BR" 
			? `⏰ online há \`${days}d ${hours}h ${minutes}m ${seconds}s\`\n` +
			  `iniciado <t:${Math.floor(startTime.getTime() / 1000)}:R>`
			: `⏰ online for \`${days}d ${hours}h ${minutes}m ${seconds}s\`\n` +
			  `started <t:${Math.floor(startTime.getTime() / 1000)}:R>`;
		
		await interaction.reply(responseText);
	},
};
