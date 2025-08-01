function flattenBenefits(nested: any[]): any[] {
  let flat: any[] = [];
  nested.forEach(parent => {
    parent.data.forEach((child: any, idx: number) => {
      flat.push({
        id: `${parent.id}-${idx}`,
        parentId: parent.id,
        heading: parent.heading,
        title: child.title,
        content: child.content,
        expanded: false
      });
    });
  });
  return flat;
}
