<svelte:head>
	<title>{{BLOG_TITLE}}</title>
	<meta property="og:title" content="{{BLOG_TITLE_OG}}"/>
	<meta property="og:description" content="{{BLOG_DESCRIPTION_OG}}"/>
	<meta property="og:image" content="{{BLOG_IMAGE_OG}}"/>
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


<style>
</style>
