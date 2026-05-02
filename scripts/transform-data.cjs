#!/usr/bin/env node

/**
 * Transform Jan Aushadhi data to app schema
 * Run: node scripts/transform-data.js
 */

const fs = require('fs');
const path = require('path');

// Read raw data
const storesRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/data/janaushadhi_stores.json'), 'utf8'));
const productsRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/data/janaushadhi_products.json'), 'utf8'));

console.log('Loaded stores:', storesRaw.length);
console.log('Loaded products:', productsRaw.responseBody?.newProductResponsesList?.length || 0);

// Transform stores
function transformStores(stores) {
  return stores.map(store => ({
    id: store.storeCode || `store-${store.id}`,
    name: `Jan Aushadhi Kendra - ${store.districtName}`,
    address: store.kendraAddress || '',
    city: store.districtName || '',
    state: store.stateName || '',
    pincode: String(store.pinCode || ''),
    lat: parseFloat(store.latitude) || 0,
    lon: parseFloat(store.longitude) || 0,
    phone: store.contactNumber || ''
  })).filter(s => s.lat !== 0 && s.lon !== 0); // Remove stores without coordinates
}

// Common branded equivalents mapping (approximate market prices)
const brandedEquivalentsMap = {
  'Aceclofenac': [
    { name: 'Hifenac', manufacturer: 'Intas', multiplier: 3.5 },
    { name: 'Zerodol', manufacturer: 'Ipca', multiplier: 3.2 }
  ],
  'Paracetamol': [
    { name: 'Crocin', manufacturer: 'GSK', multiplier: 4 },
    { name: 'Calpol', manufacturer: 'GSK', multiplier: 3.8 },
    { name: 'Dolo 650', manufacturer: 'Micro Labs', multiplier: 5 }
  ],
  'Pregabalin': [
    { name: 'Lyrica', manufacturer: 'Pfizer', multiplier: 8 },
    { name: 'Pregeb', manufacturer: 'Sun Pharma', multiplier: 6 }
  ],
  'Aspirin': [
    { name: 'Ecosprin', manufacturer: 'USV', multiplier: 3 },
    { name: 'Disprin', manufacturer: 'Reckitt', multiplier: 4 }
  ],
  'Diclofenac': [
    { name: 'Voveran', manufacturer: 'Novartis', multiplier: 5 },
    { name: 'Dynapar', manufacturer: 'Troikaa', multiplier: 4.5 }
  ],
  'Metformin': [
    { name: 'Glycomet', manufacturer: 'USV', multiplier: 4 },
    { name: 'Cetapin', manufacturer: 'Sanofi', multiplier: 5 }
  ],
  'Glimepiride': [
    { name: 'Amaryl', manufacturer: 'Sanofi', multiplier: 6 },
    { name: 'Glimestar', manufacturer: 'Mankind', multiplier: 4 }
  ],
  'Atorvastatin': [
    { name: 'Lipitor', manufacturer: 'Pfizer', multiplier: 10 },
    { name: 'Tonact', manufacturer: 'Lupin', multiplier: 6 }
  ],
  'Amlodipine': [
    { name: 'Norvasc', manufacturer: 'Pfizer', multiplier: 8 },
    { name: 'Amlopres', manufacturer: 'Cipla', multiplier: 5 }
  ],
  'Losartan': [
    { name: 'Cozaar', manufacturer: 'Merck', multiplier: 8 },
    { name: 'Losar', manufacturer: 'Cipla', multiplier: 5 }
  ],
  'Telmisartan': [
    { name: 'Telsar', manufacturer: 'Cipla', multiplier: 5 },
    { name: 'Telmikind', manufacturer: 'Mankind', multiplier: 4 }
  ],
  'Metoprolol': [
    { name: 'Metolar', manufacturer: 'Cipla', multiplier: 5 },
    { name: 'Prolomet', manufacturer: 'Sun Pharma', multiplier: 4.5 }
  ],
  'Pantoprazole': [
    { name: 'Pantocid', manufacturer: 'Sun Pharma', multiplier: 6 },
    { name: 'Pan', manufacturer: 'Alkem', multiplier: 5 }
  ],
  'Omeprazole': [
    { name: 'Omez', manufacturer: 'Dr Reddy\'s', multiplier: 5 },
    { name: 'Omecip', manufacturer: 'Cipla', multiplier: 4 }
  ],
  'Ranitidine': [
    { name: 'Rantac', manufacturer: 'J B Chemicals', multiplier: 4 },
    { name: 'Aciloc', manufacturer: 'Cadila', multiplier: 3.5 }
  ],
  'Cetirizine': [
    { name: 'Zyrtec', manufacturer: 'Dr Reddy\'s', multiplier: 5 },
    { name: 'Cetzine', manufacturer: 'GSK', multiplier: 4 }
  ],
  'Levocetirizine': [
    { name: 'Allegra', manufacturer: 'Sanofi', multiplier: 8 },
    { name: 'LCZ', manufacturer: 'Rapross', multiplier: 5 }
  ],
  'Montelukast': [
    { name: 'Singulair', manufacturer: 'MSD', multiplier: 12 },
    { name: 'Montair', manufacturer: 'Cipla', multiplier: 6 }
  ],
  'Salbutamol': [
    { name: 'Asthalin', manufacturer: 'Cipla', multiplier: 4 },
    { name: 'Ventolin', manufacturer: 'GSK', multiplier: 6 }
  ],
  'Azithromycin': [
    { name: 'Azithral', manufacturer: 'Alembic', multiplier: 6 },
    { name: 'Zithromax', manufacturer: 'Pfizer', multiplier: 10 }
  ],
  'Amoxicillin': [
    { name: 'Augmentin', manufacturer: 'GSK', multiplier: 10 },
    { name: 'Mox', manufacturer: 'Ranbaxy', multiplier: 5 }
  ],
  'Ciprofloxacin': [
    { name: 'Ciplox', manufacturer: 'Cipla', multiplier: 5 },
    { name: 'Cifran', manufacturer: 'Sun Pharma', multiplier: 4.5 }
  ],
  'Metronidazole': [
    { name: 'Flagyl', manufacturer: 'Abbott', multiplier: 5 },
    { name: 'Metrogyl', manufacturer: 'J B Chemicals', multiplier: 4 }
  ],
  'Ibuprofen': [
    { name: 'Brufen', manufacturer: 'Abbott', multiplier: 5 },
    { name: 'Ibugesic', manufacturer: 'Cipla', multiplier: 4 }
  ],
  'Chlorpheniramine': [
    { name: 'Piriton', manufacturer: 'GSK', multiplier: 4 },
    { name: 'Cetcip', manufacturer: 'Cipla', multiplier: 3 }
  ],
  'Vitamin D3': [
    { name: 'Calcirol', manufacturer: 'Cadila', multiplier: 6 },
    { name: 'D-Rise', manufacturer: 'USV', multiplier: 5 }
  ],
  'Vitamin B Complex': [
    { name: 'Becosules', manufacturer: 'Pfizer', multiplier: 5 },
    { name: 'Becadexamin', manufacturer: 'GSK', multiplier: 4 }
  ],
  'Iron': [
    { name: 'Fersolate', manufacturer: 'GSK', multiplier: 4 },
    { name: 'Autrin', manufacturer: 'Pfizer', multiplier: 5 }
  ]
};

