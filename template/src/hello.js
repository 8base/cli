export default async event => {
  return {
    data: {
      message: `Hello ${event.data.name}`
    }
  }
}
