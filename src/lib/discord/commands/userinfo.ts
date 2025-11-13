import { EmbedBuilder, ApplicationCommandOptionType } from "discord.js";
import type { ClientCommand } from "../types";

const nameLocalizations = {
	"pt-BR": "userinfo",
	"en-US": "userinfo",
};

const descriptionLocalizations = {
	"pt-BR": "Obter informações sobre um usuário",
	"en-US": "Get information about a user",
};

export const command: ClientCommand = {
	name: nameLocalizations["en-US"],
	category: "utility",
	nameLocalizations,
	descriptionLocalizations,
	description: descriptionLocalizations["en-US"],
	options: [
		{
			name: "user",
			type: ApplicationCommandOptionType.User,
			description: "The user to get information about",
			descriptionLocalizations: {
				"pt-BR": "O usuário para obter informações sobre",
				"en-US": "The user to get information about",
			},
			required: false,
		},
	],
	execute: async (interaction) => {
		const userOption = interaction.options?.data?.find(option => option.name === 'user');
		const targetUser = userOption?.user || interaction.user;
		const member = interaction.guild?.members.cache.get(targetUser.id);

		const embed = new EmbedBuilder()
			.setColor("#5865F2")
			.setTitle(`User Information - ${targetUser.tag}`)
			.setThumbnail(targetUser.displayAvatarURL({ size: 256 }))
			.addFields(
				{
					name: "👤 Username",
					value: targetUser.username,
					inline: true,
				},
				{
					name: "🏷️ Display Name",
					value: targetUser.displayName || targetUser.username,
					inline: true,
				},
				{
					name: "🆔 User ID",
					value: `\`${targetUser.id}\``,
					inline: true,
				},
				{
					name: "📅 Account Created",
					value: `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:F>`,
					inline: true,
				},
				{
					name: "🤖 Bot",
					value: targetUser.bot ? "Yes" : "No",
					inline: true,
				}
			);

		if (member) {
			embed.addFields(
				{
					name: "📅 Joined Server",
					value: member.joinedTimestamp 
						? `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`
						: "Unknown",
					inline: true,
				},
				{
					name: "🎨 Nickname",
					value: member.nickname || "None",
					inline: true,
				},
				{
					name: "🏆 Highest Role",
					value: member.roles.highest.name,
					inline: true,
				},
				{
					name: "👥 Roles",
					value: member.roles.cache.size > 1 
						? `${member.roles.cache.size - 1} roles`
						: "No roles",
					inline: true,
				}
			);

			if (member.premiumSince) {
				embed.addFields({
					name: "💎 Boosting Since",
					value: `<t:${Math.floor(member.premiumSince.getTime() / 1000)}:F>`,
					inline: true,
				});
			}
		}

		if (targetUser.banner) {
			const bannerURL = targetUser.bannerURL({ size: 512 });
			if (bannerURL) {
				embed.setImage(bannerURL);
			}
		}

		embed.setFooter({
			text: `Requested by ${interaction.user.tag}`,
			iconURL: interaction.user.displayAvatarURL(),
		});

		await interaction.reply({ embeds: [embed] });
	},
};
