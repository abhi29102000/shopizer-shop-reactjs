import {
  getDiscountPrice,
  getProducts,
  getSortedProducts,
} from "../helpers/product";

const mockProducts = [
  { id: 1, price: 100, discount: 10, category: ["men"], tag: ["new"], new: true, saleCount: 5 },
  { id: 2, price: 200, discount: 0,  category: ["women"], tag: ["sale"], new: false, saleCount: 10 },
  { id: 3, price: 50,  discount: 20, category: ["men"], tag: ["new"], new: true, saleCount: 3 },
];

describe("getDiscountPrice", () => {
  test("returns discounted price when discount > 0", () => {
    expect(getDiscountPrice(100, 10)).toBe(90);
  });

  test("returns null when no discount", () => {
    expect(getDiscountPrice(100, 0)).toBeNull();
  });
});

describe("getProducts", () => {
  test("filters by category", () => {
    const result = getProducts(mockProducts, "men");
    expect(result.every(p => p.category.includes("men"))).toBe(true);
  });

  test("returns new products when type is 'new'", () => {
    const result = getProducts(mockProducts, null, "new");
    expect(result.every(p => p.new)).toBe(true);
  });

  test("respects limit", () => {
    const result = getProducts(mockProducts, null, null, 2);
    expect(result.length).toBe(2);
  });
});

describe("getSortedProducts", () => {
  test("sorts by price high to low", () => {
    const result = getSortedProducts(mockProducts, "filterSort", "priceHighToLow");
    expect(result[0].price).toBe(200);
  });
});
