const modules = import.meta.glob(
  "@/assets/images/**/*.{png,jpg,jpeg,webp,svg}",
  {
    eager: true,
    import: "default",
  },
);

const toCamelCase = (value: string) =>
  value.replace(/-([a-z0-9])/gi, (_, char: string) => char.toUpperCase());

const images = Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => {
    const fileName = path
      .split("/")
      .pop()!
      .replace(/\.(png|jpg|jpeg|webp|svg)$/i, "");

    const name = toCamelCase(fileName);

    return [name, mod];
  }),
);

export default images as Record<string, string>;
