import type { Meta, StoryObj } from "@storybook/react";
import styles from "./styles.module.scss";

const ICON_NAMES = [
  "clock",
  "earth",
  "laptop",
  "inbox",
  "message",
  "moon",
  "sun",
  "fingerprint",
  "language",
  "code",
  "redirect",
  "arrows-rotate",
  "arrows-rotate",
  "arrow-down",
  "arrow-left",
  "arrow-right",
  "arrow-up",
  "chevron-down",
  "chevron-left",
  "chevron-right",
  "chevron-up",
  "x"
] as const;

const meta: Meta = {
  title: "Foundations/Icons",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
Los iconos se usan con la etiqueta \`<i>\` y una clase con el prefijo \`mcr-\`,
generada por Icomoon. **No existe un componente \`Icon\`** — se usa directamente:

\`\`\`tsx
<i className="mcr-earth" />
\`\`\`

### Con tamaño y color personalizados

\`\`\`tsx
<i className="mcr-earth" style={{ fontSize: 24, color: "red" }} />
\`\`\`

### Accesibilidad

- Si el icono es decorativo (acompaña texto visible): usa \`aria-hidden="true"\`
- Si es el único contenido (ej. botón solo-icono): el \`aria-label\` en el elemento contenedor
  ya es suficiente — el navegador ignora el contenido interno al calcular el nombre accesible,
  así que \`aria-hidden\` en el icono ahí adentro es redundante (pero no incorrecto si lo dejas
  como práctica defensiva)

\`\`\`tsx
<i className="mcr-close" aria-hidden="true" />

<button aria-label="Cerrar">
  <i className="mcr-close" />
</button>
\`\`\`
        `
      }
    }
  }
};

export default meta;
type Story = StoryObj;

export const Gallery: Story = {
  render: () => (
    <div className={styles.grid}>
      {ICON_NAMES.map((name) => (
        <div
          key={name}
          className={styles.item}
          onClick={() => navigator.clipboard.writeText(`mcr-${name}`)}
          title="Click para copiar la clase"
        >
          <i className={`mcr-${name}`} />
          <span>{name}</span>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      source: {
        type: "code",
        code: null
      },
      canvas: {
        sourceState: "none"
      }
    }
  }
};
