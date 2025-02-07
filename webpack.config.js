const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin"); // Import Webpack's Module Federation Plugin
const mf = require("@angular-architects/module-federation/webpack"); // Import Angular-specific module federation utilities
const path = require("path"); // Node.js module to handle file and directory paths
const share = mf.share; // Shortcut for the share helper function

// SharedMappings is used to share TypeScript path mappings across projects
const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
  path.join(__dirname, 'tsconfig.json'), // Path to the tsconfig.json file
  [/* Add mapped paths here to share common modules */]
);

module.exports = {
  output: {
    uniqueName: "hostApp", // Unique name for the host application to avoid conflicts when loading multiple apps
    publicPath: "auto" // Automatically determines the public path based on the current URL
  },
  optimization: {
    runtimeChunk: false // Disables creating a separate runtime chunk, simplifying module federation integration
  },
  resolve: {
    alias: {
      ...sharedMappings.getAliases(), // Adds TypeScript path aliases registered in sharedMappings
    }
  },
  experiments: {
    outputModule: true // Enables Webpack's experimental support for outputting ES modules
  },
  plugins: [
    // Module Federation configuration for the host application
    new ModuleFederationPlugin({
      library: { type: "module" }, // Specifies that the host module is an ES module

      // Configuration for remote applications
      remotes: {
        "aboutApp": "http://localhost:4201/aboutEntry.js", // Remote module exposed by the 'remoteApp' application
        "homeApp": "http://localhost:4201/homeEntry.js" // Remote module exposed by the 'homeApp' application
      },

      shared: share({
        "@angular/core": { singleton: true, strictVersion: true, requiredVersion: 'auto' }, // Ensures only one instance of @angular/core is loaded
        "@angular/common": { singleton: true, strictVersion: true, requiredVersion: 'auto' }, // Singleton for @angular/common
        "@angular/common/http": { singleton: true, strictVersion: true, requiredVersion: 'auto' }, // Singleton for HTTP client
        "@angular/router": { singleton: true, strictVersion: true, requiredVersion: 'auto' }, // Singleton for Angular Router

        ...sharedMappings.getDescriptors() // Include shared TypeScript paths
      })
    }),

    // Adds the sharedMappings plugin to Webpack to handle path aliasing
    sharedMappings.getPlugin()
  ]
};
