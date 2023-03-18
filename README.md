This plugin lets you add emoji to your Obsidian notes more easiy using an enhanced keyword search.

It has a large dictionary of keywords so you can find emoji you wouldn't find otherwise:

* broad terms like "car" -> `🚓🚋🚔🏎️🚐🚕🚖`
* colors like "orange" -> `📙🧡🍊🥕🚼`

Animated Screenshot:

![gif in action](./screenshots/emoji-magic-obsidian-2.gif?raw=true)

Still Screenshot:

![screenshot](./screenshots/emoji-magic-blue.png?raw=true)

## Features

1. Secure -- local only, no internet
2. Rich keyword search -- the dictionary contains `1,812` emoji with `199,658` searchable keywords and thesaurus entries.
3. Fast -- just keyboard shortcut and click
4. Keyboard friendly -- arrow keys, tab, however you want.

> Note: This is an [Obsidian](https://obsidian.md/)-compatible fork of the [Emoji Magic](https://github.com/SimplGy/emoji-magic) Chrome Extension I wrote.

## Installing this Plugin

1. Open settings. (if you haven't yet, one time: Third party plugin -> Disable Safe mode)
1. Click "Browse community plugins" -> Search for "Magic File Hotkey"
1. Install it, then click "enable"
1. Add a hotkey. I like `cmd + shift + e` ("e" for "emoji").

## Guiding Principles
> Goals and Non-goals

* Easy find
  * an effort is made to include lots of possible matches
  * eg: the color "green" or the feeling "happy"
* Keyboard friendly.
  * Eg: `keyboard shortcut` -> `search phrase` -> `enter` and done.
  * Because this plugin shows a 2d grid of emoji, built two-dimensional arrow key support for navigating.
* Actual emoji. No images.
  * This means: no custom emoji
  * Also means: will render platform-appropriate versions. The visual you see can vary depending on where you're viewing the file
  * Also means: you may see empty rectangles for emoji that are defined, but not supported by your device. (eg: 🦩 "flamingo" won't be there if you're on an older Mac)

## Similar Obsidian Plugins

> AKA: "why did I need to build this?"

* [Emoji Shortcodes](https://github.com/phibr0/obsidian-emoji-shortcodes)
  * Excellent plugin, seems to work great, but I like having a popup search panel instead of using the `:smile:` kind of syntax
* [Emoji Toolbar](https://github.com/oliveryh/obsidian-emoji-toolbar)
  * Currently the most popular "emoji" plugin for Obsidian
  * Uses images instead of the text emoji char itself. That means some emoji can look different in the picker VS when I actually insert them in my file. There is a setting that might be related, but I wasn't able to get it to work. (Update: appears fixed in [v0.4.0](https://github.com/oliveryh/obsidian-emoji-toolbar/releases/tag/0.4.0))
  * Started breaking for me (might be a "live preview" only bug). Would insert emoji at the start of the file instead of where my cursor is. (Update: appears fixed in [v0.4.0](https://github.com/oliveryh/obsidian-emoji-toolbar/releases/tag/0.4.0) or earlier)



## Developing this Plugin

### Building

```
# npm install
npm run dev
```

(for auto refreshing) install `git clone https://github.com/pjeby/hot-reload.git` and turn it on

### (rarely) Sync with the upstream project

```
rm -rf lib/emoji-magic
git clone https://github.com/SimplGy/emoji-magic.git lib/emoji-magic
```

### Releasing

1. Update version in `manifest.json` and `package.json`
2. commit, `git push`.
3. To put on GitHub, do the following tag stuff:

(replace with the new version number)

```
git tag -a 0.1.3 -m "0.1.3"
git push origin 0.1.3
```

> This will trigger `.github/workflows/release.yml`.
> 
> Verify the workflow is running [here](https://github.com/SimplGy/obsidian-emoji-magic/actions).
> Verify [releases here](https://github.com/SimplGy/obsidian-emoji-magic/releases)

4. (you're done) simply doing a github release and running release.yml will make the new version of the plugin available on the Obsidian marketplace. Nice!



## TODO
PRs welcome.

- [ ] change from 3 -> 2 chars required to see search results
- [ ] improve startup time
- [ ] 
- [ ] 
- [ ] solve the `zwj` problem (eg: "plane")
- [ ] (upstream) improve some of the ranking (car, plane) and 
- [ ] (upstream) fix the lack of "stemming" problem (eg: "race car")
- [ ] (upstream) adapt the headless stuff to be easier to reuse.

## Future
- [ ] consider using Obsidian's native [SuggestModal](https://marcus.se.net/obsidian-plugin-docs/reference/typescript/classes/SuggestModal) or [FuzzySuggestModal](https://marcus.se.net/obsidian-plugin-docs/reference/typescript/classes/FuzzySuggestModal) -- https://marcus.se.net/obsidian-plugin-docs/user-interface/modals -- I thought this couldn't work with a grid UI, but there's [prior art here](https://github.com/oliveryh/obsidian-emoji-toolbar/commit/1b8f7624f575cb183271a3d969ee5939c4763f8a)




## Contributing

Contributions welcome. See CONTRIBUTING.md.

## Disclaimer

This is not an officially supported Google product.
