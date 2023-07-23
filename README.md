# BlogKit

Setup & deploy your blog without boring setups & configs.
Write your posts in markdown format, deploy in one take.

Everything rendered static, (almost) SEO-ready, without any complicated SSR dependency.
Built using SvelteKit, intended to be used with Vercel. Includes components from [shadcdn-svelte](https://www.shadcn-svelte.com/).

Demo at [blogkitdemo.vercel.app](https://blogkitdemo.vercel.app/).

Say hi [@n_raidenai](https://twitter.com/n_raidenai) !

# How To Use

* clone this repo
* all you need to work with is the ```/blog``` folder, look at the examples
  * for each blog post, create a folder in ```/blog```, put your markdown in ```content.md```, and that's it
    * specify any extra metadata in ```metadata.yml``` within the same subfolder (see examples) (not necessary)
    * put any image/media you use in the markdown in the same subfolder, static assets will be built automatically (see examples)
	  * aditionally, images called ```og``` (with any image extension) will be used for opengraph SEO stuff
	  * images called ```thumbnail``` are used as blog posts thumbnails
  * general blog config in ```/blog/metadata.yml``` for title, description
    * any image called ```/blog/og.{ext}``` will be used for opengraph. you can modify ```/blog/favicon.png``` as well
* push your repo
  * for vercel, no extra configuration needed, cloud build will handle the rest

# Todo

* search engine, related articles
* archives sidebar
* themes