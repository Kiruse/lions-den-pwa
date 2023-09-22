import { computed, ref, watchEffect } from 'vue'

defer = (cb) -> setTimeout cb, 0

export default deferred = (callback) ->
  value = ref undefined
  pending = ref true
  promise = ref undefined
  result = computed =>
    value: value.value
    promise: promise.value
    pending: pending.value
  counter = 0

  watchEffect =>
    # needed in case callback is sync
    done = false
    # defer to avoid infinite reactivity loop
    defer -> pending.value = true unless done

    count = ++counter
    promise_ = callback.call this
    defer -> promise.value = promise_
    data = await promise_
    return unless count is counter

    done = true
    pending.value = false
    value.value = data
  result
