import type { ClientCommand } from "../types";

const nameLocalizations = {
	"pt-BR": "fofo",
	"en-US": "cute",
};

const descriptionLocalizations = {
	"pt-BR": "O que?? Alguém é fofo!",
	"en-US": "Wha-? someone's cute!",
};

const responseLocalizations: Record<string, string> = {
	"pt-BR":
		"eh... não sou fofo não, viu? sou um protogen sério... >w<",
	"en-US": "hm... 'm not cute, okay? i'm a serious protogen... >w<",
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
