const testJest = require("./test-jest")

describe("Units Tests Jest", () => {
  describe("Test", () => {
    test("adds 1 + 2 to equal 3", () => {
      expect(testJest(1, 2)).toBe(3)
    })
  })
})
