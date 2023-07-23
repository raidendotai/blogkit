<svelte:head>
	<title>{{POST_TITLE}}</title>
	<meta property="og:title" content="{{POST_TITLE_OG}}"/>
	<meta property="og:description" content="{{POST_DESCRIPTION_OG}}"/>
	<meta property="og:image" content="{{POST_IMAGE_OG}}"/>	
</svelte:head>

<script>
const isInPage = {{POST_IS_IN_PAGE}}
const tags = {{POST_TAGS}}
</script>

<div class="p-4 pb-6">
	<a href={`/page/${isInPage}`} class="text-sm font-medium hover:text-gray-500 duration-200">← Back</a>
	<h1 class="scroll-m-20 text-4xl font-bold tracking-tight">{{POST_TITLE}}</h1>
	by <span class="">{{POST_AUTHORS}}</span>
	<br/><span class="text-sm">{{POST_TIME}}</span>
</div>
<div class="p-6 pb-6 mb-2 bg-gray-50">
{{POST_HTML}}
<div class="pt-4">
	{#each tags as tag,tagIdx}
	<a href={`/tag/${tag}`} class="bg-gray-200 p-2 text-xs text-gray-500 hover:bg-gray-300 hover:text-black duration-200">{tag}</a>&nbsp;
	{/each}
</div>
</div>
