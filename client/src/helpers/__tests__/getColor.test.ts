import { getColor } from "../getColor";
import { mockGamesEIgre } from "../../__mocks__/mockGameData";

describe("getColor", () => {
  const gameWithThumb = { ...mockGamesEIgre[0] };
  const gameWithoutThumb = { ...mockGamesEIgre[1], thumb: undefined };

  it("should return 'green' when the game has a thumbnail and state has not changed", () => {
    const result = getColor(gameWithThumb, false);
    expect(result).toBe("green");
  });

  it("should return 'orange' when the game has a thumbnail and state has changed", () => {
    const result = getColor(gameWithThumb, true);
    expect(result).toBe("orange");
  });

  it("should return 'white' when the game does not have a thumbnail", () => {
    const result = getColor(gameWithoutThumb, false);
    expect(result).toBe("white");
  });
});
