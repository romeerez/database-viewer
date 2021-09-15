type Type = {
  name: string;
  id: number;
};

export const getTypeName = (
  id: number,
  ...typeSets: Type[][]
): string | undefined => {
  for (const types of typeSets) {
    for (const type of types) {
      if (type.id === id) {
        return type.name;
      }
    }
  }
};
