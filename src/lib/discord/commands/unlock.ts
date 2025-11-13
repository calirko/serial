import { ChannelType, PermissionFlagsBits } from "discord.js";
import type { ClientCommand } from "../types";

const nameLocalizations = {
	"pt-BR": "destrancar",
	"en-US": "unlock",
};

const descriptionLocalizations = {
	"pt-BR": "Destrancar um canal para permitir mensagens",
	"en-US": "Unlock a channel to allow messages",
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
			description: "Channel to unlock (current channel if not specified)",
			descriptionLocalizations: {
				"pt-BR": "Canal para destrancar (canal atual se não especificado)",
				"en-US": "Channel to unlock (current channel if not specified)",
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
					? "só posso destrancar canais de texto, miau~"
					: "can only unlock text channels, meow~",
				ephemeral: true,
			});
			return;
		}

		try {
			// Unlock the channel by removing the Send Messages override
			await targetChannel.permissionOverwrites.edit(
				interaction.guild.roles.everyone,
				{
					SendMessages: null,
				}
			);

			await interaction.reply({
				content: local === "pt-BR"
					? `🔓 destrancado <#${targetChannel.id}> pra você~`
					: `🔓 unlocked <#${targetChannel.id}> for you~`,
			});
		} catch (error) {
			console.error("Error unlocking channel:", error);
			await interaction.reply({
				content: local === "pt-BR"
					? "ops... não consegui destrancar o canal~"
					: "oops... couldn't unlock the channel~",
				ephemeral: true,
			});
		}
	},
};
