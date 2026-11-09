// Trusted native-ESM teaching host: definition loading and instance ownership only.
// It provides no JS/CSS/security sandbox or virtual routing.
export function createRuntime(loadDefinition = url => import(url)) {
  const definitions = new Map()
  const instances = new Map()
  const containers = new WeakMap()
  let sequence = 0
  const events = []
  const report = (record, stage) => events.push({ id: record.id, name: record.name, stage })
  const remove = record => {
    if (instances.get(record.name) === record) instances.delete(record.name)
    if (containers.get(record.container) === record) containers.delete(record.container)
  }
  async function cleanup(record) {
    if (!record.instance || record.cleaned) return
    if (!record.cleaning) record.cleaning = (async () => {
      try {
        await record.instance.unmount()
        record.cleaned = true
        report(record, 'cleaned')
      } catch (error) {
        record.status = 'cleanup_failed'
        report(record, 'cleanup-failed')
        throw error
      }
    })()
    await record.cleaning
  }
  async function mount({ name, entry, container, props = {}, capabilities = {} }) {
    if (!name || !entry) throw new Error('name and entry required')
    if (instances.has(name)) throw new Error(`name reserved: ${name}`)
    if (!container || !['object', 'function'].includes(typeof container)) throw new Error('container reference required')
    if (containers.has(container)) throw new Error('container reserved')
    const record = { id: ++sequence, name, container, controller: new AbortController(), status: 'loading', cleaned: false }
    instances.set(name, record)
    containers.set(container, record)
    report(record, 'loading')
    if (!definitions.has(entry)) definitions.set(entry, Promise.resolve().then(() => loadDefinition(entry)))
    record.done = (async () => {
      try {
        const definition = await definitions.get(entry)
        if (record.controller.signal.aborted) { report(record, 'cancelled-before-create'); return { status: 'cancelled' } }
        if (typeof definition.createApplication !== 'function') throw new Error('entry must export createApplication')
        record.instance = definition.createApplication()
        record.status = 'mounting'
        report(record, 'mounting')
        await record.instance.mount(container, props, { ...capabilities, signal: record.controller.signal })
        if (record.controller.signal.aborted) { await cleanup(record); report(record, 'cancelled-after-mount'); return { status: 'cancelled' } }
        record.status = 'mounted'
        report(record, 'mounted')
        // This handle owns the record object, not whatever later reuses its name.
        return { status: 'mounted', id: record.id, unmount: () => dispose(record) }
      } catch (error) {
        if (record.status !== 'cleanup_failed') {
          record.status = 'failed'
          try { await cleanup(record) } catch (cleanupError) { throw new AggregateError([error, cleanupError], 'mount and cleanup failed') }
        }
        throw error
      } finally {
        if (!['mounted', 'cleanup_failed'].includes(record.status)) remove(record)
      }
    })()
    return record.done
  }
  async function dispose(record) {
    record.controller.abort()
    await record.done
    await cleanup(record)
    record.status = 'unmounted'
    remove(record)
  }
  return {
    mount,
    cancel(name) {
      const record = instances.get(name)
      if (!record) return false
      record.controller.abort()
      report(record, 'cancel-requested')
      return true
    },
    async unmount(name) { const record = instances.get(name); if (record) await dispose(record) },
    snapshot: () => [...instances.values()].map(({ name, id, status }) => ({ name, id, status })),
    events,
  }
}
