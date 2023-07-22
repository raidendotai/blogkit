const fs = require('fs');
const slugify = require('slugify');
const sanitize = require('sanitize-filename');
const showdown  = require('showdown')
const showdown_md_converter = new showdown.Converter();
const { markdownToTxt } = require('markdown-to-txt');

const BLOG_CONFIG = require(`./blog/config.cjs`)

const tailwind_inject = {
	h1: `mt-3 pt-4 scroll-m-20 text-2xl font-bold tracking-tight`,
	h2: `mt-3 pt-4 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight transition-colors first:mt-0`,
	h3: `mt-3 pt-4 scroll-m-20 text-xl font-semibold tracking-tight`,
	h4: `mt-3 pt-4 scroll-m-20 text-xl font-medium tracking-tight`,
	h5: `mt-3 pt-4 scroll-m-20 text-lg font-medium tracking-tight`,
	h6: `mt-3 pt-4 scroll-m-20 font-medium tracking-tight`,
	p: `p-2 px-4 pt-0 leading-7 [&:not(:first-child)]:mt-6`,
	blockquote: `mt-6 border-l-2 pl-6 italic`,
	table: `my-6 w-full overflow-y-auto`,
	tr: `m-0 border-t p-0 even:bg-muted`,
	th: `border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right`,
	td: `border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right`,
	ul: `my-6 ml-6 list-disc [&>li]:mt-2`,
	code: `relative bg-gray-200 p-4 font-mono text-sm`,
	lead: `text-xl text-muted-foreground`,
	small: `text-sm font-medium leading-none`,
}

function _list_folders(path) {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path+'/'+file).isDirectory();
  });
}
function _list_files(path){
	return fs.readdirSync(path)
}
const _chunk = (array, size) =>
  array.reduce((acc, _, i) => {
    if (i % size === 0) acc.push(array.slice(i, i + size))
    return acc
  }, [])



// later -----------------------------------------------------------------------------
// generate og image from text data
function generate_social_img(){true}
// search engine
function build_search(){true}




// ------------------------------------------------------------------------------------------------------------------
function md_convert(md){
	const postConvertYoutubeRegex = /<p><a href="https:\/\/youtu\.be\/([a-zA-Z0-9_-]+)">([^<]+)<\/a><\/p>|<p><a href="https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)">([^<]+)<\/a><\/p>/g;

	let html = showdown_md_converter.makeHtml(md).replace(postConvertYoutubeRegex, (match, videoId1, textInsideLink1, videoId2, textInsideLink2) => {
	  const videoId = videoId1 || videoId2;
	  const textInsideLink = textInsideLink1 || textInsideLink2;
	  return `<div class="italic py-4">${textInsideLink}<br/><iframe src="https://www.youtube.com/embed/${videoId}" class="w-full xl:w-1/2 h-[25vh] xl:h-[40vh] py-2" frameborder="0" allowfullscreen></iframe></div>`;
	});

	for (let k of Object.keys(tailwind_inject) ) {
		html = html.replaceAll(`<${k}` , `<${k} class="${tailwind_inject[k]}"`)
	}
	return html
}



function list_posts(){
	return _list_folders(`./blog/posts`).map(folder => {
		return {
			folder,
			files: _list_files(`./blog/posts/${folder}`),
		}
	}).filter(p=>p.files.includes('content.md')).map( p => {
		const stats = fs.statSync(`./blog/posts/${p.folder}/content.md`)
		let html
		const md = fs.readFileSync(`./blog/posts/${p.folder}/content.md`, 'utf8').toString()
		try {
			html = md_convert(md)
		} catch(post_error) {
			console.dir({post_error})
			return false
		}
		let post_config = {}
		if ( p.files.includes(`config.cjs`) ) {
			try { post_config = require(`./blog/posts/${p.folder}/config.cjs`) }
			catch(post_config_error){ console.dir({post_config_error}) }
		}
		const plain_text = markdownToTxt(md).trim()
		return {
			folder: p.folder,
			created: stats.birthtime,
			updated: stats.mtime,
			files: p.files.filter(f=> !(['content.md','config.cjs'].includes(f)) ),
			html,
			plain_text,
			title: md.trim().split(`\n`)[0].replace('#','').trim(),
			tags: [],
			categories: [],
			public: true,
			authors : [BLOG_CONFIG.owner],
			description: plain_text.split('\n').length > 1
							? plain_text.split('\n').slice(1,).join(`\n`).trim().split('.').slice(0,5).join('.') + ' ...' // 5 sentences preview
							: ``,
			...post_config,
		}
	}).filter(p=>p).map( p => {
		const slug = sanitize( slugify(p.title).toLowerCase() )
		return {
			...p,
			slug,
			html: p.html.replaceAll(`<img src="`,`<img src="${slug}/`)
		}
	}).sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
	.map( (p,index) => {
		return {
			...p,
			index,
			is_in_page: Math.floor(index/BLOG_CONFIG.postsPerPage)+1,
		}
	})
	
}


