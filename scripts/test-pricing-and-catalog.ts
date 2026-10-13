/**
 * Automated Verification Test Suite for Catalog Store, Pricing Engine, and Category Rules
 * Run via: npx tsx scripts/test-pricing-and-catalog.ts
 */

import {
  calculateSellingPrice,
  computeProductPricing,
  formatINR,
  saveCategory,
  updateCategoryMarkup,
  deleteCategory,
  saveProduct,
  resetProductPriceOverride,
  bulkImportProducts,
  getProductBySku,
  loadCatalogStore,
} from "../src/lib/catalog-store";

import * as fs from "node:fs";
import * as path from "node:path";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASS: ${message}`);
}

async function runTests() {
  const dbPath = path.resolve(process.cwd(), "src/data/catalog-db.json");
  const originalBackup = fs.existsSync(dbPath) ? fs.readFileSync(dbPath, "utf-8") : null;

  try {
    console.log("\n=======================================================");
    console.log("🚀 STARTING PRICING & CATALOG STORE VERIFICATION SUITE");
    console.log("=======================================================\n");

  // 1. Test Base Pricing Formula
  console.log("--- 1. Testing Category-Based Pricing Formula ---");
  const p1 = calculateSellingPrice(100, 20);
  assert(p1 === 120, `Base 100 + 20% markup must equal 120 (got ${p1})`);

  const p2 = calculateSellingPrice(100, 5);
  assert(p2 === 105, `Base 100 + 5% markup must equal 105 (got ${p2})`);

  const p3 = calculateSellingPrice(100, 10);
  assert(p3 === 110, `Base 100 + 10% markup must equal 110 (got ${p3})`);

  const pDecimal = calculateSellingPrice(420, 25);
  assert(pDecimal === 525, `Base 420 + 25% markup must equal 525 (got ${pDecimal})`);

  // 2. Test Currency Formatting (₹ Indian Rupees)
  console.log("\n--- 2. Testing Currency Formatting in Indian Rupees (₹) ---");
  const inrSample = formatINR(1440);
  assert(inrSample.includes("₹") || inrSample.includes("1,440"), `formatINR(1440) formatted with ₹ symbol (got ${inrSample})`);

  // 3. Test Category Creation with Markup Percentage
  console.log("\n--- 3. Testing Category Creation & Markup Rule ---");
  const testCat = saveCategory({
    name: "Test Robotics",
    tagline: "Autonomous bots",
    description: "Robotics components",
    markupPercentage: 30, // 30% markup
  });
  assert(testCat.markupPercentage === 30, `Category created with 30% markup`);
  assert(testCat.id === "test-robotics", `Category slug generated as test-robotics`);

  // 4. Test Product Creation with Category Markup
  console.log("\n--- 4. Testing Product Creation & Rule Application ---");
  const testProd = saveProduct({
    sku: "TEST-001",
    name: "Autonomous Rover Kit",
    categoryId: "test-robotics",
    basePrice: 1000, // Base 1,000 + 30% = 1,300
    isPriceOverridden: false,
    overridePrice: null,
    stock: 15,
  });
  assert(testProd.sellingPrice === 1300, `Automated selling price is 1300 for base 1000 + 30% markup`);
  assert(testProd.isPriceOverridden === false, `Product is not overridden`);

  // 5. Test Product with Manual Price Override
  console.log("\n--- 5. Testing Manual Price Override ---");
  const overrideProd = saveProduct({
    sku: "TEST-002",
    name: "Special Deal Rover Motor",
    categoryId: "test-robotics",
    basePrice: 500, // Calculated would be 500 + 30% = 650. Overridden to 599.
    isPriceOverridden: true,
    overridePrice: 599,
    stock: 20,
  });
  assert(overrideProd.sellingPrice === 599, `Overridden selling price is 599 (got ${overrideProd.sellingPrice})`);
  assert(overrideProd.isPriceOverridden === true, `Product marked as price overridden`);

  // 6. Test Category Markup Change Behavior with Overrides Protected
  console.log("\n--- 6. Testing Category Markup Update & Override Protection ---");
  // Change category markup from 30% to 40%
  updateCategoryMarkup("test-robotics", 40);

  const updatedTestProd = getProductBySku("TEST-001");
  assert(
    updatedTestProd?.sellingPrice === 1400,
    `Standard product recalculated to 1400 (Base 1000 + 40% = 1400)`
  );

  const updatedOverrideProd = getProductBySku("TEST-002");
  assert(
    updatedOverrideProd?.sellingPrice === 599,
    `CRITICAL REQUIREMENT: Overridden product preserved manual price 599 (got ${updatedOverrideProd?.sellingPrice})`
  );
  assert(
    updatedOverrideProd?.isPriceOverridden === true,
    `Override flag remained true`
  );

  // 7. Test 1-Click Revert Override to Category Rule
  console.log("\n--- 7. Testing Reset Product Override to Category Rule ---");
  const revertedProd = resetProductPriceOverride("TEST-002");
  assert(
    revertedProd.isPriceOverridden === false,
    `Override removed: isPriceOverridden is false`
  );
  assert(
    revertedProd.sellingPrice === 700,
    `Reverted selling price recalculated to 700 (Base 500 + 40% = 700, got ${revertedProd.sellingPrice})`
  );

  // 8. Test Product Without Image Placeholder Capability
  console.log("\n--- 8. Testing Products Without Image ---");
  const noImageProd = saveProduct({
    sku: "TEST-NOIMG",
    name: "Micro Resistor Pack",
    categoryId: "test-robotics",
    basePrice: 50,
    image: null,
  });
  assert(noImageProd.image === null, `Product exists with null image for placeholder rendering`);

  // 9. Test Bulk Import
  console.log("\n--- 9. Testing Bulk Product Import ---");
  const runId = Date.now().toString(36);
  const skuB1 = `BULK-${runId}-1`;
  const skuB2 = `BULK-${runId}-2`;
  const bulkResult = bulkImportProducts([
    {
      sku: skuB1,
      name: "Bulk Cable Type A",
      categoryId: "test-robotics",
      basePrice: 80,
    },
    {
      sku: skuB2,
      name: "Bulk Cable Type B",
      categoryId: "test-robotics",
      basePrice: 120,
    },
  ]);
  assert(bulkResult.imported === 2, `Bulk imported 2 new products`);

  const b1 = getProductBySku(skuB1);
  assert(b1 !== undefined && b1.sellingPrice === 112, `${skuB1} Base 80 + 40% = 112 (got ${b1?.sellingPrice})`);

  // 10. Clean up test category
  console.log("\n--- 10. Testing Category Deletion & Reassignment ---");
  deleteCategory("test-robotics", "electronics");
  const movedProd = getProductBySku("TEST-001");
  assert(movedProd?.categoryId === "electronics", `Products in deleted category reassigned to electronics`);

  console.log("\n=======================================================");
  console.log("🎉 ALL TESTS PASSED SUCCESSFULLY! 10/10 VERIFIED");
  console.log("=======================================================\n");
  } finally {
    if (originalBackup) {
      fs.writeFileSync(dbPath, originalBackup, "utf-8");
      console.log("🧹 Cleaned up: Restored live catalog-db.json after test run.");
    }
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
