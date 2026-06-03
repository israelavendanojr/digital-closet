/// <reference lib="webworker" />
import { removeBackground } from '@imgly/background-removal'

self.onmessage = async (e: MessageEvent<File>) => {
  try {
    const blob = await removeBackground(e.data)
    self.postMessage({ ok: true, blob })
  } catch {
    self.postMessage({ ok: false })
  }
}
