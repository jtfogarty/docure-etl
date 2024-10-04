<script lang="ts">
	import { onMount } from 'svelte';
	import * as Popover from "$lib/components/ui/popover";
	import * as Command from "$lib/components/ui/command";
	import { Button } from "$lib/components/ui/button";
	import { Search, ChevronsUpDown } from "lucide-svelte";
	import { cn } from "$lib/utils";
	import { Textarea } from "$lib/components/ui/textarea";
	
	import { getShakespeareWorks, searchSpeeches } from '$lib/typesense';
	import type { SearchResult, ShakespeareWorks, Speech, Scene, Act, Character, Play } from '$lib/typesense';

	let open = $state(false);
	let value = $state("");
	let searchTerm = $state("");
	let searchInput = $state("");
	let books = $state<{ value: string; label: string }[]>([]);
	let isLoading = $state(true);
	let searchResults: SearchResult | null = null;
	let reconstructedPlay = $state("");

	async function loadBooks() {
		isLoading = true;
		try {
			const works = await getShakespeareWorks();
			books = works
				.sort((a, b) => a.title.localeCompare(b.title))
				.map((work: ShakespeareWorks) => ({
					value: work.id.toString(),
					label: work.title
				}));
		} catch (error) {
			console.error('Failed to load Shakespeare works:', error);
		} finally {
			isLoading = false;
		}
	}

	onMount(loadBooks);

	const filteredBooks = $derived(
		searchTerm
			? books.filter(book => book.label.toLowerCase().includes(searchTerm.toLowerCase()))
			: books
	);

	function formatSearchResults(results: SearchResult): string {
		if (!results || !results.speeches.length) {
			return 'No results found.';
		}

		let output = `Play: ${results.play.title}\n\n`;
		results.speeches.forEach((speech: Speech) => {
			const scene = results.scenes.find(s => s.id === speech.scene_id);
			const act = results.acts.find(a => a.id === scene?.act_id);
			output += `Act: ${act?.title || 'Unknown'}\n`;
			output += `Scene: ${scene?.title || 'Unknown'}\n`;
			output += `Character: ${speech.speaker}\n`;
			output += `Speech: ${speech.content}\n\n`;
		});

		output += `Found ${results.found} result(s). Page ${results.page} of ${results.total_pages}.`;
		return output;
	}

	async function handleSearch() {
		if (!value || !searchInput) {
			alert("Please select a book and enter a search term.");
			return;
		}
		try {
			isLoading = true;
			searchResults = await searchSpeeches(value, searchInput);
			reconstructedPlay = formatSearchResults(searchResults);
		} catch (error) {
			console.error('Error searching speeches:', error);
			reconstructedPlay = 'An error occurred while searching. Please try again.';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="flex max-w-[1700px] mx-auto w-full overflow-hidden flex-col px-4">
	<div class="flex flex-col space-y-3 mt-3">
		<Popover.Root bind:open>
			<Popover.Trigger asChild let:builder>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						class="w-[250px] justify-between bg-[#1f2e36] text-white border-white hover:bg-[#3b5369] hover:text-white"
						builders={[builder]}
					>
						{value
							? books.find((book) => book.value === value)?.label
							: "Select Shakespeare Play..."}
							<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
			</Popover.Trigger>
			<Popover.Content class="w-[250px] p-0 bg-[#1f2e36] text-white border border-white">
					<Command.Root class="max-h-[300px] overflow-hidden flex flex-col">
						<Command.Input 
							placeholder="Search plays..." 
							class="h-9 bg-[#1f2e36] text-white placeholder-gray-400 border-b border-white/20 px-3"
							bind:value={searchTerm}
						/>
						{#if isLoading}
							<div class="py-2 px-3 text-sm">Loading plays...</div>
						{:else if filteredBooks.length === 0}
							<Command.Empty class="py-2 px-3 text-sm">No play found.</Command.Empty>
						{:else}
							<Command.Group class="overflow-y-auto">
								{#each filteredBooks as book}
									<Command.Item
										value={book.value}
										onSelect={(currentValue: string) => {
											value = currentValue === value ? "" : currentValue;
											open = false;
										}}
										class="flex justify-between items-center py-2 px-3 hover:bg-[#3b5369] cursor-pointer"
									>
										<span>{book.label}</span>
									</Command.Item>
								{/each}
							</Command.Group>
						{/if}
					</Command.Root>
			</Popover.Content>
		</Popover.Root>

		<!-- svelte-ignore event_directive_deprecated -->
		<form class="flex bg-[#1f2e36] border border-white w-full max-w-[600px] text-white text-sm items-center px-3 rounded-xl" on:submit|preventDefault={handleSearch}>
			<input 
				type="text" 
				placeholder="Search for a word or phrase"
				class="flex-1 text-white placeholder-gray-400 outline-none bg-transparent py-2"
				bind:value={searchInput}
			/>
			<Button 
				variant="ghost" 
				size="icon" 
				class="w-[35px] h-[35px] hover:bg-[#3b5369] ml-2" 
				on:click={handleSearch}
			>
				<Search class="w-5 h-5" />
			</Button>
		</form>
	</div>

	{#if reconstructedPlay}
		<div class="mt-5 w-full">
			<Textarea 
				class="w-full h-[500px] bg-[#1f2e36] text-white border-white"
				value={reconstructedPlay}
				readonly
			/>
		</div>
	{/if}
</div>