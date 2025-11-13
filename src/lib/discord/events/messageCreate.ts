import type { Message } from "discord.js";
import type { ClientEvent } from "../types";
import db from "../../prisma";

// Calculate level from XP
function calculateLevel(xp: number): number {
	return Math.floor(0.1 * Math.sqrt(xp));
}

// XP cooldown map to prevent spam (userId -> timestamp)
const xpCooldowns = new Map<string, number>();
const COOLDOWN_MS = 60000; // 1 minute cooldown between XP gains

export const event: ClientEvent = {
	name: "messageCreate",
	execute: async (message: Message) => {
		// Ignore bot messages
		if (message.author.bot) return;
		
		// Only process messages in guilds
		if (!message.guild) return;

		const userId = message.author.id;
		const guildId = message.guild.id;
		const now = Date.now();

		// Check cooldown
		const lastXp = xpCooldowns.get(`${userId}-${guildId}`);
		if (lastXp && now - lastXp < COOLDOWN_MS) {
			return;
		}

		try {
			// Random XP between 15-25 per message (standard, not configurable for global)
			const xpGain = Math.floor(Math.random() * 11) + 15;

			// Update global XP (always enabled, not configurable)
			let globalMember = await db.member.findFirst({
				where: {
					userId: userId,
					guildId: "global",
				},
			});

			const oldGlobalLevel = globalMember ? calculateLevel(globalMember.xp) : 0;

			if (!globalMember) {
				globalMember = await db.member.create({
					data: {
						userId: userId,
						guildId: "global",
						xp: xpGain,
						level: calculateLevel(xpGain),
						messages: 1,
					},
				});
			} else {
				const newXp = globalMember.xp + xpGain;
				const newLevel = calculateLevel(newXp);
				
				globalMember = await db.member.update({
					where: {
						id: globalMember.id,
					},
					data: {
						xp: newXp,
						level: newLevel,
						messages: globalMember.messages + 1,
						lastXpAt: new Date(),
					},
				});

				// Notify on global level up
				if (newLevel > oldGlobalLevel) {
					if (message.channel.isTextBased() && 'send' in message.channel) {
						await message.channel.send(
							`🌍 ${message.author}, you reached global level **${newLevel}**! nice~`
						);
					}
				}
			}

			// Check if guild has leveling enabled
			const guild = await db.guild.findUnique({
				where: {
					id: guildId,
				},
			});

			// Default: leveling is enabled unless explicitly disabled
			const levelingConfig = guild?.leveling as any;
			const guildLevelingEnabled = levelingConfig?.enabled !== false;

			if (guildLevelingEnabled) {
				// Get guild-specific XP settings (or use defaults)
				const guildXpMin = levelingConfig?.xpMin || 15;
				const guildXpMax = levelingConfig?.xpMax || 25;
				const guildXpGain = Math.floor(Math.random() * (guildXpMax - guildXpMin + 1)) + guildXpMin;

				// Update guild XP
				let guildMember = await db.member.findFirst({
					where: {
						userId: userId,
						guildId: guildId,
					},
				});

				const oldGuildLevel = guildMember ? calculateLevel(guildMember.xp) : 0;

				if (!guildMember) {
					guildMember = await db.member.create({
						data: {
							userId: userId,
							guildId: guildId,
							xp: guildXpGain,
							level: calculateLevel(guildXpGain),
							messages: 1,
						},
					});
				} else {
					const newXp = guildMember.xp + guildXpGain;
					const newLevel = calculateLevel(newXp);
					
					guildMember = await db.member.update({
						where: {
							id: guildMember.id,
						},
						data: {
							xp: newXp,
							level: newLevel,
							messages: guildMember.messages + 1,
							lastXpAt: new Date(),
						},
					});

					// Notify on guild level up
					if (newLevel > oldGuildLevel) {
						// Check for custom level up message
						const levelUpMessage = levelingConfig?.levelUpMessage || 
							`🏠 {user_mention}, you reached level **{level}** in this server! keep going~`;
						
						const formattedMessage = levelUpMessage
							.replace(/{user_mention}/g, `${message.author}`)
							.replace(/{user_name}/g, message.author.username)
							.replace(/{level}/g, newLevel.toString())
							.replace(/{guild_name}/g, message.guild.name);

						if (message.channel.isTextBased() && 'send' in message.channel) {
							await message.channel.send(formattedMessage);
						}

						// Check for level roles
						if (levelingConfig?.levelRoles && Array.isArray(levelingConfig.levelRoles)) {
							const member = message.member;
							if (member) {
								for (const roleConfig of levelingConfig.levelRoles) {
									if (roleConfig.level === newLevel && roleConfig.roleId) {
										try {
											const role = message.guild.roles.cache.get(roleConfig.roleId);
											if (role && !member.roles.cache.has(roleConfig.roleId)) {
												await member.roles.add(role);
												if (message.channel.isTextBased() && 'send' in message.channel) {
													await message.channel.send(
														`🎭 ${message.author}, you earned the **${role.name}** role!`
													);
												}
											}
										} catch (error) {
											console.error("Error assigning level role:", error);
										}
									}
								}
							}
						}
					}
				}
			}

			// Update cooldown
			xpCooldowns.set(`${userId}-${guildId}`, now);

		} catch (error) {
			console.error("Error processing XP gain:", error);
		}
	},
};
