/** @type {import('@storybook/react').Preview} */
import "../src/styles/index.scss";

export const globalTypes = {
  theme: {
    name: "Theme",
    description: "Tema global",
    defaultValue: "light",
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
    default: "light",
    values: [
      { name: "dark", value: "#091e25" },
      { name: "light", value: "#fbfdfe" }
    ]
  }
};
