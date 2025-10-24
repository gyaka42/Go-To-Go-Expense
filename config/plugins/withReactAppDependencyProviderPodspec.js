const { withPodfile } = require("@expo/config-plugins");

const POD_SNIPPET =
  "  pod 'ReactAppDependencyProvider', :podspec => File.join(config[:reactNativePath], 'ReactAppDependencyProvider.podspec.json')";

module.exports = function withReactAppDependencyProviderPodspec(config) {
  return withPodfile(config, (config) => {
    const podfile = config.modResults.contents;

    if (podfile.includes("ReactAppDependencyProvider")) {
      return config;
    }

    const pattern = /(\s*config\s*=\s*use_native_modules!\s*\n)/;
    if (!pattern.test(podfile)) {
      throw new Error(
        "Unable to locate `config = use_native_modules!` in the generated Podfile."
      );
    }

    config.modResults.contents = podfile.replace(pattern, `$1${POD_SNIPPET}\n`);
    return config;
  });
};
