<script lang="ts">
    import { onMount } from 'svelte';
    import { getCollections } from '$lib/typesense';
    import { Card } from "$lib/components/ui/card";
    import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "$lib/components/ui/dialog";
    import { cn } from '$lib/utils';
    import type { Collection } from '$lib/typesense';

    let collections: Collection[] = [];
    let selectedCollection: Collection | null = null;
    let dialogOpen = false;

    onMount(async () => {
        try {
            collections = await getCollections();
            console.log('Collections:', collections);
        } catch (error) {
            console.error('Failed to fetch collections:', error);
        }
    });

    function openDialog(collection: Collection) {
        selectedCollection = collection;
        dialogOpen = true;
    }
</script>

<div class="flex max-w-[1700px] mx-auto w-full overflow-hidden">
    <div class="flex-1 text-white lm-10 overflow-hidden lg:ml-[80px]">
        <div class="p-6 bg-[#1e3040] min-h-screen">
            <h1 class="text-2xl font-bold mb-6 text-white">Collections</h1>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {#each collections as collection}
                    <div on:click={() => openDialog(collection)}>
                        <Card 
                            class={cn("bg-[#243a4d] text-white p-4 hover:bg-[#2a4358] transition-colors cursor-pointer relative")}
                        >
                            <h2 class="text-lg font-semibold mb-2">{collection.name}</h2>
                            <p class="text-sm text-gray-300 absolute bottom-2 right-4">
                                {collection.numDocuments} documents
                            </p>
                        </Card>
                    </div>
                {/each}
            </div>
        </div>
    </div>
  </div>

  <Dialog bind:open={dialogOpen}>
    <DialogContent class="bg-[#243a4d] text-white border-gray-600">
        <DialogHeader>
            <DialogTitle class="text-white">{selectedCollection?.name}</DialogTitle>
            <DialogDescription class="text-gray-300">
                This collection contains {selectedCollection?.numDocuments} documents.
            </DialogDescription>
    </DialogHeader>
        <div>
            <p>Additional details about the collection can be displayed here.</p>
        </div>
    </DialogContent>
</Dialog>