function getBrandedEquivalents(genericName, janAushadhiPrice) {
  // Find matching branded equivalents based on generic name
  const matches = [];

  for (const [key, brands] of Object.entries(brandedEquivalentsMap)) {
    if (genericName.toLowerCase().includes(key.toLowerCase())) {
      matches.push(...brands);
    }
  }

  // If no specific match, generate generic branded equivalents
  if (matches.length === 0) {
    return [
      { name: `${genericName.split(' ')[0]} (Branded)`, mrp: Math.round(janAushadhiPrice * 4 * 100) / 100, manufacturer: 'Major Pharma' },
      { name: `${genericName.split(' ')[0]}-D`, mrp: Math.round(janAushadhiPrice * 3 * 100) / 100, manufacturer: 'Generic Brand' }
    ];
  }

  return matches.map(b => ({
    name: b.name,
    mrp: Math.round(janAushadhiPrice * b.multiplier * 100) / 100,
    manufacturer: b.manufacturer
  }));
}

// Transform products
function transformProducts(products) {
  return products.map((product, index) => ({
    id: `ja-${product.productId || index}`,
    genericName: product.genericName || '',
    brandedEquivalents: getBrandedEquivalents(product.genericName || '', product.mrp || 0),
    janAushadhiPrice: product.mrp || 0,
    category: product.groupName || 'General',
    packSize: product.unitSize || ''
  }));
}

// Process data
const storesTransformed = transformStores(storesRaw);
const productsList = productsRaw.responseBody?.newProductResponsesList || [];
const productsTransformed = transformProducts(productsList);

console.log('\nTransformed stores:', storesTransformed.length);
console.log('Transformed products:', productsTransformed.length);

// Sample outputs
console.log('\n--- Sample Store ---');
console.log(JSON.stringify(storesTransformed[0], null, 2));

console.log('\n--- Sample Product ---');
console.log(JSON.stringify(productsTransformed[0], null, 2));

// Write transformed data
fs.writeFileSync(
  path.join(__dirname, '../public/data/jan-aushadhi-stores.json'),
  JSON.stringify(storesTransformed, null, 2)
);

fs.writeFileSync(
  path.join(__dirname, '../public/data/jan-aushadhi-products.json'),
  JSON.stringify(productsTransformed, null, 2)
);

console.log('\n✅ Data transformation complete!');
console.log('Files written:');
console.log('- public/data/jan-aushadhi-stores.json');
console.log('- public/data/jan-aushadhi-products.json');
