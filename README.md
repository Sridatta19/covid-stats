<p float="left" align="center">
<img height="50" style="padding-right:20px;" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/react/react.png"/>
<img height="50" style="padding-right:20px;" src="https://camo.githubusercontent.com/fb4b319edc8e4001cf633fca4c2c6d93e77595159e1450c8f825eca3f41499a9/68747470733a2f2f7374617469632d6173736574732e6d6170626f782e636f6d2f7777772f6c6f676f732f6d6170626f782d6c6f676f2d626c61636b2e706e67"/>
<img height="50" style="padding-right:20px;" src="https://www.gatsbyjs.com/Gatsby-Monogram.svg" />
<img height="50" style="padding-right:20px;" src="https://raw.githubusercontent.com/d3/d3-logo/master/d3.png" />
<img height="50" style="padding-right:20px;" src="https://refactoringui.nyc3.cdn.digitaloceanspaces.com/tailwind-logo.svg" />
<svg height="50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 21"><path d="M 0 0 L 14 0 L 14 7 L 7 7 Z" fill="currentColor"></path><path d="M 0 7 L 7 7 L 14 14 L 0 14 Z" fill="currentColor"></path><path d="M 0 14 L 7 14 L 7 21 Z" fill="currentColor"></path></svg>
</p>
<h1 align="center">
  Corona Stats India
</h1>

## Table of Contents

- [Bootstrapping](#bootstrapping)
- [Tailwind CSS](#tailwind-css)
- [Gatsbyjs with Tailwind](#gatsbyjs-with-tailwind)
- [D3](#d3)
- [Mapbox](#mapbox)
- [Framer Motion](#framer-motion)
- [Static Site Generation](#static-site-generation)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Learning Gatsby](#learning-gatsby)

### Bootstrapping

Use the Gatsby CLI to create a new site, specifying the default starter.

```shell
# create a new Gatsby site using the default starter
gatsby new my-default-starter https://github.com/gatsbyjs/gatsby-starter-default
```

### Tailwind CSS

> A utility-first CSS framework for rapidly building custom designs

As a client of [TailwindUI](https://tailwindui.com/) (highly recommended), I got to use their amazing components using `@tailwindcss/ui` [package](https://www.notion.so/Tailwind-UI-Documentation-f9083ed0e2694690ac89253e88afb2b6)

### Gatsbyjs with Tailwind

I have used the [Gatsby theme](https://github.com/Sridatta19/gatsby-theme-animated-tailwind) authored by myself to setup tailwind with Gatsbyjs. It includes TailwindCSS, TailwindUI & TailwindUI/react

### D3

We are displaying two simple bar graph to render the daily increase in cases/deaths. I have used the amazing book [Fullstack D3](https://www.newline.co/fullstack-d3) for reference about using d3 with react

### Mapbox

Used [Mapbox Gl JS](https://docs.mapbox.com/mapbox-gl-js/api/) to render choropleths. It is a JavaScript library that uses WebGL to render interactive maps.

### Framer Motion

Used [framer motion](https://www.framer.com/api/motion/) and it's simple animation API. It works well with Server-side rendering and avoids flashes of unstyled content

### Static Site Generation

Most of the data displayed on the site is static generated. I used source plugins to fetch data from APIs provided by [Covid19India](https://api.covid19india.org/)

### Getting Started

First, run the development server:

```bash
yarn develop
```

Open [http://localhost:8000](http://localhost:8000) with your browser to see the result.

You can start editing the page by modifying the codebase. The page auto-updates as you edit the file.

### Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/gatsbyjs/gatsby-starter-default)

The easiest way to deploy Next.js to production is to use the Vercel (`ZEIT` previously) platform from the creators of Next.js. All that we need to do is signup with Vercel and import the project through the console

### Learning Gatsby

Looking for more guidance? Full documentation for Gatsby lives [on the website](https://www.gatsbyjs.com/). Here are some places to start:

- **For most developers, we recommend starting with our [in-depth tutorial for creating a site with Gatsby](https://www.gatsbyjs.com/tutorial/).** It starts with zero assumptions about your level of ability and walks through every step of the process.

- **To dive straight into code samples, head [to our documentation](https://www.gatsbyjs.com/docs/).** In particular, check out the _Guides_, _API Reference_, and _Advanced Tutorials_ sections in the sidebar.
