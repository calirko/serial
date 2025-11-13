import type { ClientCommand } from "../types";

const nameLocalizations = {
	"pt-BR": "reverse",
	"en-US": "reverse",
};

const descriptionLocalizations = {
	"pt-BR": "Inverta qualquer texto de tras para frente",
	"en-US": "Reverse any text backwards",
};

export const command: ClientCommand = {
	name: nameLocalizations["en-US"],
	category: "fun",
	nameLocalizations,
	descriptionLocalizations,
	description: descriptionLocalizations["en-US"],
	execute: async (interaction) => {
		const local = interaction.guild?.preferredLocale;
		
		// Sample texts for demonstration
		const sampleTexts = [
			"Hello World",
			"Programming is fun",
			"Discord Bot",
			"Reverse this text",
			"Cat bot meow"
		];
		
		const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
		const reversedText = randomText.split('').reverse().join('');
		
		// Also reverse word order for extra fun
		const wordReversed = randomText.split(' ').reverse().join(' ');
		
		const responseText = local === "pt-BR" 
			? `🔄 **original:** ${randomText}\n` +
			  `**invertido:** ${reversedText}`
			: `🔄 **original:** ${randomText}\n` +
			  `**reversed:** ${reversedText}`;
		
		await interaction.reply(responseText);
	},
};
