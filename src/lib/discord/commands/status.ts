import type { ClientCommand } from "../types";
import * as os from "os";

const nameLocalizations = {
	"pt-BR": "status",
	"en-US": "status",
};

const descriptionLocalizations = {
	"pt-BR": "Mostrar informações do sistema e status do bot",
	"en-US": "Show system information and bot status",
};

export const command: ClientCommand = {
	name: nameLocalizations["en-US"],
	category: "system",
	nameLocalizations,
	descriptionLocalizations,
	description: descriptionLocalizations["en-US"],
	execute: async (interaction) => {
		const local = interaction.guild?.preferredLocale;
		
		// System info
		const totalMemory = os.totalmem();
		const freeMemory = os.freemem();
		const usedMemory = totalMemory - freeMemory;
		const memoryUsage = ((usedMemory / totalMemory) * 100).toFixed(1);
		
		const cpuCount = os.cpus().length;
		const uptime = os.uptime();
		const platform = os.platform();
		const arch = os.arch();
		
		// Process info
		const processMemory = process.memoryUsage();
		const processUptime = process.uptime();
		
		// Format uptime
		const formatUptime = (seconds: number) => {
			const days = Math.floor(seconds / 86400);
			const hours = Math.floor((seconds % 86400) / 3600);
			const mins = Math.floor((seconds % 3600) / 60);
			return `${days}d ${hours}h ${mins}m`;
		};
		
		const responseText = local === "pt-BR" 
			? `🤖 **sistema:**\n` +
			  `plataforma: \`${platform} ${arch}\`\n` +
			  `cpus: \`${cpuCount} cores\`\n` +
			  `ram: \`${(usedMemory / 1024 / 1024 / 1024).toFixed(1)}/${(totalMemory / 1024 / 1024 / 1024).toFixed(1)}GB (${memoryUsage}%)\`\n\n` +
			  `**🐱 bot:**\n` +
			  `memória: \`${(processMemory.heapUsed / 1024 / 1024).toFixed(1)}MB\`\n` +
			  `uptime: \`${formatUptime(processUptime)}\`\n` +
			  `node.js: \`${process.version}\``
			: `🤖 **system:**\n` +
			  `platform: \`${platform} ${arch}\`\n` +
			  `cpus: \`${cpuCount} cores\`\n` +
			  `ram: \`${(usedMemory / 1024 / 1024 / 1024).toFixed(1)}/${(totalMemory / 1024 / 1024 / 1024).toFixed(1)}GB (${memoryUsage}%)\`\n\n` +
			  `**🐱 bot:**\n` +
			  `memory: \`${(processMemory.heapUsed / 1024 / 1024).toFixed(1)}MB\`\n` +
			  `uptime: \`${formatUptime(processUptime)}\`\n` +
			  `node.js: \`${process.version}\``;
		
		await interaction.reply(responseText);
	},
};
