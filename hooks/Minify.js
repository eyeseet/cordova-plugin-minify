module.exports = function(context) {
	if(!context.opts.options.release)
		return;
	
	console.log(context);
	console.log("this is the new hook");
	
	var fs = require('fs');
	var path = require('path');
	var dependencyPath = path.join(process.cwd(), 'node_modules');

	const { minify } = require(path.join(dependencyPath, "terser"));
	
	var config = {
		folders: [ 'js', 'css', 'app'],
		recursive: true,
		combine: true
	}
	var javascriptFiles = [];
	
	context.opts.paths.forEach(function(wwwpath) {
		var pending = config.folders.length;
		config.folders.forEach(function(folder) {
			processFolder(path.join(wwwpath, folder), function(err, results) {
				if(err) {
					console.log(err);
				}
				console.log(results);
				javascriptFiles = javascriptFiles.concat(results);
				if(!--pending) {
					console.log("total");
					console.log(javascriptFiles);
					processJavascriptFiles(javascriptFiles);			
				}
			});
		});
	});
	
	
	function processFolder(folder, done) {
		console.log("Processing: " + folder);
		var results = [];
		fs.readdir(folder, function(err, list) {
			if(err) {
				return done(err);
			}
			var pending = list.length;
			if(!pending) return done(null, results);
			list.forEach(function(file) {
				file = path.join(folder, file);
				fs.stat(file, function(err, stat) {
					if(err) {
						console.log("Skipping " + file + " Error: " +err);
						return;
					}
					else if(stat.isFile()) {
						console.log("adding file: " + file);
						if(path.extname(file) == '.js') {
							results.push(file);
						}
						else if(path.extname(file) == '.css') {
							console.log('css');
						}
						if(!--pending) done(null, results);
					}
					else if(stat.isDirectory() && config.recursive) {
						processFolder(file, function(err, res) {
							results = results.concat(res);
							if(!--pending) done(err, results);
						});
					}
				});
			});
		});
	}
	
	function processJavascriptFiles(files) {
		if(config.combine) {
			console.log("combining not yet supported");
		}
		else {
			files.forEach(async function(file) {
				console.log("processing file " + file);
				var result = await minify(fs.readFileSync(file, "utf8"));
				fs.writeFileSync(file, result.code);
			});
		}
	}
};