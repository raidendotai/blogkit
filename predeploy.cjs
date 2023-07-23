const fs = require('fs');
const slugify = require('slugify');
const sanitize = require('sanitize-filename');
const showdown  = require('showdown')
const showdown_md_converter = new showdown.Converter();
const { markdownToTxt } = require('markdown-to-txt');
const YAML = require('yaml');
const _ = require('lodash');

const BLOG_CONFIG = YAML.parse( fs.readFileSync(`./blog/metadata.yml`, 'utf8') )

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
	return fs.readdirSync( path , {withFileTypes: true}).filter(item => !item.isDirectory()).map(item => item.name)
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
	  return `<div class="italic py-4 text-center">${textInsideLink}<br/><iframe src="https://www.youtube.com/embed/${videoId}" class="w-full xl:w-1/2 h-[25vh] xl:h-[40vh] py-2 mx-auto text-center" frameborder="0" allowfullscreen></iframe></div>`;
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
		if ( p.files.includes(`metadata.yml`) ) {
			try { post_config = YAML.parse( fs.readFileSync(`./blog/posts/${p.folder}/metadata.yml`, 'utf8') ) }
			catch(post_config_error){ console.dir({post_config_error}) }
		}
		const plain_text = markdownToTxt(md).trim()
		return {
			folder: p.folder,
			created: stats.birthtime,
			updated: stats.mtime,
			files: p.files.filter(f=> !(['content.md','metadata.yml'].includes(f)) ),
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
	}).filter(p=>p && p.public).map( p => {
		const slug = sanitize( slugify(p.title).toLowerCase() )
		return {
			...p,
			slug,
			html: p.html.replaceAll(`<img src="`,`<img class="text-center mx-auto" src="${slug}/`)
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
const tag_template = fs.readFileSync(`./predeploy/tag_template.svelte`, 'utf8').toString()


function make_post(p){
	// generate svelte component
	const root_og_image_check = _list_files(`./blog`).map(e=> { return {file:e,og_img:e.startsWith('og.')} }).filter(e=>e.og_img)
	const post_og_image_check = _list_files(`./blog/posts/${p.folder}`).map(e=> { return {file:e,og_img:e.startsWith('og.')} }).filter(e=>e.og_img)
	
	const og_image = BLOG_CONFIG.domain && BLOG_CONFIG.domain.length && ( root_og_image_check.length || post_og_image_check.length )
						?	post_og_image_check.length
							? `https://${BLOG_CONFIG.domain}/${p.slug}/${post_og_image_check[0].file}`
							: `https://${BLOG_CONFIG.domain}/${root_og_image_check[0].file}`
						: ''
	
	return post_template.replaceAll(`{{POST_TITLE}}`,p.title)
											.replace(
												`{{POST_TITLE_OG}}`,
												_.escape(p.title)
											)
											.replace(
												`{{POST_DESCRIPTION_OG}}`,
												_.escape(p.description)
											)
											.replace(
												`{{POST_IMAGE_OG}}`,
												og_image
											)
											.replace(`{{POST_TIME}}`,(p.created).toString().split(' ').slice(1,4).join(' ') )
											.replace(`{{POST_AUTHORS}}`,p.authors.join(' , '))
											.replace(`{{POST_IS_IN_PAGE}}`,p.is_in_page)
											.replace(`{{POST_HTML}}`,p.html)
											.replace(
												`{{POST_TAGS}}`,
												JSON.stringify(
													p.tags.map( t => sanitize((t).toLowerCase()))
												)
											)
}


function make_root(page,n_pages){
	// generate svelte component
	const blog_description = BLOG_CONFIG.description ? BLOG_CONFIG.description : ''
	const og_image_check = _list_files(`./blog`).map(e=> { return {file:e,og_img:e.startsWith('og.')} }).filter(e=>e.og_img)
	
	const og_image = BLOG_CONFIG.domain && BLOG_CONFIG.domain.length && og_image_check.length
						? `https://${BLOG_CONFIG.domain}/${og_image_check[0].file}`
						: ''
						
	return root_template.replaceAll(`{{BLOG_TITLE}}`,BLOG_CONFIG.title)
						.replace(
							`{{BLOG_TITLE_OG}}`,
							_.escape(BLOG_CONFIG.title)
						)
						.replace(
							`{{BLOG_DESCRIPTION_OG}}`,
							_.escape(blog_description)
						)
						.replace(`{{BLOG_DESCRIPTION}}`,blog_description)
						.replace(
							`{{BLOG_IMAGE_OG}}`,
							og_image
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
										tags: p.tags.map( t => sanitize((t).toLowerCase())),
										thumbnail:
											_list_files(`./blog/posts/${p.folder}`).map(e=>{return {file:e,thumb_img:e.startsWith('thumbnail.')} }).filter(e=>e.thumb_img).length
												? `/${p.slug}/` + _list_files(`./blog/posts/${p.folder}`).map(e=> { return {file:e,thumb_img:e.startsWith('thumbnail.')} }).filter(e=>e.thumb_img)[0].file
												: _list_files(`./blog/posts/${p.folder}`).map(e=>{return {file:e,thumb_img:e.startsWith('og.')} }).filter(e=>e.thumb_img).length
													? `/${p.slug}/` + _list_files(`./blog/posts/${p.folder}`).map(e=> { return {file:e,thumb_img:e.startsWith('og.')} }).filter(e=>e.thumb_img)[0].file
													: false,
									}
								})
							)
						)
						.replaceAll(`{{LAST_PAGE}}`, n_pages)
}

