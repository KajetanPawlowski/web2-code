import { capitalise, reverse } from "./index.js"

it("capitalizes the first letter", () => {
    expect(capitalise("hello")).toBe("Hello")
})

it("reverse the string", () => {
    expect(reverse("1234")).toBe("4321")
})

