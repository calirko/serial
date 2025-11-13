import type { ClientCommand } from "../types";

const nameLocalizations = {
	"pt-BR": "serial",
	"en-US": "serial",
};

const descriptionLocalizations = {
	"pt-BR": "Saiba um pouco mais sobre mim!",
	"en-US": "Learn a little more about me!",
};

const responseLocalizations: Record<string, string> = {
	"pt-BR":
		"oi... sou o serial, um bot discord~ adoro ajudar e fazer coisas de protogen, me faz sentir útil~",
	"en-US":
		"hey... i'm serial, a discord bot~ love helping and doing protogen things, makes me feel useful~",
};

export const command: ClientCommand = {
	name: nameLocalizations["en-US"],
   category: "system",
	nameLocalizations,
	descriptionLocalizations,
	description: descriptionLocalizations["en-US"],
	execute: async (interaction) => {
		const local = interaction.guild?.preferredLocale;
		await interaction.reply(responseLocalizations[local ?? "en-US"]);
	},
};
