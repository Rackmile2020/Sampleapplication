function getValueByKeyInsensitive(data: any[], inputKey: string): string | null {
  const lowerKey = inputKey.toLowerCase();

  for (const obj of data) {
    for (const key of Object.keys(obj)) {
      if (key.toLowerCase() === lowerKey) {
        return obj[key].value;
      }
    }
  }

  return null;
}
