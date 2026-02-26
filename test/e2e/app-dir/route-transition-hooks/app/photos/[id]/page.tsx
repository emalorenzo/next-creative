export default async function PhotoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return <div data-testid="route-photo-page">Photo page {id}</div>
}
