import type { Meta, StoryObj } from "@storybook/react";
import styles from "./styles.module.scss";
import { ICON_NAMES } from "./props";

const meta: Meta = {
  title: "Foundations/Icons",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
Los iconos se usan con la etiqueta \`<i>\` y una clase con el prefijo \`mc-\`,
generada por Icomoon, por default el tamaño es 24px. **No existe un componente \`Icon\`** — se usa directamente:

\`\`\`tsx
<i className="mc-earth" />
\`\`\`

### Con tamaño y color personalizados

\`\`\`tsx
<i className="mc-earth" style={{ fontSize: 16, color: "red" }} />
\`\`\`

### Accesibilidad

- Si el icono es decorativo (acompaña texto visible): usa \`aria-hidden="true"\`
- Si es el único contenido (ej. botón solo-icono): el \`aria-label\` en el elemento contenedor
  ya es suficiente — el navegador ignora el contenido interno al calcular el nombre accesible,
  así que \`aria-hidden\` en el icono ahí adentro es redundante (pero no incorrecto si lo dejas
  como práctica defensiva)

\`\`\`tsx
<i className="mc-close" aria-hidden="true" />

<button aria-label="Cerrar">
  <i className="mc-close" />
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
          onClick={() => navigator.clipboard.writeText(name)}
          title="Click para copiar la clase"
        >
          <i className={name} />
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
