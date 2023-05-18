module.exports = {
  "stories": ["../src/stories/**/*.stories.mdx", "../src/stories/**/*.stories.@(js|jsx|ts|tsx)"],
  "addons": ["@storybook/addon-links", "@storybook/addon-essentials", "@storybook/addon-interactions", "@storybook/preset-create-react-app", '@storybook/addon-a11y', "@storybook/addon-docs", "@storybook/addon-mdx-gfm"],
  "framework": {
    name: "@storybook/react-webpack5",
    options: {}
  },
  features: {
    previewMdx2: true
  },
  docs: {
    autodocs: true
  }
};