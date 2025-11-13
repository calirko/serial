import { EmbedBuilder, ChannelType } from "discord.js";
import type { ClientCommand } from "../types";

const nameLocalizations = {
	"pt-BR": "serverinfo",
	"en-US": "serverinfo",
};

const descriptionLocalizations = {
	"pt-BR": "Obter informações sobre o servidor",
	"en-US": "Get information about the server",
};

export const command: ClientCommand = {
	name: nameLocalizations["en-US"],
	category: "utility",
	nameLocalizations,
	descriptionLocalizations,
	description: descriptionLocalizations["en-US"],
	execute: async (interaction) => {
		const guild = interaction.guild;
		if (!guild) {
			await interaction.reply({
				content: "This command can only be used in a server!",
				ephemeral: true,
			});
			return;
		}

		const owner = await guild.fetchOwner();
		const channels = guild.channels.cache;
		const textChannels = channels.filter(channel => channel.type === ChannelType.GuildText).size;
		const voiceChannels = channels.filter(channel => channel.type === ChannelType.GuildVoice).size;
		const categories = channels.filter(channel => channel.type === ChannelType.GuildCategory).size;
		const roles = guild.roles.cache.size - 1; // Exclude @everyone role
		const emojis = guild.emojis.cache.size;
		const stickers = guild.stickers.cache.size;
		const boosts = guild.premiumSubscriptionCount || 0;

		const verificationLevels = {
			0: "None",
			1: "Low",
			2: "Medium",
			3: "High",
			4: "Very High"
		};

		const embed = new EmbedBuilder()
			.setColor("#5865F2")
			.setTitle(`Server Information - ${guild.name}`)
			.setThumbnail(guild.iconURL({ size: 256 }))
			.addFields(
				{
					name: "🆔 Server ID",
					value: `\`${guild.id}\``,
					inline: true,
				},
				{
					name: "👑 Owner",
					value: `${owner.user.tag}`,
					inline: true,
				},
				{
					name: "📅 Created",
					value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`,
					inline: true,
				},
				{
					name: "👥 Members",
					value: guild.memberCount.toString(),
					inline: true,
				},
				{
					name: "🔒 Verification Level",
					value: verificationLevels[guild.verificationLevel],
					inline: true,
				},
				{
					name: "💎 Boost Level",
					value: `Level ${guild.premiumTier} (${boosts} boosts)`,
					inline: true,
				},
				{
					name: "📝 Text Channels",
					value: textChannels.toString(),
					inline: true,
				},
				{
					name: "🔊 Voice Channels",
					value: voiceChannels.toString(),
					inline: true,
				},
				{
					name: "📁 Categories",
					value: categories.toString(),
					inline: true,
				},
				{
					name: "🏷️ Roles",
					value: roles.toString(),
					inline: true,
				},
				{
					name: "😀 Emojis",
					value: emojis.toString(),
					inline: true,
				},
				{
					name: "🎨 Stickers",
					value: stickers.toString(),
					inline: true,
				}
			);

		if (guild.description) {
			embed.addFields({
				name: "📖 Description",
				value: guild.description,
				inline: false,
			});
		}

		if (guild.banner) {
			const bannerURL = guild.bannerURL({ size: 512 });
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
