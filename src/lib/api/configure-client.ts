import { client } from "@/lib/api/client.gen"

export function configureApiClient(
  accessToken?: string,
) {
  client.setConfig({
    headers: {
      Authorization:
        accessToken
          ? `Bearer ${accessToken}`
          : "",
    },
  })
}