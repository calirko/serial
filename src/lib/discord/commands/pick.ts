import type { ClientCommand } from "../types";

const nameLocalizations = {
	"pt-BR": "escolher",
	"en-US": "pick",
};

const descriptionLocalizations = {
	"pt-BR": "Escolha aleatoriamente de uma lista de opcoes",
	"en-US": "Pick randomly from a list of options",
};

export const command: ClientCommand = {
	name: nameLocalizations["en-US"],
	category: "fun",
	nameLocalizations,
	descriptionLocalizations,
	description: descriptionLocalizations["en-US"],
	execute: async (interaction) => {
		const local = interaction.guild?.preferredLocale;
		
		// Sample lists for demonstration
		const sampleLists = [
			["Pizza", "Burger", "Sushi", "Tacos", "Pasta"],
			["Red", "Blue", "Green", "Yellow", "Purple"],
			["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
			["Cat", "Dog", "Bird", "Fish", "Rabbit"],
			["Summer", "Winter", "Spring", "Fall"]
		];
		
		const randomList = sampleLists[Math.floor(Math.random() * sampleLists.length)];
		const randomChoice = randomList[Math.floor(Math.random() * randomList.length)];
		
		// Create a nice display of options
		const optionsDisplay = randomList.map((option, index) => 
			option === randomChoice ? `**${index + 1}. ${option}** ← CHOSEN` : `${index + 1}. ${option}`
		).join('\n');
		
		const responseText = local === "pt-BR" 
			? `🎯 escolhi... **${randomChoice}**~`
			: `🎯 i picked... **${randomChoice}**~`;
		
		await interaction.reply(responseText);
	},
};
