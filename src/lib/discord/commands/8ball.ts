import type { ClientCommand } from "../types";

const nameLocalizations = {
	"pt-BR": "8ball",
	"en-US": "8ball",
};

const descriptionLocalizations = {
	"pt-BR": "Faca uma pergunta para a bola magica do destino",
	"en-US": "Ask the magic 8-ball a question",
};

export const command: ClientCommand = {
	name: nameLocalizations["en-US"],
	category: "fun",
	nameLocalizations,
	descriptionLocalizations,
	description: descriptionLocalizations["en-US"],
	execute: async (interaction) => {
		const local = interaction.guild?.preferredLocale;
		
		const responses = {
			positive: {
				"pt-BR": [
					"Sim, definitivamente!",
					"Com certeza!",
					"Sem duvida alguma!",
					"Sim, pode apostar!",
					"Parece promissor!",
					"Sinais apontam que sim!"
				],
				"en-US": [
					"Yes, definitely!",
					"Absolutely!",
					"Without a doubt!",
					"Yes, you can count on it!",
					"It looks promising!",
					"Signs point to yes!"
				]
			},
			negative: {
				"pt-BR": [
					"Nao conte com isso",
					"Melhor nao",
					"Minhas fontes dizem que nao",
					"Muito duvidoso",
					"Nao parece provavel",
					"Definitivamente nao"
				],
				"en-US": [
					"Don't count on it",
					"Better not",
					"My sources say no",
					"Very doubtful",
					"Doesn't look likely",
					"Definitely not"
				]
			},
			neutral: {
				"pt-BR": [
					"Pergunte novamente mais tarde",
					"Nao posso prever agora",
					"Concentre-se e pergunte novamente",
					"Incerto",
					"Talvez sim, talvez nao",
					"As perspectivas nao sao muito boas"
				],
				"en-US": [
					"Ask again later",
					"Cannot predict now",
					"Concentrate and ask again",
					"Uncertain",
					"Maybe yes, maybe no",
					"Outlook not so good"
				]
			}
		};
		
		// Random category selection
		const categories = ['positive', 'negative', 'neutral'];
		const randomCategory = categories[Math.floor(Math.random() * categories.length)];
		const locale = local === "pt-BR" ? "pt-BR" : "en-US";
		const categoryResponses = responses[randomCategory as keyof typeof responses][locale];
		const randomResponse = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
		
		const responseText = local === "pt-BR" 
			? `🎱 *a bola sussurra...*\n**"${randomResponse}"**\n*balança~*`
			: `🎱 *the ball whispers...*\n**"${randomResponse}"**\n*shakes~*`;
		
		await interaction.reply(responseText);
	},
};
