const { withPodfile } = require("@expo/config-plugins");

const POD_LINE =
  "pod 'ReactAppDependencyProvider', :podspec => File.join(config[:reactNativePath], 'ReactAppDependencyProvider.podspec.json')";

module.exports = function withReactAppDependencyProviderPodspec(config) {
  return withPodfile(config, (config) => {
    const podfile = config.modResults.contents;

    if (podfile.includes("ReactAppDependencyProvider")) {
      return config;
    }

    const lines = podfile.split("\n");
    const targetIndex = lines.findIndex((line) =>
      line.includes("config = use_native_modules!")
    );

    if (targetIndex === -1) {
      throw new Error(
        "Unable to locate `config = use_native_modules!` in the generated Podfile."
      );
    }

    const indent = lines[targetIndex].match(/^\s*/)?.[0] ?? "";
    lines.splice(targetIndex + 1, 0, `${indent}${POD_LINE}`);

    config.modResults.contents = lines.join("\n");
    return config;
  });
};
