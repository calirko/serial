import { EmbedBuilder } from "discord.js";
import type { ClientCommand } from "../types";
import db from "../../prisma";

const nameLocalizations = {
	"pt-BR": "level",
	"en-US": "level",
};

const descriptionLocalizations = {
	"pt-BR": "Ver nível e XP de um usuário",
	"en-US": "Check a user's level and XP",
};

// Calculate level from XP using standard formula
function calculateLevel(xp: number): number {
	return Math.floor(0.1 * Math.sqrt(xp));
}

// Calculate XP needed for next level
function xpForLevel(level: number): number {
	return Math.pow((level + 1) / 0.1, 2);
}

export const command: ClientCommand = {
	name: nameLocalizations["en-US"],
	category: "leveling",
	nameLocalizations,
	descriptionLocalizations,
	description: descriptionLocalizations["en-US"],
	options: [
		{
			name: "user",
			nameLocalizations: {
				"pt-BR": "usuário",
				"en-US": "user",
			},
			description: "User to check (yourself if not specified)",
			descriptionLocalizations: {
				"pt-BR": "Usuário para verificar (você mesmo se não especificado)",
				"en-US": "User to check (yourself if not specified)",
			},
			type: 6, // USER type
			required: false,
		},
	],
	execute: async (interaction) => {
		const local = interaction.guild?.preferredLocale;
		const userOption = interaction.options.get("user");
		const targetUser = userOption?.user || interaction.user;
		
		if (!interaction.guild) {
			await interaction.reply({
				content: local === "pt-BR" 
					? "só funciona em servidores, miau~" 
					: "only works in servers, meow~",
				ephemeral: true,
			});
			return;
		}

		try {
			// Get or create global member data (across all guilds)
			let globalMember = await db.member.findFirst({
				where: {
					userId: targetUser.id,
					guildId: "global",
				},
			});

			if (!globalMember) {
				globalMember = await db.member.create({
					data: {
						userId: targetUser.id,
						guildId: "global",
						xp: 0,
						level: 0,
						messages: 0,
					},
				});
			}

			// Get or create guild-specific member data
			let guildMember = await db.member.findFirst({
				where: {
					userId: targetUser.id,
					guildId: interaction.guild.id,
				},
			});

			if (!guildMember) {
				guildMember = await db.member.create({
					data: {
						userId: targetUser.id,
						guildId: interaction.guild.id,
						xp: 0,
						level: 0,
						messages: 0,
					},
				});
			}

			// Calculate levels and progress
			const globalLevel = calculateLevel(globalMember.xp);
			const globalNextLevelXp = xpForLevel(globalLevel);
			const globalCurrentLevelXp = globalLevel > 0 ? xpForLevel(globalLevel - 1) : 0;
			const globalProgress = globalMember.xp - globalCurrentLevelXp;
			const globalNeeded = globalNextLevelXp - globalCurrentLevelXp;

			const guildLevel = calculateLevel(guildMember.xp);
			const guildNextLevelXp = xpForLevel(guildLevel);
			const guildCurrentLevelXp = guildLevel > 0 ? xpForLevel(guildLevel - 1) : 0;
			const guildProgress = guildMember.xp - guildCurrentLevelXp;
			const guildNeeded = guildNextLevelXp - guildCurrentLevelXp;

			const embed = new EmbedBuilder()
				.setColor("#5865F2")
				.setTitle(local === "pt-BR" ? `Nível de ${targetUser.username}` : `${targetUser.username}'s Level`)
				.setThumbnail(targetUser.displayAvatarURL({ size: 128 }))
				.addFields(
					{
						name: local === "pt-BR" ? "🌍 Nível Global" : "🌍 Global Level",
						value: local === "pt-BR"
							? `**Nível:** ${globalLevel}\n**XP:** ${globalMember.xp}\n**Progresso:** ${globalProgress}/${globalNeeded} XP para nível ${globalLevel + 1}\n**Mensagens:** ${globalMember.messages}`
							: `**Level:** ${globalLevel}\n**XP:** ${globalMember.xp}\n**Progress:** ${globalProgress}/${globalNeeded} XP to level ${globalLevel + 1}\n**Messages:** ${globalMember.messages}`,
						inline: false,
					},
					{
						name: local === "pt-BR" ? "🏠 Nível no Servidor" : "🏠 Server Level",
						value: local === "pt-BR"
							? `**Nível:** ${guildLevel}\n**XP:** ${guildMember.xp}\n**Progresso:** ${guildProgress}/${guildNeeded} XP para nível ${guildLevel + 1}\n**Mensagens:** ${guildMember.messages}`
							: `**Level:** ${guildLevel}\n**XP:** ${guildMember.xp}\n**Progress:** ${guildProgress}/${guildNeeded} XP to level ${guildLevel + 1}\n**Messages:** ${guildMember.messages}`,
						inline: false,
					}
				)
				.setFooter({
					text: local === "pt-BR" ? "continue mandando mensagens pra ganhar XP~" : "keep chatting to earn XP~",
				});

			await interaction.reply({ embeds: [embed] });
		} catch (error) {
			console.error("Error fetching level:", error);
			await interaction.reply({
				content: local === "pt-BR"
					? "ops... não consegui pegar os dados~"
					: "oops... couldn't fetch the data~",
				ephemeral: true,
			});
		}
	},
};
