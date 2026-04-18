const modules = import.meta.glob("@/assets/icons/**/*.svg", {
  eager: true,
  import: "default",
});

const icons = Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => {
    const fileName = path.split("/").pop()!.replace(".svg", "");

    const name = fileName
      .toLowerCase()
      .replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase());
    return [name, mod];
  }),
);
const typedIcons = icons as Record<string, string>;

export type IconName = keyof typeof typedIcons;

export const getIcon = (name: IconName): string => typedIcons[name];

export default typedIcons;
