<script lang="ts">
import { Button } from "$lib/components/ui/button";
import { Search, Menu } from "lucide-svelte";
</script>

<header class="bg-[#061726] flex h-[70px] px-7 sticky top-0 left-0 z-50 justify-between items-center">
    <div class="flex items-center">
        <div class="flex items-center">
            <img src="/favicon.png" alt="anchor" class="w-1/4 h-1/4">
            <span class="ml-2 font-['Tahoma'] text-white text-xs">anchor</span>
        </div>
    </div>
    <form class="hidden md:flex bg-[#1f2e36] focus-within:border focus-within:border-[#d6e0ea] w-[40%] text-white text-sm item-center px-3 rounded-xl">
        <input type="text" placeholder="search" class="flex-1 outline-none bg-transparent">
        <Button variant="ghost" size="icon" class="w-[35px] h-[35px] hover:bg-[#3b5369]">
            <Search class="w-[35px] h-[35px]" ></Search>
        </Button>
    </form>
    <div class="flex items-center gap-7">
        <Button variant="ghost" size="icon" class="md:hidden w-[35px] h-[35px]">
            <Search class="w-[35px] h-[35px]" ></Search>
        </Button>
        <Button variant="ghost" size="icon" class="w-[35px] h-[35px] hover:bg-[#3b5369]">
            <Menu class="w-[35px] h-[35px]" color="white" ></Menu>
        </Button>
    </div>
</header>