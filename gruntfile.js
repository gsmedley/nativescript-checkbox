module.exports = function (grunt) {
    var localConfig = {
        typeScriptDeclarations: [
            "index.d.ts",
            "BEMCheckBox.d.ts"
        ],
        outDir: "bin/dist/"
    };

    grunt.initConfig({
        clean: {
            build: {
                src: [localConfig.outDir]
            }
        },
        copy: {
            declarations: {
                src: localConfig.typeScriptDeclarations,
                dest: localConfig.outDir
            },
            packageConfig: {
                src: "package.json",
                dest: localConfig.outDir,
                options: {
                    process: function (content, srcPath) {
                        var contentAsObject = JSON.parse(content);
                        contentAsObject.devDependencies = undefined;
                        return JSON.stringify(contentAsObject, null, "\t");
                    }
                }
            },
            podfile: {
                src: "platforms/ios/Podfile",
                dest: localConfig.outDir
            },
            readme: {
                src: "README.md",
                dest: localConfig.outDir,
                options: {
                    process: function (content, srcPath) {
                        return content.substring(content.indexOf("\n") + 1)
                    }
                }
            }
        },
        exec: {
            tsCompile: {
                cmd: "node ./node_modules/typescript/bin/tsc --project tsconfig.json --outDir " + localConfig.outDir
            },
            ngCompile: {
                cmd:  "node ./node_modules/@angular/compiler-cli/src/main.js --project tsconfig.aot.json --outDir " + localConfig.outDir  
            },
            npm_publish: {
                cmd: "npm publish",
                cwd: localConfig.outDir
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-exec");

    grunt.registerTask("build", [
        "clean:build",
        "exec:tsCompile",
        "exec:ngCompile",
        "copy"
    ]);
    grunt.registerTask("publish", [
        "build",
        "exec:npm_publish"
    ]);
};