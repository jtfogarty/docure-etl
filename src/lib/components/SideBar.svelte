<script lang="ts">
    import { Home, ScrollText, Book, FileText, TrendingUp, Settings } from "lucide-svelte";
</script>

<nav class="w-[80px] text-[#f3f5f8] bg-[#1a2a37] fixed top-[70px] left-0 flex flex-col h-[calc(100vh-70px)]">
    <div class="flex flex-col gap-2 flex-shrink-0">
        <a href="/" class="flex py-2.5 hover:bg-[#3b5369] gap-2 items-center flex-col">
            <Home class="h-6 w-6"></Home>
            <!-- <img src="/icons/homeIcon.svg" class="h-6 w-6" alt=""> -->
            <span class="capitalize text-[10px]">home</span>
        </a>
        <a href="/scripture" class="flex py-2.5 hover:bg-[#3b5369] gap-2 items-center flex-col">
            <ScrollText class="h-6 w-6"></ScrollText>
            <!-- <img src="/icons/scroll-text.svg" class="h-6 w-6" alt=""> -->
            <span class="capitalize text-[10px]">scripture</span>
        </a>
        <a href="/books" class="flex py-2.5 hover:bg-[#3b5369] gap-2 items-center flex-col">
            <Book class="h-6 w-6"></Book>
            <!-- <img src="/icons/books.svg" class="h-6 w-6" alt=""> -->
            <span class="capitalize text-[10px]">books</span>
        </a>
        <a href="/notes" class="flex py-2.5 hover:bg-[#3b5369] gap-2 items-center flex-col">
            <FileText class="h-6 w-6"></FileText>
            <!-- <img src="/icons/notebook-pen.svg" class="h-6 w-6" alt=""> -->
            <span class="capitalize text-[10px]">notes</span>
        </a>
        <a href="/collections" class="flex py-2.5 hover:bg-[#3b5369] gap-2 items-center flex-col">
            <TrendingUp class="h-6 w-6"></TrendingUp>
            <!-- <img src="/icons/trendingIcon.svg" class="h-6 w-6" alt=""> -->
            <span class="capitalize text-[10px]">ts collections</span>
        </a>
    </div>
    <div class="flex-grow"></div>
    <div class="flex-shrink-0">
        <hr class="border-t border-[#2c3e50] my-2" />
        <a href="/settings" class="flex py-2.5 hover:bg-[#3b5369] gap-2 items-center flex-col">
            <Settings class="h-6 w-6"></Settings>
            <!-- <img src="/icons/Settings.svg" class="h-6 w-6" alt=""> -->
            <span class="capitalize text-[10px]">settings</span>
        </a>
    </div>
</nav>