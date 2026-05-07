import { describe, expect } from "bun:test"
import path from "path"
import { Effect } from "effect"
import { Memory } from "../../src/memory"
import { testEffect } from "../lib/effect"
import { TestInstance } from "../fixture/fixture"
import fs from "fs/promises"

const it = testEffect(Memory.defaultLayer)

describe("Memory", () => {
  it.instance("loads content from .opencode/memory/MEMORY.md", () =>
    Effect.gen(function* () {
      const test = yield* TestInstance
      const memoryDir = path.join(test.directory, ".opencode", "memory")
      const memoryPath = path.join(memoryDir, "MEMORY.md")

      yield* Effect.promise(() => fs.mkdir(memoryDir, { recursive: true }))
      yield* Effect.promise(() => fs.writeFile(memoryPath, "Test memory content"))

      const svc = yield* Memory.Service
      const content = yield* svc.get()
      expect(content).toBe("Test memory content")
    }),
  )

  it.instance("returns empty string when MEMORY.md does not exist", () =>
    Effect.gen(function* () {
      const svc = yield* Memory.Service
      const content = yield* svc.get()
      expect(content).toBe("")
    }),
  )

  it.instance("returns empty string when .opencode/memory directory does not exist", () =>
    Effect.gen(function* () {
      const svc = yield* Memory.Service
      const content = yield* svc.get()
      expect(content).toBe("")
    }),
  )
})
