<style>
    @font-face {
        font-family: "MTF Be Mine";
        src: url("https://personal-dictionary.pages.dev/font_mtf-be-mine/mtf-be-mine.eot");
        src: url("https://personal-dictionary.pages.dev/font_mtf-be-mine/mtf-be-mine.eot?#iefix")format("embedded-opentype"),
        url("https://personal-dictionary.pages.dev/font_mtf-be-mine/mtf-be-mine.woff2")format("woff2"),
        url("https://personal-dictionary.pages.dev/font_mtf-be-mine/mtf-be-mine.woff")format("woff"),
        url("https://personal-dictionary.pages.dev/font_mtf-be-mine/mtf-be-mine.ttf")format("truetype"),
        url("https://personal-dictionary.pages.dev/font_mtf-be-mine/mtf-be-mine.svg#MTF Be Mine")format("svg");
    }

    .cute {
        font-family: "MTF Be Mine";
        font-size: xx-large;
    }
</style>

# Personal Dictionary

This app lets you add your own words, and automatically gets their definitions, synonyms, antonyms and examples from the internet.

## Features
- `Add` words with fuzzy autocompletion from a list of 370k words
- `View` all meanings of a word at glance and select the one to display
- `Search` through your wordlist (does this need to be fuzzy?)
- `Export` your wordlist to a text file or using a link
- `Import` words in bulk from a variety of formats (by default {`,`,`\n`,`\r\n`,` `}-separated, with support for custom separators) or using a link
- Enter `Edit` mode to delete words
- Multiple amazing `themes` in both dark/light modes 
- Cute `backgrounds` 

## Techincal Details
This is made with Svelte + Vite in TypeScript, and uses the svelte-ux library. The `pages` branch is continuously deployed using cloudflare pages, whereas development happens in `main`.

It uses the [Dictionary API](https://dictionaryapi.dev/) to get meanings (which relies on Wiktionary).

The autocompletion wordlist is taken from the [dwyl/english-words](https://github.com/dwyl/english-words/) repo. I have also considered the aspell word lists but they have a lot of repitition (in the sense that almost every word has it's variant with an `'s` right after it, which is pointless for a dictionary).

For fuzzy search, the [EthanRutherford/fast-fuzzy](https://github.com/EthanRutherford/fast-fuzzy/) library is utilized which works quite well.

<span class="cute">Be Mine</span>: 

I use the [mtf be mine](https://misstiina.com/fonts/mtf-be-mine/) font, which is the cutest font ever. It is [free for non-profit use](https://misstiina.com/fonts/tou/), and this is an open source project.

Icons are from [SVGRepo](https://svgrepo.com/). The logo is a heavy edit of an AI-generated logo made from [recraft.ai](https://recraft.ai/).
