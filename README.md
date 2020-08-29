
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

# cordova-plugin-Minify
Minify javascripts and css in your cordova project automatically using Terser and CleanCSS.

## Installation
From your command prompt/terminal go to your app's root folder and execute:

`cordova plugin add cordova-plugin-minify`

The plugin will now automatically minify --release builds.

## Configuration
The plugin root folder contains a minifyconfig.json file containing the default configuration which can be altered after placing it in the root of your cordova project.

```
{
	"minifyEnabled": "Release",
	"combineJavascripts": {
		"enabled" : false
	},
	"files": {
		"paths": [""],
		"recursive": true,
		"javascriptStrategy": "scanDirectory"
	},
	"terserOptions": { 
	},
	"cleanCSSOptions": {
	}
}
```
With this default configuration the plugins scans all javascript and css files in the www directory and minifies these when build with --release option.

### Options
* `minifyEnabled`: One of the options "Always", "Release" or "Never", default "Release".
* `combineJavascripts`: When enabled combines all javascript files into one file and replaces the `<script src="..."></script>` tags in html by minified file specified by `combineJavascripts.file` (default `all.min.js`).
Keep in mind that this can mess up dependencies between javascript files. Therefore it is best used with `file.javascriptStrategy = "scanHtml"` where the first html file includes all javascripts in correct order.
See `files.paths` to manipulate the order html files are scanned.
* `files`
  * `paths`: The paths (and order) of files and folders that are scanned (html) or  minified (js/css). Paths are relative to www path in cordova project directory.
  *  `recursive`: if true, scans the paths recursively including files in all subfolders.
  * `javascriptStrategy`: Specifies how javascripts are gathered, either "scanDirectory" (scans filesystem) or "scanHtml" (scans html files for `<script src="..."></script>` tags in file system), default "scanDirectory".
- `terserOptions`: The options to pass to the javascript minifier Terser. (See https://github.com/terser/terser for details).
- `cleanCSSOptions`: The options to pass to the cleanCSS minifier (See https://github.com/jakubpawlowicz/clean-css)

### Example Configuration
```
{
  minifyEnabled: 'Always',
  combineJavascripts: { enabled: true, file: 'all.min.js' },
  files: { paths: [ 'jsincludes.html', '' ], recursive: true, javascriptStrategy: 'scanHtml' },
  terserOptions: {
    nameCache: {},
    mangle: { reserved: ['$'], toplevel: true },
    format: { comments: false }
  },
  cleanCSSOptions: {}
}
```
The configuration above runs for both debug and release builds. The plugin scans all html files for `<script src='...></script>` tags starting with jsincludes.html (used to specify order of javascripts). The content of all js files referenced by script tags is combined in the file all.min.js, and original files are removed. The first script tag in the html files is replaced with a reference to all.min.js, others are removed. Terser options: $ is not mangled (use with jQuery), top level scope variables are mangled and comments removed.