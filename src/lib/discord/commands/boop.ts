import type { ClientCommand } from "../types";

const nameLocalizations = {
	"pt-BR": "boop",
	"en-US": "boop",
};

const descriptionLocalizations = {
	"pt-BR": "Boop no nariz! *toca suavemente*",
	"en-US": "Boop the nose! *gentle touch*",
};

const responseLocalizations: Record<string, string> = {
	"pt-BR": "*pisca* boop! hehe~ você me boopou >///< ✨",
	"en-US": "*blinks* boop! hehe~ you booped me >///< ✨",
};

export const command: ClientCommand = {
	name: nameLocalizations["en-US"],
   category: "interaction",
	nameLocalizations,
	descriptionLocalizations,
	description: descriptionLocalizations["en-US"],
	execute: async (interaction) => {
		const local = interaction.guild?.preferredLocale;
		await interaction.reply(responseLocalizations[local ?? "en-US"]);
	},
};
