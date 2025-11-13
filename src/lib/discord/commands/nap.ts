import type { ClientCommand } from "../types";

const nameLocalizations = {
	"pt-BR": "soneca",
	"en-US": "nap",
};

const descriptionLocalizations = {
	"pt-BR": "Hora da soneca! ZzZ...",
	"en-US": "Time for a nap! ZzZ...",
};

const responseLocalizations: Record<string, string> = {
	"pt-BR": "*se enrola e fecha os olhos* zzz... *ronrona baixinho* boa noite~ (˘▾˘)~♪",
	"en-US": "*curls up and closes eyes* zzz... *soft purrs* night~ (˘▾˘)~♪",
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
