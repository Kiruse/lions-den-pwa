<template>
  <svg class="CopyIcon" :width="size" :height="size" viewBox="0 0 25 25" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg">
    <g id="Group">
      <path d="M22 4C23.1047 4 24 4.89528 24 6L24 22C24 23.1047 23.1047 24 22 24L6 24C4.89528 24 4 23.1047 4 22L4 6C4 4.89528 4.89528 4 6 4L22 4Z" id="front" fill="none" stroke="currentColor" stroke-width="2" />
      <path d="M2.00002 19.0001C2.00001 18.0082 2.00001 3.1028 2.00002 3.00003C2.00001 2.32292 2.37153 2.00001 3.00003 2.00002C3.032 2.00392 18.0027 2.00003 19.0001 2.00002C20.4871 2.00003 20.5339 3.8743e-07 19.0001 3.8743e-07C18.0027 3.8743e-07 3.00398 0.00110381 3.00003 3.8743e-07C0.99897 7.16013e-06 1.02818e-06 1.00169 1.02818e-06 3.00003C1.02818e-06 3.00045 1.02818e-06 18.0004 1.02818e-06 19.0001C1.02818e-06 20.514 2 20.514 2.00002 19.0001Z" id="Vector" fill="currentColor" fill-rule="evenodd" stroke="none" />
    </g>
  </svg>
</template>

<script lang="coffee">
export default
  props:
    size:
      type: Number
      default: 25
</script>
