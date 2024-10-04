<script lang="ts">
	import '../app.css';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import SideBar from '$lib/components/SideBar.svelte';
</script>

<div class="flex h-screen overflow-hidden">
	<SideBar />
	<div class="flex flex-col flex-1 overflow-hidden">
		<Header />
		<main class="flex-1 overflow-auto">
			<slot />
		</main>
		<div class="pl-[81px] h-[76px]"> <!-- 80px for sidebar width + 5px extra -->
			<Footer />
		</div>
	</div>
</div>

