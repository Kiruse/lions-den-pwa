export zip = (arys...) =>
  len = Math.max arys.map((a) => a.length)...
  result = new Array len
  for i in [0...len]
    result[i] = arys.map (a) => a[i]
  result
