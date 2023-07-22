<svelte:head>
	<title>{{BLOG_TITLE}}</title>
	<meta property="og:title" content="{{BLOG_TITLE_OG}}"/>
</svelte:head>

<script>
import '../app.postcss';
import { page } from '$app/stores';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "$components/ui/card";
import { Button } from "$components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "$components/ui/tabs";

const posts = {{BLOG_POSTS}}
const pages = {
	current : 1,
	last_page : {{LAST_PAGE}},
}

</script>

<div id="container" class="max-w-7xl xl:max-w-6xl mx-auto p-6 pt-2">

	<div class="p-4 px-0 border-b pb-6 mb-2 border-gray-300">
		<a href='/' class="text-4xl font-medium text-gray-700 hover:text-black duration-200 ">Ultra Blog 3000</a>
	</div>
	
	{#if $page.route.id != '/'}
	<slot></slot>
	{:else}

	
	<div class="my-4 xl:grid xl:grid-cols-1">
		{#each posts as p,i}
		<div class="m-2">
			<a href={`/${p.slug}`}>
			<Card class="hover:bg-gray-50 hover:px-2 cursor-pointer duration-200">
			  <CardHeader>
				<CardTitle class="text-2xl"><a href={`/${p.slug}`} class="hover:text-gray-500 duration-200">{p.title} →</a></CardTitle>
				<div class="text-sm text-gray-400">
					by <span class="">{p.authors.join(' , ')}</span> | {p.time}
				</div>
				<CardDescription class="whitespace-normal line-clamp-5 text-base">
					{p.description}
				</CardDescription>
				<div class="pt-4">
					{#each p.tags as tag,tagIdx}
						<a href="" class="bg-gray-200 p-2 text-xs text-gray-500 hover:bg-gray-300 hover:text-black duration-200">{tag}</a>&nbsp;
					{/each}
				</div>
			  </CardHeader>
			</Card>
			</a>
		</div>
		{/each}
	</div>
	
	
	<div class="text-center mb-12 mt-8 border-t pt-8">
		{#if pages.current>1}
			<a href={`/page/${pages.current-1}`}><Button variant="secondary" class="bg-blue-100 xl:text-lg ">← Previous</Button></a>
		{:else}
			<Button disabled variant="secondary" class="bg-blue-100 xl:text-lg ">← Previous</Button>
		{/if}
		<span class="px-2 xl:px-8 xl:text-lg text-gray-600">Page {pages.current}/{pages.last_page}</span>
		{#if pages.current < pages.last_page}
			<a href={`/page/${pages.current+1}`}><Button variant="secondary" class="bg-blue-100 xl:text-lg ">Next →</Button></a>
		{:else}
			<Button disabled variant="secondary" class="bg-blue-100 xl:text-lg ">Next →</Button>
		{/if}
	</div>

{/if}
</div>



<style>
</style>
