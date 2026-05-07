import { Context, Effect, Layer } from "effect"
import { AppFileSystem } from "@opencode-ai/core/filesystem"
import { InstanceState } from "@/effect/instance-state"
import path from "path"

export interface Interface {
  readonly get: () => Effect.Effect<string>
}

export class Service extends Context.Service<Service, Interface>()("@opencode/memory") {}

export const layer = Layer.effect(
  Service,
  Effect.gen(function* () {
    const fs = yield* AppFileSystem.Service

    const get = Effect.fn("Memory.get")(function* () {
      const ctx = yield* InstanceState.context
      const memoryPath = path.join(ctx.directory, ".opencode", "memory", "MEMORY.md")
      return yield* fs.readFileString(memoryPath).pipe(
        Effect.catch(() => Effect.succeed(""))
      )
    })

    return Service.of({ get })
  }),
)

export const defaultLayer = layer.pipe(
  Layer.provide(AppFileSystem.defaultLayer)
)

export * as Memory from "."
