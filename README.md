This plugin lets you add emoji to your Obsidian notes quickly and easily.

> Note: This is an [Obsidian](https://obsidian.md/)-compatible fork of the [Emoji Magic](https://github.com/SimplGy/emoji-magic) Chrome Extension I wrote.

Screenshot:

![screenshot](./screenshots/emoji-magic-blue.png?raw=true)

Animated Screenshot:

![gif in action](./screenshots/emoji-magic-obsidian-2.gif?raw=true)

## Features

1. Secure -- local only, no internet
2. Rich keyword search -- the dictionary contains `1,812` emoji and `199,658` searchable keywords and thesaurus entries.
3. Fast -- just keyboard shortcut and click
4. Keyboard friendly -- arrow keys, tab, however you want.

## Guiding Principles
> Goals and Non-goals

* Easy find
  * an effort is made to include lots of possible matches
  * eg: "blue" or "angry"
* Keyboard friendly.
  * Eg: `keyboard shortcut` -> `search phrase` -> `enter` and done.
  * Because this plugin shows a grid of emoji, good keyboard support meant two-dimensional arrow key support as well.
* Actual emoji. No images.
  * This means: no custom emoji
  * Also means: will render platform-appropriate versions. This can vary depending on where you're viewing the file
  * Also means: you may see empty rectangles for emoji that are defined, but not supported by your device. (eg: 🦩 "flamingo" won't be there if you're on an older Mac)

## Installing this Plugin

1. Open settings -> Third party plugin -> Disable Safe mode
1. Click "Browse community plugins" -> Search for "Magic File Hotkey"
1. Install it, then click "enable"
1. Add a hotkey. I like `cmd + shift + e` ("e" for "emoji").

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
git tag -a 0.0.2 -m "0.0.2"
git push origin 0.0.2
```

> This will trigger `.github/workflows/release.yml`.
> 
> Verify the workflow is running [here](https://github.com/SimplGy/obsidian-open-file-by-magic-date/actions).
> Verify [releases here](https://github.com/SimplGy/obsidian-open-file-by-magic-date/releases)

4. (you're done) simply doing a github release and running release.yml will make the new version of the plugin available on the Obsidian marketplace. Nice!



## TODO
PRs welcome.

- [ ] save the most recent k emoji and show them by default (the upstream is wired up to do this, should be really close to ready)
- [ ] solve the `zwj` problem (eg: "plane")
- [ ] (upstream) improve some of the ranking (car, plane) and 
- [ ] (upstream) fix the lack of "stemming" problem (eg: "race car")

## Future
- [ ] consider using Obsidian's native [SuggestModal](https://marcus.se.net/obsidian-plugin-docs/reference/typescript/classes/SuggestModal) or [FuzzySuggestModal](https://marcus.se.net/obsidian-plugin-docs/reference/typescript/classes/FuzzySuggestModal) -- https://marcus.se.net/obsidian-plugin-docs/user-interface/modals




## Contributing

Contributions welcome. See CONTRIBUTING.md.

## Disclaimer

This is not an officially supported Google product.