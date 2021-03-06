import {
  convertToArrayMap,
  generateSimpleMap,
  walkable,
} from "./game-mechanics"

describe("generateSimpleMap", () => {
  it("returns a 2d array", () => {
    const expectedMap = [
      [true, true, true, true, true, true, true],
      [true, false, false, false, false, false, true],
      [true, false, false, false, false, false, true],
      [true, false, false, false, false, false, true],
      [true, false, false, false, false, false, true],
      [true, false, false, false, false, false, true],
      [true, false, false, false, false, false, true],
      [true, true, true, true, true, true, true],
    ]

    expect(generateSimpleMap()).toEqual(expectedMap)
  })

  it("returns a 2d array from string map", () => {
    const expectedStringMap = [
      "1111111",
      "1000001",
      "1000001",
      "1000001",
      "1000001",
      "1000001",
      "1000001",
      "1111111",
    ]

    expect(generateSimpleMap()).toEqual(convertToArrayMap(expectedStringMap))
  })
})

describe("convertToArrayMap", () => {
  it("returns boolean map", () => {
    const stringMap = ["10", "01"]
    const expectedBooleanMap = [
      [true, false],
      [false, true],
    ]

    expect(convertToArrayMap(stringMap)).toEqual(expectedBooleanMap)
  })
})

describe("walkable", () => {
  it("returns true if the designated location is not hole (false)", () => {
    const map = convertToArrayMap(["00", "11"])

    const [x, y] = [0, 0]

    expect(walkable(x, y, map)).toBe(true)
  })

  it("returns false if the designated location is hole (true)", () => {
    const map = convertToArrayMap(["00", "11"])

    const [x, y] = [0, 1]

    expect(walkable(x, y, map)).toBe(false)
  })
})
