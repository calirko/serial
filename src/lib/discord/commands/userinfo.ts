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
			.setTitle(`${targetUser.tag}`)
			.setThumbnail(targetUser.displayAvatarURL({ size: 256 }))
			.addFields(
				{
					name: "👤 username",
					value: targetUser.username,
					inline: true,
				},
				{
					name: "🏷️ display",
					value: targetUser.displayName || targetUser.username,
					inline: true,
				},
				{
					name: "🆔 id",
					value: `\`${targetUser.id}\``,
					inline: true,
				},
				{
					name: "📅 created",
					value: `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:R>`,
					inline: true,
				},
				{
					name: "🤖 bot",
					value: targetUser.bot ? "yes" : "no",
					inline: true,
				}
			);

		if (member) {
			embed.addFields(
				{
					name: "📅 joined",
					value: member.joinedTimestamp 
						? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`
						: "unknown",
					inline: true,
				},
				{
					name: "🎨 nickname",
					value: member.nickname || "none",
					inline: true,
				},
				{
					name: "🏆 top role",
					value: member.roles.highest.name,
					inline: true,
				},
				{
					name: "👥 roles",
					value: member.roles.cache.size > 1 
						? `${member.roles.cache.size - 1} roles`
						: "no roles",
					inline: true,
				}
			);

			if (member.premiumSince) {
				embed.addFields({
					name: "💎 boosting since",
					value: `<t:${Math.floor(member.premiumSince.getTime() / 1000)}:R>`,
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
