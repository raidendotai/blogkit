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

<svelte:head>
	{#if $page.route.id === '/'}
		<title>{{BLOG_TITLE}}</title>
		<meta property="og:title" content="{{BLOG_TITLE_OG}}"/>
		<meta property="og:description" content="{{BLOG_DESCRIPTION_OG}}"/>
		<meta property="og:image" content="{{BLOG_IMAGE_OG}}"/>
	{/if}
</svelte:head>


<div id="header" class="max-w-7xl xl:max-w-6xl mx-auto border-gray-300 border-b">
	<div class="p-4">
		<a href='/' class="text-3xl font-medium text-black hover:text-gray-600 duration-200 ">{{BLOG_TITLE}}</a>
		<h3 class="py-2 text-gray-500 text-base">{{BLOG_DESCRIPTION}}</h3>
	</div>
</div>

<div id="container" class="max-w-7xl xl:max-w-6xl mx-auto p-6 pt-2 min-h-[90vh]">
	
	{#if $page.route.id != '/'}
	<slot></slot>
	{:else}

	
	<div class="my-4 xl:grid xl:grid-cols-1">
		{#each posts as p,i}
		<div class="m-2">
			<a href={`/${p.slug}`}>
				{#if p.thumbnail}
				<Card class="hover:bg-gray-50 hover:px-2 cursor-pointer duration-200 grid grid-cols-12 items-center">
					<img class="hidden md:block object-cover col-span-3 p-4 rounded w-full h-full max-h-56" src={p.thumbnail}/>
					<CardHeader class="col-span-9">
						<CardTitle class="text-2xl"><a href={`/${p.slug}`} class="hover:text-gray-500 duration-200">{p.title} →</a></CardTitle>
						<div class="text-sm text-gray-400">
							by <span class="">{p.authors.join(' , ')}</span> | {p.time}
						</div>
						<CardDescription class="whitespace-normal line-clamp-5 text-base">
							<p>{p.description}</p>
						</CardDescription>
						<div class="pt-4">
							{#each p.tags as tag,tagIdx}
								<a href={`/tag/${tag}`} class="bg-gray-200 p-2 text-xs text-gray-500 hover:bg-gray-300 hover:text-black duration-200">{tag}</a>&nbsp;
							{/each}
						</div>
					</CardHeader>
				</Card>
				{:else}
				<Card class="hover:bg-gray-50 hover:px-2 cursor-pointer duration-200">
					<CardHeader class="">
						<CardTitle class="text-2xl"><a href={`/${p.slug}`} class="hover:text-gray-500 duration-200">{p.title} →</a></CardTitle>
						<div class="text-sm text-gray-400">
							by <span class="">{p.authors.join(' , ')}</span> | {p.time}
						</div>
						<CardDescription class="whitespace-normal line-clamp-5 text-base">
							<p>{p.description}</p>
						</CardDescription>
						<div class="pt-4">
							{#each p.tags as tag,tagIdx}
								<a href={`/tag/${tag}`} class="bg-gray-200 p-2 text-xs text-gray-500 hover:bg-gray-300 hover:text-black duration-200">{tag}</a>&nbsp;
							{/each}
						</div>
					</CardHeader>
				</Card>				
				{/if}
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

<div id="footer" class="mx-auto border-gray-300 border-t pb-12">
	<div class="max-w-7xl xl:max-w-6xl mx-auto px-0 pt-6 text-gray-700">
		<a href='/' class="font-medium text-black hover:text-gray-700 duration-200">Ultra Blog 3000</a> | {`${new Date().getFullYear()}`}
		<h3 class="py-2 text-gray-500 text-sm">Powered by <a class="text-black hover:text-gray-700 duration-200" href="https://github.com/raidendotai/blogkit" target="_blank">BlogKit</a></h3>
	</div>
</div>


<style>
</style>
