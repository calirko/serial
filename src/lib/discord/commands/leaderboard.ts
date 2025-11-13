import { EmbedBuilder } from "discord.js";
import type { ClientCommand } from "../types";
import db from "../../prisma";

const nameLocalizations = {
	"pt-BR": "leaderboard",
	"en-US": "leaderboard",
};

const descriptionLocalizations = {
	"pt-BR": "Ver os top usuários por nível e XP",
	"en-US": "View top users by level and XP",
};

// Calculate level from XP
function calculateLevel(xp: number): number {
	return Math.floor(0.1 * Math.sqrt(xp));
}

export const command: ClientCommand = {
	name: nameLocalizations["en-US"],
	category: "leveling",
	nameLocalizations,
	descriptionLocalizations,
	description: descriptionLocalizations["en-US"],
	options: [
		{
			name: "scope",
			nameLocalizations: {
				"pt-BR": "escopo",
				"en-US": "scope",
			},
			description: "Show global or server leaderboard",
			descriptionLocalizations: {
				"pt-BR": "Mostrar ranking global ou do servidor",
				"en-US": "Show global or server leaderboard",
			},
			type: 3, // STRING type
			required: false,
			choices: [
				{
					name: "Global",
					value: "global",
				},
				{
					name: "Server",
					nameLocalizations: {
						"pt-BR": "Servidor",
					},
					value: "server",
				},
			],
		},
	],
	execute: async (interaction) => {
		const local = interaction.guild?.preferredLocale;
		const scope = interaction.options.get("scope")?.value as string || "server";
		
		if (!interaction.guild && scope === "server") {
			await interaction.reply({
				content: local === "pt-BR" 
					? "só funciona em servidores, miau~" 
					: "only works in servers, meow~",
				ephemeral: true,
			});
			return;
		}

		try {
			const guildId = scope === "global" ? "global" : interaction.guild!.id;
			
			// Get top 10 members sorted by XP
			const topMembers = await db.member.findMany({
				where: {
					guildId: guildId,
				},
				orderBy: {
					xp: "desc",
				},
				take: 10,
			});

			if (topMembers.length === 0) {
				await interaction.reply({
					content: local === "pt-BR"
						? "ninguém tem XP ainda... seja o primeiro, miau~"
						: "no one has XP yet... be the first, meow~",
					ephemeral: true,
				});
				return;
			}

			const title = scope === "global" 
				? (local === "pt-BR" ? "🌍 Ranking Global" : "🌍 Global Leaderboard")
				: (local === "pt-BR" ? `🏠 Ranking de ${interaction.guild!.name}` : `🏠 ${interaction.guild!.name} Leaderboard`);

			let description = "";
			for (let i = 0; i < topMembers.length; i++) {
				const member = topMembers[i];
				const level = calculateLevel(member.xp);
				const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`;
				
				// Try to fetch user info
				try {
					const user = await interaction.client.users.fetch(member.userId);
					description += `${medal} **${user.username}** - Nível ${level} (${member.xp} XP)\n`;
				} catch {
					description += `${medal} *Unknown User* - Nível ${level} (${member.xp} XP)\n`;
				}
			}

			const embed = new EmbedBuilder()
				.setColor("#5865F2")
				.setTitle(title)
				.setDescription(description)
				.setFooter({
					text: local === "pt-BR" 
						? "continue mandando mensagens pra subir no ranking~" 
						: "keep chatting to climb the ranks~",
				});

			await interaction.reply({ embeds: [embed] });
		} catch (error) {
			console.error("Error fetching leaderboard:", error);
			await interaction.reply({
				content: local === "pt-BR"
					? "ops... não consegui pegar o ranking~"
					: "oops... couldn't fetch the leaderboard~",
				ephemeral: true,
			});
		}
	},
};
