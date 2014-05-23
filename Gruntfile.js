module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch:{
      scripts: {
        files:['**/*.coffee'],
        tasks:["coffee", "uglify"],
        options:{
          spawn: true,
        }
      },
    },
    coffee: {
      compileBare:{
        options:{
          bare: true
        },
        files: {
          "./www/opentok.js" : "./src/js/*.coffee"
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'www/opentok.js',
        dest: 'www/opentok.min.js'
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ["coffee"]);
};
