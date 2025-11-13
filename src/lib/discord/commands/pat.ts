import type { ClientCommand } from "../types";

const nameLocalizations = {
	"pt-BR": "cafuné",
	"en-US": "pat",
};

const descriptionLocalizations = {
	"pt-BR": "Receba um cafuné carinhoso!",
	"en-US": "Get some gentle head pats!",
};

const responseLocalizations: Record<string, string> = {
	"pt-BR": "*ronrona e encosta na sua mão* mmm~ cafuné... mais? (˶ᵔ ᵕ ᵔ˶)",
	"en-US": "*purrs and leans in* mmm~ head pats... more? (˶ᵔ ᵕ ᵔ˶)",
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
