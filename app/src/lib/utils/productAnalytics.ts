import { ProductEdge } from "@/lib/apollo/types/products"; // Assuming types are in this path

/**
 * Calculates the total inventory value for a list of products.
 * Assumes price is a string and needs conversion.
 */
export function calculateTotalInventoryValue(productEdges: ProductEdge[]): number {
  if (!productEdges) return 0;

  return productEdges.reduce((totalValue, edge) => {
    const product = edge.node;
    if (!product || !product.variants || !product.variants.edges) {
      return totalValue;
    }

    const productInventoryValue = product.variants.edges.reduce((variantTotal, variantEdge) => {
      const variant = variantEdge.node;
      const price = parseFloat(variant.price);
      const quantity = variant.inventoryQuantity ?? 0;

      if (isNaN(price) || quantity <= 0) {
        return variantTotal;
      }
      return variantTotal + (price * quantity);
    }, 0);

    return totalValue + productInventoryValue;
  }, 0);
}

/**
 * Counts the number of products with low inventory.
 */
export function countLowInventoryProducts(productEdges: ProductEdge[], threshold: number = 10): number {
  if (!productEdges) return 0;

  let lowInventoryCount = 0;
  const processedProducts = new Set<string>(); // Avoid double-counting products

  productEdges.forEach(edge => {
    const product = edge.node;
    if (!product || !product.variants || !product.variants.edges || processedProducts.has(product.id)) {
      return;
    }

    const totalProductInventory = product.variants.edges.reduce((sum, variantEdge) => {
      return sum + (variantEdge.node.inventoryQuantity ?? 0);
    }, 0);

    if (totalProductInventory <= threshold) {
      lowInventoryCount++;
      processedProducts.add(product.id);
    }
  });

  return lowInventoryCount;
}

// Add more transformation functions as needed...
// Example: Group products by vendor (if vendor data is fetched)
// export function groupProductsByVendor(productEdges: ProductEdge[]) { ... } 