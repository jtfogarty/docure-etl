<script lang="ts">
        import { Button } from "$lib/components/ui/button";
        import { Home } from "lucide-svelte";
    </script>
  
<main class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">Welcome to my SvelteKit app</h1>
    <Button>
      <Home class="mr-2 h-4 w-4" />
      Go home
    </Button>
</main>