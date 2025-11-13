import { ChannelType, PermissionFlagsBits } from "discord.js";
import type { ClientCommand } from "../types";

const nameLocalizations = {
	"pt-BR": "trancar",
	"en-US": "lock",
};

const descriptionLocalizations = {
	"pt-BR": "Trancar um canal para impedir mensagens",
	"en-US": "Lock a channel to prevent messages",
};

export const command: ClientCommand = {
	name: nameLocalizations["en-US"],
	category: "moderation",
	nameLocalizations,
	descriptionLocalizations,
	description: descriptionLocalizations["en-US"],
	options: [
		{
			name: "channel",
			nameLocalizations: {
				"pt-BR": "canal",
				"en-US": "channel",
			},
			description: "Channel to lock (current channel if not specified)",
			descriptionLocalizations: {
				"pt-BR": "Canal para trancar (canal atual se não especificado)",
				"en-US": "Channel to lock (current channel if not specified)",
			},
			type: 7, // CHANNEL type
			required: false,
		},
	],
	defaultMemberPermissions: PermissionFlagsBits.ManageChannels,
	execute: async (interaction) => {
		const local = interaction.guild?.preferredLocale;
		
		if (!interaction.guild) {
			await interaction.reply({
				content: local === "pt-BR" 
					? "só funciona em servidores, miau~" 
					: "only works in servers, meow~",
				ephemeral: true,
			});
			return;
		}

		// Get the target channel (specified or current)
		const channelOption = interaction.options.get("channel");
		let targetChannel;
		
		if (channelOption && channelOption.channel) {
			// Fetch the full channel object
			targetChannel = await interaction.guild.channels.fetch(channelOption.channel.id);
		} else {
			// Use current channel
			targetChannel = interaction.channel;
		}
		
		if (!targetChannel) {
			await interaction.reply({
				content: local === "pt-BR"
					? "hm... não achei o canal~"
					: "hmm... can't find that channel~",
				ephemeral: true,
			});
			return;
		}

		// Check if it's a text-based channel
		if (targetChannel.type !== ChannelType.GuildText && 
		    targetChannel.type !== ChannelType.GuildAnnouncement &&
		    targetChannel.type !== ChannelType.PublicThread &&
		    targetChannel.type !== ChannelType.PrivateThread) {
			await interaction.reply({
				content: local === "pt-BR"
					? "só posso trancar canais de texto, miau~"
					: "can only lock text channels, meow~",
				ephemeral: true,
			});
			return;
		}

		try {
			// Lock the channel by denying Send Messages permission for @everyone
			await targetChannel.permissionOverwrites.edit(
				interaction.guild.roles.everyone,
				{
					SendMessages: false,
				}
			);

			await interaction.reply({
				content: local === "pt-BR"
					? `🔒 tranquei <#${targetChannel.id}> pra você~`
					: `🔒 locked <#${targetChannel.id}> for you~`,
			});
		} catch (error) {
			console.error("Error locking channel:", error);
			await interaction.reply({
				content: local === "pt-BR"
					? "ops... não consegui trancar o canal~"
					: "oops... couldn't lock the channel~",
				ephemeral: true,
			});
		}
	},
};
