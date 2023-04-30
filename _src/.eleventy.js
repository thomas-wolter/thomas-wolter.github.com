const esbuild = require('esbuild');

module.exports = function(eleventyConfig) {
    eleventyConfig.ignores.add("_gen/**");

    eleventyConfig.addPassthroughCopy("fonts");
    eleventyConfig.addPassthroughCopy("styles");
    eleventyConfig.addPassthroughCopy("scripts");
    eleventyConfig.addPassthroughCopy("images");

    eleventyConfig.addPassthroughCopy("img");
    eleventyConfig.addPassthroughCopy("js");

    eleventyConfig.addWatchTarget("**/*.{css}");
    eleventyConfig.addWatchTarget("**/*.{js}");

    eleventyConfig.addTemplateFormats('js');
    eleventyConfig.addExtension('js', {
        outputFileExtension: 'js',
        compile: async(content, path) => {
            if (path !== './js/player.js') {
                return;
            }

            return async() => {
                let output = await esbuild.build({
                    target: 'es2015',
                    entryPoints: [path],
                    minify: false,
                    bundle: true,
                    write: false,
                });

                return output.outputFiles[0].text;
            }
        }
    });
};