function make_page(page,page_idx,n_pages){
	const og_description = BLOG_CONFIG.description ? BLOG_CONFIG.description : ''
	const og_image_check = _list_files(`./blog`).map(e=> { return {file:e,og_img:e.startsWith('og.')} }).filter(e=>e.og_img)
	
	const og_image = BLOG_CONFIG.domain && BLOG_CONFIG.domain.length && og_image_check.length
						? `https://${BLOG_CONFIG.domain}/${og_image_check[0].file}`
						: ''
	return page_template.replaceAll(`{{BLOG_TITLE}}`, `${BLOG_CONFIG.title} | Page ${page_idx+1}/${n_pages}` )
						.replace(
							`{{BLOG_TITLE_OG}}`,
							_.escape(
								`${BLOG_CONFIG.title} | Page ${page_idx+1}/${n_pages}`
							)
						)
						.replace(
							`{{BLOG_DESCRIPTION_OG}}`,
							_.escape(og_description)
						)
						.replace(
							`{{BLOG_IMAGE_OG}}`,
							og_image
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
										tags: p.tags.map( t => sanitize((t).toLowerCase())),
										thumbnail:
											_list_files(`./blog/posts/${p.folder}`).map(e=>{return {file:e,thumb_img:e.startsWith('thumbnail.')} }).filter(e=>e.thumb_img).length
												? `/${p.slug}/` + _list_files(`./blog/posts/${p.folder}`).map(e=> { return {file:e,thumb_img:e.startsWith('thumbnail.')} }).filter(e=>e.thumb_img)[0].file
												: _list_files(`./blog/posts/${p.folder}`).map(e=>{return {file:e,thumb_img:e.startsWith('og.')} }).filter(e=>e.thumb_img).length
													? `/${p.slug}/` + _list_files(`./blog/posts/${p.folder}`).map(e=> { return {file:e,thumb_img:e.startsWith('og.')} }).filter(e=>e.thumb_img)[0].file
													: false,
									}
								})
							)
						)
						.replaceAll(`{{LAST_PAGE}}`, n_pages)
						.replaceAll(`{{CURRENT_PAGE}}`, page_idx+1)
}


function make_tags(tag,posts){
	const og_description = BLOG_CONFIG.description ? BLOG_CONFIG.description : ''
	const og_image_check = _list_files(`./blog`).map(e=> { return {file:e,og_img:e.startsWith('og.')} }).filter(e=>e.og_img)
	
	const og_image = BLOG_CONFIG.domain && BLOG_CONFIG.domain.length && og_image_check.length
						? `https://${BLOG_CONFIG.domain}/${og_image_check[0].file}`
						: ''
	return tag_template.replaceAll(`{{BLOG_TITLE}}`, `${BLOG_CONFIG.title} | Tagged in : ${tag}` )
						.replaceAll(`{{TAG_NAME}}`, tag)
						.replace(`{{TAG_POSTS_COUNT}}`, posts.length)
						.replace(
							`{{BLOG_TITLE_OG}}`,
							_.escape( `${BLOG_CONFIG.title} | Tagged in : ${tag} ` )
						)
						.replace(
							`{{BLOG_DESCRIPTION_OG}}`,
							_.escape(og_description)
						)
						.replace(
							`{{BLOG_IMAGE_OG}}`,
							og_image
						)
						.replace(
							`{{BLOG_POSTS}}`,
							JSON.stringify(
								posts.map( p => {
									return {
										title:p.title,
										description:p.description,
										slug:p.slug,
										time:(p.created).toString().split(' ').slice(1,4).join(' '),
										authors:p.authors,
										tags: p.tags.map( t => sanitize((t).toLowerCase())),
										thumbnail:
											_list_files(`./blog/posts/${p.folder}`).map(e=>{return {file:e,thumb_img:e.startsWith('thumbnail.')} }).filter(e=>e.thumb_img).length
												? `/${p.slug}/` + _list_files(`./blog/posts/${p.folder}`).map(e=> { return {file:e,thumb_img:e.startsWith('thumbnail.')} }).filter(e=>e.thumb_img)[0].file
												: _list_files(`./blog/posts/${p.folder}`).map(e=>{return {file:e,thumb_img:e.startsWith('og.')} }).filter(e=>e.thumb_img).length
													? `/${p.slug}/` + _list_files(`./blog/posts/${p.folder}`).map(e=> { return {file:e,thumb_img:e.startsWith('og.')} }).filter(e=>e.thumb_img)[0].file
													: false,
									}
								})
							)
						)
}


function generate_components(){
	
	const posts = list_posts()
	const generated_post_components = posts.map( p => make_post(p) )
	
	const pages = _chunk(posts,BLOG_CONFIG.postsPerPage)
	const n_pages = pages.length
	
	const generated_root_component = make_root(pages[0],n_pages)
	const generated_page_components = pages.map( (page,page_idx) => { return make_page(page,page_idx,n_pages) } )
	
	
	let tags = {
		// 'tag_name' : [posts]
	}
	posts.map(p=>{
		for (let t of p.tags){
			if (Object.keys(tags).includes(t)) tags[t].push(p)
			else tags[t] = [p]
		}
	})
	const generated_tag_components = Object.keys(tags).map( (_tag) => { return { tag:_tag, component:make_tags(_tag,tags[_tag]) } } )
	
	
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
	
	generated_tag_components.map( (_t) => {
		const tag_target = sanitize((_t.tag).toLowerCase())
		fs.mkdirSync( `./src/routes/tag/${tag_target}`, { recursive: true, force: true })
		fs.writeFileSync( `./src/routes/tag/${tag_target}/+layout.svelte` , _t.component)
		fs.writeFileSync( `./src/routes/tag/${tag_target}/+page.svelte` , '')
	})
	
	_list_files(`./blog`).filter(f=>f!=`metadata.yml`).map( f => {
		fs.copyFileSync( `./blog/${f}`, `./static/${f}`)
	})
}

generate_components()