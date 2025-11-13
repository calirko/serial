import { EmbedBuilder } from "discord.js";
import type { ClientCommand } from "../types";

const nameLocalizations = {
	"pt-BR": "roles",
	"en-US": "roles",
};

const descriptionLocalizations = {
	"pt-BR": "Listar todos os cargos do servidor",
	"en-US": "List all server roles",
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

		const roles = guild.roles.cache
			.filter(role => role.name !== '@everyone')
			.sort((a, b) => b.position - a.position)
			.map(role => {
				const memberCount = role.members.size;
				const color = role.hexColor !== '#000000' ? role.hexColor : 'Default';
				return `${role} - ${memberCount} members (${color})`;
			});

		if (roles.length === 0) {
			const embed = new EmbedBuilder()
				.setColor("#FF6B6B")
				.setTitle("No Roles Found")
				.setDescription("This server has no roles other than @everyone.")
				.setFooter({
					text: `Requested by ${interaction.user.tag}`,
					iconURL: interaction.user.displayAvatarURL(),
				});

			await interaction.reply({ embeds: [embed] });
			return;
		}

		// Split roles into chunks to avoid embed field limit
		const chunks = [];
		const chunkSize = 20;
		for (let i = 0; i < roles.length; i += chunkSize) {
			chunks.push(roles.slice(i, i + chunkSize));
		}

		const embeds = chunks.map((chunk, index) => {
			const embed = new EmbedBuilder()
				.setColor("#5865F2")
				.setTitle(index === 0 ? `Server Roles - ${guild.name}` : `Server Roles (Page ${index + 1})`)
				.setDescription(chunk.join('\n'))
				.addFields({
					name: "📊 Statistics",
					value: `Total Roles: ${roles.length}\nShowing: ${index * chunkSize + 1}-${Math.min((index + 1) * chunkSize, roles.length)}`,
					inline: false,
				});

			if (index === 0 && guild.iconURL()) {
				embed.setThumbnail(guild.iconURL());
			}

			embed.setFooter({
				text: `Requested by ${interaction.user.tag}`,
				iconURL: interaction.user.displayAvatarURL(),
			});

			return embed;
		});

		// Send first embed, then follow up with additional pages if needed
		await interaction.reply({ embeds: [embeds[0]] });

		for (let i = 1; i < embeds.length; i++) {
			await interaction.followUp({ embeds: [embeds[i]] });
		}
	},
};
