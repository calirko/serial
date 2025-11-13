import { EmbedBuilder } from "discord.js";
import type { ClientCommand } from "../types";

const nameLocalizations = {
	"pt-BR": "membercount",
	"en-US": "membercount",
};

const descriptionLocalizations = {
	"pt-BR": "Mostrar informações sobre membros do servidor",
	"en-US": "Show server member information",
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

		// Fetch all members to get accurate counts
		await guild.members.fetch();

		const totalMembers = guild.memberCount;
		const humans = guild.members.cache.filter(member => !member.user.bot).size;
		const bots = guild.members.cache.filter(member => member.user.bot).size;
		const online = guild.members.cache.filter(member => 
			member.presence?.status === 'online' || 
			member.presence?.status === 'idle' || 
			member.presence?.status === 'dnd'
		).size;
		const offline = totalMembers - online;

		// Status breakdown
		const onlineMembers = guild.members.cache.filter(member => member.presence?.status === 'online').size;
		const idleMembers = guild.members.cache.filter(member => member.presence?.status === 'idle').size;
		const dndMembers = guild.members.cache.filter(member => member.presence?.status === 'dnd').size;
		const offlineMembers = guild.members.cache.filter(member => 
			!member.presence || member.presence.status === 'offline'
		).size;

		const embed = new EmbedBuilder()
			.setColor("#5865F2")
			.setTitle(`Member Count - ${guild.name}`)
			.setThumbnail(guild.iconURL())
			.addFields(
				{
					name: "👥 Total Members",
					value: totalMembers.toString(),
					inline: true,
				},
				{
					name: "👤 Humans",
					value: humans.toString(),
					inline: true,
				},
				{
					name: "🤖 Bots",
					value: bots.toString(),
					inline: true,
				},
				{
					name: "🟢 Online",
					value: onlineMembers.toString(),
					inline: true,
				},
				{
					name: "🟡 Idle",
					value: idleMembers.toString(),
					inline: true,
				},
				{
					name: "🔴 Do Not Disturb",
					value: dndMembers.toString(),
					inline: true,
				},
				{
					name: "⚫ Offline",
					value: offlineMembers.toString(),
					inline: true,
				},
				{
					name: "📊 Activity Summary",
					value: `${online} active / ${offline} inactive`,
					inline: true,
				}
			)
			.setFooter({
				text: `Requested by ${interaction.user.tag}`,
				iconURL: interaction.user.displayAvatarURL(),
			})
			.setTimestamp();

		await interaction.reply({ embeds: [embed] });
	},
};
