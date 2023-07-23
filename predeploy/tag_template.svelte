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

</script>


<div class="p-4 px-0 border-b pb-6 mb-2 border-gray-100">
	Found <span class="font-medium">{{TAG_POSTS_COUNT}}</span> results for <a href={`/tag/{{TAG_NAME}}`} class="text-sm font-medium bg-gray-200 p-2 text-gray-500 hover:bg-gray-300 hover:text-black duration-200 ">{{TAG_NAME}}</a>
</div>
	
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



<style>
</style>
