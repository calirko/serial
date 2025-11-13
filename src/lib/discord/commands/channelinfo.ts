import { EmbedBuilder, ApplicationCommandOptionType, ChannelType } from "discord.js";
import type { ClientCommand } from "../types";

const nameLocalizations = {
	"pt-BR": "channelinfo",
	"en-US": "channelinfo",
};

const descriptionLocalizations = {
	"pt-BR": "Obter informações sobre um canal",
	"en-US": "Get information about a channel",
};

export const command: ClientCommand = {
	name: nameLocalizations["en-US"],
	category: "utility",
	nameLocalizations,
	descriptionLocalizations,
	description: descriptionLocalizations["en-US"],
	options: [
		{
			name: "channel",
			type: ApplicationCommandOptionType.Channel,
			description: "The channel to get information about",
			descriptionLocalizations: {
				"pt-BR": "O canal para obter informações sobre",
				"en-US": "The channel to get information about",
			},
			required: false,
		},
	],
	execute: async (interaction) => {
		const channelOption = interaction.options?.data?.find(option => option.name === 'channel');
		const targetChannel = channelOption?.channel || interaction.channel;

		if (!targetChannel || !interaction.guild) {
			await interaction.reply({
				content: "Could not find channel information!",
				ephemeral: true,
			});
			return;
		}

		const channel = interaction.guild.channels.cache.get(targetChannel.id);
		if (!channel) {
			await interaction.reply({
				content: "Channel not found in this server!",
				ephemeral: true,
			});
			return;
		}

		const channelTypes: Record<number, string> = {
			[ChannelType.GuildText]: "Text Channel",
			[ChannelType.GuildVoice]: "Voice Channel",
			[ChannelType.GuildCategory]: "Category",
			[ChannelType.GuildAnnouncement]: "Announcement Channel",
			[ChannelType.AnnouncementThread]: "Announcement Thread",
			[ChannelType.PublicThread]: "Public Thread",
			[ChannelType.PrivateThread]: "Private Thread",
			[ChannelType.GuildStageVoice]: "Stage Channel",
			[ChannelType.GuildForum]: "Forum Channel",
		};

		const embed = new EmbedBuilder()
			.setColor("#5865F2")
			.setTitle(`Channel Information - #${channel.name}`)
			.addFields(
				{
					name: "📝 Channel Name",
					value: channel.name,
					inline: true,
				},
				{
					name: "🆔 Channel ID",
					value: `\`${channel.id}\``,
					inline: true,
				},
				{
					name: "📁 Type",
					value: channelTypes[channel.type] || "Unknown",
					inline: true,
				},
				{
					name: "📅 Created",
					value: channel.createdTimestamp ? 
						`<t:${Math.floor(channel.createdTimestamp / 1000)}:F>` : 
						"Unknown",
					inline: true,
				},
				{
					name: "📍 Position",
					value: 'position' in channel ? channel.position.toString() : "N/A",
					inline: true,
				}
			);

		// Add type-specific information
		if (channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildAnnouncement) {
			const textChannel = channel as any;
			
			if (textChannel.topic) {
				embed.addFields({
					name: "📖 Topic",
					value: textChannel.topic.length > 1024 ? 
						textChannel.topic.substring(0, 1021) + "..." : 
						textChannel.topic,
					inline: false,
				});
			}

			if (textChannel.rateLimitPerUser > 0) {
				embed.addFields({
					name: "⏰ Slowmode",
					value: `${textChannel.rateLimitPerUser} seconds`,
					inline: true,
				});
			}

			embed.addFields({
				name: "🔞 NSFW",
				value: textChannel.nsfw ? "Yes" : "No",
				inline: true,
			});
		}

		if (channel.type === ChannelType.GuildVoice || channel.type === ChannelType.GuildStageVoice) {
			const voiceChannel = channel as any;
			
			embed.addFields(
				{
					name: "👥 User Limit",
					value: voiceChannel.userLimit === 0 ? "Unlimited" : voiceChannel.userLimit.toString(),
					inline: true,
				},
				{
					name: "🔊 Bitrate",
					value: `${voiceChannel.bitrate / 1000}kbps`,
					inline: true,
				}
			);

			if (voiceChannel.members.size > 0) {
				embed.addFields({
					name: "👤 Current Members",
					value: voiceChannel.members.map((member: any) => member.displayName).join(", ") || "None",
					inline: false,
				});
			}
		}

		if (channel.parent) {
			embed.addFields({
				name: "📁 Category",
				value: channel.parent.name,
				inline: true,
			});
		}

		embed.setFooter({
			text: `Requested by ${interaction.user.tag}`,
			iconURL: interaction.user.displayAvatarURL(),
		});

		await interaction.reply({ embeds: [embed] });
	},
};