const root_template = fs.readFileSync(`./predeploy/root_template.svelte`, 'utf8').toString()
const post_template = fs.readFileSync(`./predeploy/post_template.svelte`, 'utf8').toString()
const page_template = fs.readFileSync(`./predeploy/page_template.svelte`, 'utf8').toString()

function make_post(p){
	// generate svelte component
	return post_template.replaceAll(`{{POST_TITLE}}`,p.title)
											.replace(
												`{{POST_TITLE_OG}}`,
												p.title.replaceAll("'", "\\'")
											)
											.replace(`{{POST_TIME}}`,(p.created).toString().split(' ').slice(1,4).join(' ') )
											.replace(`{{POST_AUTHORS}}`,p.authors.join(' , '))
											.replace(`{{POST_IS_IN_PAGE}}`,p.is_in_page)
											.replace(`{{POST_HTML}}`,p.html)
											.replace(`{{POST_TAGS}}`,JSON.stringify(p.tags))
}


function make_root(page,n_pages){
	// generate svelte component
	return root_template.replaceAll(`{{BLOG_TITLE}}`,BLOG_CONFIG.title)
											.replace(
												`{{BLOG_TITLE_OG}}`,
												BLOG_CONFIG.title.replaceAll("'", "\\'")
											)
											.replace(
												`{{BLOG_POSTS}}`,
												JSON.stringify(
													page.map( p => {
														return {
															title:p.title,
															description:p.description,
															slug:p.slug,
															time:(p.created).toString().split(' ').slice(1,4).join(' '),
															authors:p.authors,
															tags: p.tags,
														}
													})
												)
											)
											.replace(`{{LAST_PAGE}}`, n_pages)
}

function make_page(page,page_idx,n_pages){
	return page_template.replaceAll(`{{BLOG_TITLE}}`,BLOG_CONFIG.title)
											.replace(
												`{{BLOG_TITLE_OG}}`,
												BLOG_CONFIG.title.replaceAll("'", "\\'")
											)
											.replace(
												`{{BLOG_POSTS}}`,
												JSON.stringify(
													page.map( p => {
														return {
															title:p.title,
															description:p.description,
															slug:p.slug,
															time:(p.created).toString().split(' ').slice(1,4).join(' '),
															authors:p.authors,
															tags: p.tags,
														}
													})
												)
											)
											.replace(`{{CURRENT_PAGE}}`, page_idx+1)
											.replace(`{{LAST_PAGE}}`, n_pages)
}


function generate_components(){
	
	const posts = list_posts()
	const generated_post_components = posts.map( p => make_post(p) )
	
	const pages = _chunk(posts,BLOG_CONFIG.postsPerPage)
	const n_pages = pages.length
	
	const generated_root_component = make_root(pages[0],n_pages)
	const generated_page_components = pages.map( (page,page_idx) => { return make_page(page,page_idx,n_pages) } )
	
	
	try{ fs.rmSync( `./src/routes`, { recursive: true, force: true }) }catch(e){false}
	
	fs.mkdirSync( `./src/routes`, { recursive: true, force: true })
	
	posts.map( (p,idx) => {
		// write static assets
		fs.mkdirSync( `./static/${p.slug}`, { recursive: true, force: true })
		p.files.map( f => {
			fs.copyFileSync( `./blog/posts/${p.folder}/${f}`, `./static/${p.slug}/${f}`)
		})
		// write svelte components
		fs.mkdirSync( `./src/routes/${p.slug}`, { recursive: true, force: true })
		fs.writeFileSync( `./src/routes/${p.slug}/+layout.svelte` , generated_post_components[idx])
		fs.writeFileSync( `./src/routes/${p.slug}/+page.svelte` , '')
	})
	
	fs.writeFileSync( `./src/routes/+layout.svelte` , generated_root_component)
	fs.writeFileSync( `./src/routes/+page.svelte` , '')

	
	generated_page_components.map( (page_component,idx) => {
		fs.mkdirSync( `./src/routes/page/${idx+1}`, { recursive: true, force: true })
		fs.writeFileSync( `./src/routes/page/${idx+1}/+layout.svelte` , page_component)
		fs.writeFileSync( `./src/routes/page/${idx+1}/+page.svelte` , '')
	})
	
	fs.copyFileSync( `./blog/favicon.png`, `./static/favicon.png`)
}

generate_components()