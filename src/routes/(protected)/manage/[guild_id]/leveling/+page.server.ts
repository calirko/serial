import type { PageServerLoad } from './$types';
import db from '$lib/prisma';

export const load: PageServerLoad = async ({ params, locals }) => {
    const { guild_id } = params;
    const dcClient = locals.client;

    // Fetch the leveling data for the guild
    const guild = await db.guild.findUnique({
        where: { id: guild_id },
        select: {
            leveling: true,
        },
    });

    // Fetch guild roles
    const roles = dcClient.guilds.cache.get(guild_id)?.roles.cache
        .filter((r: { name: string }) => r.name !== '@everyone')
        .map((r: { name: string; id: string }) => ({ name: r.name, id: r.id }))

    if (!guild) {
        throw new Error(`Guild with ID ${guild_id} not found`);
    }

    return {
        leveling: guild.leveling as { 
            enabled: boolean; 
            xpMin: number; 
            xpMax: number; 
            levelUpMessage: string;
            levelRoles: Array<{ level: number; roleId: string }>;
        } || { 
            enabled: true, 
            xpMin: 15, 
            xpMax: 25, 
            levelUpMessage: '🏠 {user_mention}, you reached level **{level}** in this server! keep going~',
            levelRoles: [],
        },
        roles: roles || [],
    };
};
