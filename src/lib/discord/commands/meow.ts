import type { ClientCommand } from "../types";

const nameLocalizations = {
	"pt-BR": "miau",
	"en-US": "meow",
};

const descriptionLocalizations = {
	"pt-BR": "Miau! Faça um barulhinho de gato~",
	"en-US": "Meow! Make a cute cat sound~",
};

const responseLocalizations: Record<string, string> = {
	"pt-BR": "miau miau~ *faz barulho de gato* prrr~ ✨",
	"en-US": "meow meow~ *cat noises* purrr~ ✨",
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
