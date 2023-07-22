# BlogKit

Setup & deploy your blog without boring config.
Write your posts in markdown format, deploy in one take.
Everything rendered static, (almost) SEO-ready, without any complicated SSR dependency.
Built using SvelteKit, intended to be used with Vercel. Includes components from [shadcdn-svelte](https://www.shadcn-svelte.com/).

# How To Use

* clone this repo
* all you need to work with is the ```/blog``` folder, look at the examples
  * for each blog post, create a folder in ```/blog```, put your markdown in ```content.md```
  * specify any extra metadata in ```config.cjs``` within the same subfolder - see examples (not necessary)
  * put any image/media you use in the markdown in the same subfolder, static assets will be built automatically
* push your repo
  * for vercel, no extra configuration needed, cloud build will handle the rest

# Todo

* search engine, tags pages
* archive sidebar
* themes
* SEO opengraph stuff


say hi [@n_raidenai](https://twitter.com/n_raidenai)