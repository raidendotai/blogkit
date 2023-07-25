<svelte:head>
	<title>{{BLOG_TITLE}}</title>
	<meta property="og:title" content="{{BLOG_TITLE_OG}}"/>
	<meta property="og:description" content="{{BLOG_DESCRIPTION_OG}}"/>
	<meta property="og:image" content="{{BLOG_IMAGE_OG}}"/>
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="{{BLOG_TITLE_OG}}" />
	<meta name="twitter:description" content="{{BLOG_DESCRIPTION_OG}}" />
	<meta name="twitter:image" content="{{BLOG_IMAGE_OG}}" />
</svelte:head>

<script>
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "$components/ui/card";
import { Button } from "$components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "$components/ui/tabs";

const posts = {{BLOG_POSTS}}
const pages = {
	current : {{CURRENT_PAGE}},
	last_page : {{LAST_PAGE}},
}

</script>

<div class="p-4 px-0 border-b pb-6 mb-2 border-gray-100">
	Current page : <span class="font-medium">{{CURRENT_PAGE}}</span> / {{LAST_PAGE}}
</div>

<div class="my-4 xl:grid xl:grid-cols-1">
	{#each posts as p,i}
	<div class="m-2">
		<a href={`/${p.slug}`}>
			{#if p.thumbnail}
			<div class="hover:bg-gray-100 hover:px-2 cursor-pointer duration-200 grid grid-cols-12 items-center">
				<img class="hidden md:block object-cover col-span-3 p-4 rounded w-full h-full max-h-64" src={p.thumbnail}/>
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
			</div>
			{:else}
			<div class="hover:bg-gray-100 hover:px-2 cursor-pointer duration-200">
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
			</div>				
			{/if}
		</a>
	</div>
	{/each}
</div>


<div class="text-center mb-4 mt-8 border-t pt-8">
	{#if pages.current>1}
		<a href={`/page/${pages.current-1}`}><Button variant="secondary" class="bg-gray-100 hover:bg-gray-200 xl:text-lg ">← Previous</Button></a>
	{:else}
		<Button disabled variant="secondary" class="bg-gray-100 hover:bg-gray-200 xl:text-lg ">← Previous</Button>
	{/if}
	<span class="px-2 xl:px-8 xl:text-lg text-gray-600">Page {pages.current}/{pages.last_page}</span>
	{#if pages.current < pages.last_page}
		<a href={`/page/${pages.current+1}`}><Button variant="secondary" class="bg-gray-100 hover:bg-gray-200 xl:text-lg ">Next →</Button></a>
	{:else}
		<Button disabled variant="secondary" class="bg-gray-100 hover:bg-gray-200 xl:text-lg ">Next →</Button>
	{/if}
</div>


<style>
</style>
