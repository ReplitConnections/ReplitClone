export const GET = async () => {
  return new Response(JSON.stringify({
    abc: "def",
    oho: {
      silly: 123,
      goner: [ "array, no way" ]
    }
  }), {
    status: 200
  })
}