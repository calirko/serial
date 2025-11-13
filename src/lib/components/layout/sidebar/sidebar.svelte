<script>
   import Guilds from "$lib/components/popover/guilds.svelte";
   import { Button } from "$lib/components/ui/button";
   import { AlarmClock, ChevronDown, House, TrendingUp } from "@lucide/svelte";
   import UserDropdown from "./userDropdown.svelte";

   const sidebarItems = [
      {
         name: "Geral",
         children: [
            {
               name: "Home",
               icon: House,
               href: "/",
            },
         ],
      },
      {
         name: "Portaria",
         children: [
            { name: "Entrada/Saída", icon: AlarmClock, href: "join-leave" },
         ],
      },
      {
         name: "Engajamento",
         children: [
            { name: "Sistema de Níveis", icon: TrendingUp, href: "leveling" },
         ],
      },
   ];

   export let guild;
   export let session;
</script>

<div class="border-r w-80 overflow-hidden gap-2 flex flex-col">
   <div
      class="w-full p-3 px-6 flex gap-2 justify-between items-center border-b"
   >
      <b>:: Serial</b>
      <!-- <Guilds {guild}>
         <span class="flex gap-1 items-center">
            <p class="text-primary">{guild.name}</p>
            <ChevronDown />
         </span>
      </Guilds> -->
      <UserDropdown {session}>
         <span class="flex gap-1 items-center">
            <p class="text-primary">{guild.name}</p>
            <ChevronDown />
         </span>
      </UserDropdown>
   </div>

   <div class="p-2 flex flex-col gap-3">
      {#each sidebarItems as category}
         <div>
            <p class="text-xs ml-2 mb-1">{category.name}</p>
            <div class="flex flex-col gap-1">
               {#each category.children as item}
                  <Button
                     class="w-full justify-start"
                     variant="ghost"
                     href={item.href}
                  >
                     <svelte:component this={item.icon} class="mr-2 h-4 w-4" />
                     {item.name}
                  </Button>
               {/each}
            </div>
         </div>
      {/each}
   </div>
</div>
