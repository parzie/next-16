export function FormError({ error }: { error?: string[] }) {
  if (!error) {
    return null;
  }
  return error.map((err, index) => (
    <div
      key={index}
      className="text-pink-500 text-sx italic mt-1 py-2"
      role="alert"
    >
      {err}
    </div>
  ));
}
