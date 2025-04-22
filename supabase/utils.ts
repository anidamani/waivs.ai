export const getMediaUrl = (fullPath: string) => {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${fullPath}`;
  return url;
};
