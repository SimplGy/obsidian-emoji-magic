> Note: This is an [Obsidian](https://obsidian.md/)-compatible fork of the [Emoji Magic](https://github.com/SimplGy/emoji-magic) Chrome Extension I wrote.





## Similar Obsidian Plugins
(aka: "why did I need to build this?")

* 


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














## Contributing

Contributions welcome. See CONTRIBUTING.md.

## Disclaimer

This is not an officially supported Google product.