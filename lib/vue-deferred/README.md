# Vue Deferred
A simple composable + option for Vue 3 for "deferred" computations, i.e. computations which are either deferred to a later point or simply take some time to complete. This replaces other solutions such as [vue-use's `computedAsync`](https://vueuse.org/core/computedAsync/), while also integrating with the Options API.

## Usage
In an Options style Vue 3 component (CoffeeScript):
```coffee
export default
  props: ['foo', 'bar']
  deferred:
    foobar: -> "#{@foo}bar"
    barfoo: -> "#{@bar}foo"
```

`@foobar` and `@barfoo` will then be objects consisting of two properties:
- `pending`: Whether this deferred property is currently re-computing.
- `value`: The current value. Only re-assigned once computation has concluded. Before the first computation it will be `undefined`.

Thus, in a pug template, you can use:
```pug
div(:class='{ pending: foobar.pending }')= foobar.value
```

This would apply a CSS class `.pending` only if the deferred property `foobar` is currently pending, allowing you to, for example, render it as obsolete.

## Setup Script Caveat
In this project's current setup, the Vue setup script is not supported. I have no idea why, but the setup script is simply not properly compiled. Thus, I had a special need to specifically implement support for the Options API.
