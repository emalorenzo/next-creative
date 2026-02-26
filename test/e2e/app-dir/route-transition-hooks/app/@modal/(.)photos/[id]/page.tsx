export default async function InterceptedPhotoModal({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return <div data-testid="route-photo-modal">Photo modal {id}</div>
}
