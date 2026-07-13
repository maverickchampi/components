/** @type {import('@storybook/react').Preview} */
import "../src/styles/theme.scss";

export const globalTypes = {
  theme: {
    name: "Theme",
    description: "Tema global",
    defaultValue: "dark",
    toolbar: {
      icon: "mirror",
      items: [
        { value: "dark", title: "Dark" },
        { value: "light", title: "Light" }
      ],
      showName: true
    }
  }
};

export const decorators = [
  (Story, context) => {
    document.documentElement.setAttribute("data-theme", context.globals.theme);
    return Story();
  }
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/i
    }
  },
  backgrounds: {
    default: "dark",
    values: [
      { name: "dark", value: "#091e25" },
      { name: "light", value: "#fbfdfe" }
    ]
  }
};
