> Note: This is an [Obsidian](https://obsidian.md/)-compatible fork of the [Emoji Magic](https://github.com/SimplGy/emoji-magic) Chrome Extension I wrote.

## Features

### Rich keyword search

Dictionary contains 1,812 emoji and 199,658 searchable keywords and thesaurus entries.

## Guiding Principles
> Goals and Non-goals

* Easy find
  * an effort is made to include lots of possible matches
  * eg: "blue" or "angry"
* Keyboard friendly.
  * Eg: `keyboard shortcut` -> `search phrase` -> `enter` and done.
* Actual emoji. No images.
  * This means: no custom emoji
  * Also means: will render platform-appropriate versions. This can vary depending on where you're viewing the file
  * Also means: you may see empty rectangles for emoji that are defined, but not supported by your device. (eg: 🦩 "flamingo" won't be there if you're on an older Mac)

## Installing this Plugin

Add a hotkey. I like `cmd + shift + e` ("e" for "emoji").

## Similar Obsidian Plugins

> AKA: "why did I need to build this?"

* [Emoji Shortcodes](https://github.com/phibr0/obsidian-emoji-shortcodes)
  * Excellent plugin, seems to work great, but I like having a popup search panel instead of using the `:smile:` kind of syntax
* [Emoji Toolbar](https://github.com/oliveryh/obsidian-emoji-toolbar)
  * Currently the most popular "emoji" plugin for Obsidian
  * Uses images instead of the text emoji char itself. That means some emoji can look different in the picker VS when I actually insert them in my file. There is a setting that might be related, but I wasn't able to get it to work.
  * Started breaking for me (might be a "live preview" only bug). Would insert emoji at the start of the file instead of where my cursor is.



## Developing this Plugin

### Building

```
npm install
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
2. commit, push.
3. To put on GitHub, do the following tag stuff:

(replace with the new version number)

```
git tag -a 0.1.0 -m "0.1.0"
git push origin 0.1.0
```

> This will trigger `.github/workflows/release.yml`.
> 
> Verify the workflow is running [here](https://github.com/SimplGy/obsidian-open-file-by-magic-date/actions).
> Verify [releases here](https://github.com/SimplGy/obsidian-open-file-by-magic-date/releases)

4. (you're done) simply doing a github release and running release.yml will make the new version of the plugin available on the Obsidian marketplace. Nice!


## TODOs (easy / obvious)
- [ ] escape to close
- [ ] 
- [ ] 
- [ ] 
- [ ] 
- [ ] 
- [ ] 

## Future
- [ ] consider using Obsidian's native [SuggestModal](https://marcus.se.net/obsidian-plugin-docs/reference/typescript/classes/SuggestModal) or [FuzzySuggestModal](https://marcus.se.net/obsidian-plugin-docs/reference/typescript/classes/FuzzySuggestModal) -- https://marcus.se.net/obsidian-plugin-docs/user-interface/modals




## Contributing

Contributions welcome. See CONTRIBUTING.md.

## Disclaimer

This is not an officially supported Google product.