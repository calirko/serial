import { EmbedBuilder, ApplicationCommandOptionType } from "discord.js";
import type { ClientCommand } from "../types";

const nameLocalizations = {
	"pt-BR": "banner",
	"en-US": "banner",
};

const descriptionLocalizations = {
	"pt-BR": "Obter o banner de um usuário",
	"en-US": "Get a user's banner",
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
			description: "The user to get the banner of",
			descriptionLocalizations: {
				"pt-BR": "O usuário para obter o banner",
				"en-US": "The user to get the banner of",
			},
			required: false,
		},
	],
	execute: async (interaction) => {
		const userOption = interaction.options?.data?.find(option => option.name === 'user');
		const targetUser = userOption?.user || interaction.user;

		// Fetch the user to get their banner
		const fetchedUser = await interaction.client.users.fetch(targetUser.id, { force: true });
		
		if (!fetchedUser.banner) {
			const embed = new EmbedBuilder()
				.setColor("#FF6B6B")
				.setTitle("No Banner Found")
				.setDescription(`${targetUser.tag} doesn't have a banner set.`)
				.setThumbnail(targetUser.displayAvatarURL())
				.setFooter({
					text: `Requested by ${interaction.user.tag}`,
					iconURL: interaction.user.displayAvatarURL(),
				});

			await interaction.reply({ embeds: [embed] });
			return;
		}

		const bannerURL = fetchedUser.bannerURL({ size: 512 });
		if (!bannerURL) {
			await interaction.reply({
				content: "Unable to retrieve banner URL.",
				ephemeral: true,
			});
			return;
		}

		const embed = new EmbedBuilder()
			.setColor("#5865F2")
			.setTitle(`${targetUser.tag}'s Banner`)
			.setImage(bannerURL)
			.setDescription(`[Download Banner](${bannerURL})`)
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
				}
			)
			.setFooter({
				text: `Requested by ${interaction.user.tag}`,
				iconURL: interaction.user.displayAvatarURL(),
			});

		await interaction.reply({ embeds: [embed] });
	},
};
