<script lang="ts">
   import SettingOption from "$lib/components/layout/setting/settingOption.svelte";
   import SettingPageTitle from "$lib/components/layout/setting/settingPageTitle.svelte";
   import SettingSave from "$lib/components/layout/setting/settingSave.svelte";
   import Button from "$lib/components/ui/button/button.svelte";
   import Switch from "$lib/components/ui/switch/switch.svelte";
   import { Textarea } from "$lib/components/ui/textarea";
   import { Input } from "$lib/components/ui/input";
   import { Plus, Trash2 } from "@lucide/svelte";

   const { data } = $props();

   let originalData = data;

   let leveling = $state({
      enabled: data.leveling.enabled ?? true,
      xpMin: data.leveling.xpMin ?? 15,
      xpMax: data.leveling.xpMax ?? 25,
      levelUpMessage: data.leveling.levelUpMessage ?? '🏠 {user_mention}, you reached level **{level}** in this server! keep going~',
      levelRoles: data.leveling.levelRoles ?? [],
   });

   function hasChanges() {
      return JSON.stringify(leveling) !== JSON.stringify(originalData.leveling);
   }

   async function saveChanges() {
      console.log("Leveling Settings:", leveling);

      try {
         const response = await fetch(`/api/guild/${data.guild.id}/setting`, {
            method: "PATCH",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${data.session.user.access_token}`,
            },
            body: JSON.stringify({
               leveling,
            }),
         });

         if (!response.ok) {
            throw new Error("Failed to save settings");
         }

         const result = await response.json();
         console.log("Settings saved successfully:", result);

         window.location.reload();
      } catch (error) {
         console.error("Error saving settings:", error);
      }
   }

   function addLevelRole() {
      leveling.levelRoles = [...leveling.levelRoles, { level: 1, roleId: "" }];
   }

   function removeLevelRole(index: number) {
      leveling.levelRoles = leveling.levelRoles.filter((_, i) => i !== index);
   }
</script>

<div class="h-full min-h-full">
   <SettingPageTitle
      title="Sistema de Níveis"
      description="Configurações do sistema de XP e níveis do servidor."
   />

   <div class="pb-4">
      <SettingOption
         title="Sistema de Níveis do Servidor"
         description="Ativar ou desativar o sistema de níveis neste servidor. O sistema global está sempre ativo."
      >
         <Switch bind:checked={leveling.enabled} />
      </SettingOption>

      <SettingOption
         title="XP Mínimo por Mensagem"
         description="Quantidade mínima de XP que um usuário pode ganhar por mensagem."
         disabled={!leveling.enabled}
         row
      >
         <Input
            type="number"
            min="1"
            max="100"
            bind:value={leveling.xpMin}
            disabled={!leveling.enabled}
            class="w-32"
         />
      </SettingOption>

      <SettingOption
         title="XP Máximo por Mensagem"
         description="Quantidade máxima de XP que um usuário pode ganhar por mensagem."
         disabled={!leveling.enabled}
         row
      >
         <Input
            type="number"
            min="1"
            max="100"
            bind:value={leveling.xpMax}
            disabled={!leveling.enabled}
            class="w-32"
         />
      </SettingOption>

      <SettingOption
         title="Mensagem de Subida de Nível"
         description="Mensagem enviada quando um usuário sobe de nível."
         disabled={!leveling.enabled}
         row
      >
         <Textarea
            class="w-full"
            bind:value={leveling.levelUpMessage}
            disabled={!leveling.enabled}
         />
         <ul class="text-xs mt-2 list-disc list-inside">
            <p class="mb-1">Placeholders disponíveis:</p>
            <li><strong>{`{user_mention}`}</strong>: Menção ao usuário.</li>
            <li><strong>{`{user_name}`}</strong>: Nome do usuário.</li>
            <li><strong>{`{level}`}</strong>: Novo nível alcançado.</li>
            <li><strong>{`{guild_name}`}</strong>: Nome do servidor.</li>
         </ul>
      </SettingOption>

      <SettingOption
         title="Cargos por Nível"
         description="Configurar cargos automáticos ao atingir certos níveis."
         disabled={!leveling.enabled}
      >
         <div class="w-full">
            {#each leveling.levelRoles as roleConfig, index}
               <div class="flex gap-2 items-center mb-2">
                  <span class="text-sm">Nível:</span>
                  <Input
                     type="number"
                     min="1"
                     bind:value={roleConfig.level}
                     disabled={!leveling.enabled}
                     class="w-24"
                  />
                  <span class="text-sm">Cargo:</span>
                  <select
                     bind:value={roleConfig.roleId}
                     disabled={!leveling.enabled}
                     class="flex-1 px-3 py-2 border rounded-md"
                  >
                     <option value="">Selecione um cargo</option>
                     {#each data.roles as role}
                        <option value={role.id}>{role.name}</option>
                     {/each}
                  </select>
                  <Button
                     variant="outline"
                     size="sm"
                     onclick={() => removeLevelRole(index)}
                     disabled={!leveling.enabled}
                  >
                     <Trash2 class="size-4" />
                  </Button>
               </div>
            {/each}
            <Button
               variant="outline"
               size="sm"
               onclick={addLevelRole}
               disabled={!leveling.enabled}
            >
               <Plus class="size-4" /> Adicionar Cargo de Nível
            </Button>
         </div>
      </SettingOption>

      <div class="mt-4 p-4 bg-muted rounded-lg">
         <h3 class="font-semibold mb-2">📝 Nota sobre o Sistema Global</h3>
         <p class="text-sm text-muted-foreground">
            O sistema de XP global rastreia o progresso dos usuários em todos os servidores e <strong>não é configurável</strong>. 
            As configurações acima afetam apenas o sistema de níveis específico deste servidor.
         </p>
      </div>
   </div>

   <SettingSave hasChanges={hasChanges()} onSave={saveChanges} />
</div>
