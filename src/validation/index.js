export function emptyField(value) {
  return (
    !value || (Object.keys(value).length === 0 && value.constructor === Object)
  );
}
