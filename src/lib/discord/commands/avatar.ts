import { EmbedBuilder, ApplicationCommandOptionType } from "discord.js";
import type { ClientCommand } from "../types";

const nameLocalizations = {
	"pt-BR": "avatar",
	"en-US": "avatar",
};

const descriptionLocalizations = {
	"pt-BR": "Obter o avatar de um usuário",
	"en-US": "Get a user's avatar",
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
			description: "The user to get the avatar of",
			descriptionLocalizations: {
				"pt-BR": "O usuário para obter o avatar",
				"en-US": "The user to get the avatar of",
			},
			required: false,
		},
		{
			name: "size",
			type: ApplicationCommandOptionType.String,
			description: "Avatar size",
			descriptionLocalizations: {
				"pt-BR": "Tamanho do avatar",
				"en-US": "Avatar size",
			},
			required: false,
			choices: [
				{ name: "Small (128px)", value: "128" },
				{ name: "Medium (256px)", value: "256" },
				{ name: "Large (512px)", value: "512" },
				{ name: "Extra Large (1024px)", value: "1024" },
			],
		},
	],
	execute: async (interaction) => {
		const userOption = interaction.options?.data?.find(option => option.name === 'user');
		const sizeOption = interaction.options?.data?.find(option => option.name === 'size');
		
		const targetUser = userOption?.user || interaction.user;
		const size = parseInt(sizeOption?.value as string || "512");

		const avatarURL = targetUser.displayAvatarURL({ 
			size: size as 128 | 256 | 512 | 1024,
			extension: 'png'
		});

		const embed = new EmbedBuilder()
			.setColor("#5865F2")
			.setTitle(`${targetUser.tag}'s Avatar`)
			.setImage(avatarURL)
			.setDescription(`[Download Avatar](${avatarURL})`)
			.addFields(
				{
					name: "👤 User",
					value: `${targetUser.tag}`,
					inline: true,
				},
				{
					name: "🆔 User ID",
					value: `\`${targetUser.id}\``,
					inline: true,
				},
				{
					name: "📐 Size",
					value: `${size}x${size}px`,
					inline: true,
				}
			)
			.setFooter({
				text: `Requested by ${interaction.user.tag}`,
				iconURL: interaction.user.displayAvatarURL(),
			});

		await interaction.reply({ embeds: [embed] });
	},
};
