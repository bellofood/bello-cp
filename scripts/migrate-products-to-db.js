/**
 * MIGRATE PRODUCTS TO DATABASE
 * 
 * This script migrates all hardcoded products from the website
 * (pages/products.jsx) to the Supabase database
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
}

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// All products from your website
const products = [
  // GREEN OLIVES
  {
    slug: 'whole-green-olives',
    category: 'green-olives',
    name_en: 'Whole Green Olives',
    name_ar: 'زيتون أخضر كامل',
    name_ru: 'Зеленые оливки целые',
    description_en: 'Premium whole green olives',
    description_ar: 'زيتون أخضر كامل ممتاز',
    description_ru: 'Премиум целые зеленые оливки',
    main_image: '/assets/images/products/GLASS JARS/Whole Green Olives .png',
    is_published: true,
    is_featured: true,
    display_order: 1
  },
  {
    slug: 'pitted-green-olives',
    category: 'green-olives',
    name_en: 'Pitted Green Olives',
    name_ar: 'زيتون أخضر منزوع النوى',
    name_ru: 'Зеленые оливки без косточек',
    description_en: 'Convenient pitted green olives',
    description_ar: 'زيتون أخضر منزوع النوى',
    description_ru: 'Удобные зеленые оливки без косточек',
    main_image: '/assets/images/products/GLASS JARS/Pitted Green Olives .png',
    is_published: true,
    is_featured: false,
    display_order: 2
  },
  {
    slug: 'sliced-green-olives',
    category: 'green-olives',
    name_en: 'Sliced Green Olives',
    name_ar: 'زيتون أخضر مقطع',
    name_ru: 'Нарезанные зеленые оливки',
    description_en: 'Pre-sliced green olives for convenience',
    description_ar: 'زيتون أخضر مقطع للراحة',
    description_ru: 'Предварительно нарезанные зеленые оливки',
    main_image: '/assets/images/products/GLASS JARS/Sliced Green Olives .png',
    is_published: true,
    is_featured: false,
    display_order: 3
  },

  // BLACK OLIVES
  {
    slug: 'whole-black-olives',
    category: 'black-olives',
    name_en: 'Whole Black Olives',
    name_ar: 'زيتون أسود كامل',
    name_ru: 'Черные оливки целые',
    description_en: 'Rich and flavorful whole black olives',
    description_ar: 'زيتون أسود كامل غني ولذيذ',
    description_ru: 'Насыщенные целые черные оливки',
    main_image: '/assets/images/products/GLASS JARS/Whole Black Olives.png',
    is_published: true,
    is_featured: true,
    display_order: 4
  },
  {
    slug: 'pitted-black-olives',
    category: 'black-olives',
    name_en: 'Pitted Black Olives',
    name_ar: 'زيتون أسود منزوع النوى',
    name_ru: 'Черные оливки без косточек',
    description_en: 'Pitted black olives ready to use',
    description_ar: 'زيتون أسود منزوع النوى جاهز للاستخدام',
    description_ru: 'Черные оливки без косточек',
    main_image: '/assets/images/products/GLASS JARS/Pitted Black Olives .png',
    is_published: true,
    is_featured: false,
    display_order: 5
  },
  {
    slug: 'sliced-black-olives',
    category: 'black-olives',
    name_en: 'Sliced Black Olives',
    name_ar: 'زيتون أسود مقطع',
    name_ru: 'Нарезанные черные оливки',
    description_en: 'Sliced black olives for toppings',
    description_ar: 'زيتون أسود مقطع للإضافات',
    description_ru: 'Нарезанные черные оливки',
    main_image: '/assets/images/products/GLASS JARS/Sliced Black Olives .png',
    is_published: true,
    is_featured: false,
    display_order: 6
  },
  {
    slug: 'whole-black-natural-kalamata-olives',
    category: 'black-olives',
    name_en: 'Whole Black Natural Kalamata Olives',
    name_ar: 'زيتون كالاماتا أسود طبيعي كامل',
    name_ru: 'Натуральные оливки Каламата целые',
    description_en: 'Authentic Greek Kalamata olives',
    description_ar: 'زيتون كالاماتا اليوناني الأصلي',
    description_ru: 'Подлинные греческие оливки Каламата',
    main_image: '/assets/images/products/GLASS JARS/Whole Black Natural Kalamata Olives.png',
    is_published: true,
    is_featured: true,
    display_order: 7
  },
  {
    slug: 'pitted-black-natural-kalamata-olives',
    category: 'black-olives',
    name_en: 'Pitted Black Natural Kalamata Olives',
    name_ar: 'زيتون كالاماتا أسود طبيعي منزوع النوى',
    name_ru: 'Натуральные оливки Каламата без косточек',
    description_en: 'Pitted Kalamata olives',
    description_ar: 'زيتون كالاماتا منزوع النوى',
    description_ru: 'Оливки Каламата без косточек',
    main_image: '/assets/images/products/GLASS JARS/Pitted Black Natural Kalamata Olives.png',
    is_published: true,
    is_featured: false,
    display_order: 8
  },
  {
    slug: 'sliced-black-natural-kalamata-olives',
    category: 'black-olives',
    name_en: 'Sliced Black Natural Kalamata Olives',
    name_ar: 'زيتون كالاماتا أسود طبيعي مقطع',
    name_ru: 'Нарезанные натуральные оливки Каламата',
    description_en: 'Sliced Kalamata olives',
    description_ar: 'زيتون كالاماتا مقطع',
    description_ru: 'Нарезанные оливки Каламата',
    main_image: '/assets/images/products/GLASS JARS/Sliced Black Natural Kalamata Olives.png',
    is_published: true,
    is_featured: false,
    display_order: 9
  },
  {
    slug: 'whole-black-natural-picual-olives',
    category: 'black-olives',
    name_en: 'Whole Black Natural Picual Olives',
    name_ar: 'زيتون بيكوال أسود طبيعي كامل',
    name_ru: 'Натуральные оливки Пикуаль целые',
    description_en: 'Spanish Picual variety whole olives',
    description_ar: 'زيتون بيكوال الإسباني الكامل',
    description_ru: 'Испанские оливки Пикуаль целые',
    main_image: '/assets/images/products/GLASS JARS/Whole Black Natural Picual Olives .jpg',
    is_published: true,
    is_featured: false,
    display_order: 10
  },
  {
    slug: 'pitted-black-natural-picual-olives',
    category: 'black-olives',
    name_en: 'Pitted Black Natural Picual Olives',
    name_ar: 'زيتون بيكوال أسود طبيعي منزوع النوى',
    name_ru: 'Натуральные оливки Пикуаль без косточек',
    description_en: 'Pitted Picual olives',
    description_ar: 'زيتون بيكوال منزوع النوى',
    description_ru: 'Оливки Пикуаль без косточек',
    main_image: '/assets/images/products/GLASS JARS/Pitted Black Natural Picual Olives.png',
    is_published: true,
    is_featured: false,
    display_order: 11
  },
  {
    slug: 'sliced-black-natural-picual-olives',
    category: 'black-olives',
    name_en: 'Sliced Black Natural Picual Olives',
    name_ar: 'زيتون بيكوال أسود طبيعي مقطع',
    name_ru: 'Нарезанные натуральные оливки Пикуаль',
    description_en: 'Sliced Picual olives',
    description_ar: 'زيتون بيكوال مقطع',
    description_ru: 'Нарезанные оливки Пикуаль',
    main_image: '/assets/images/products/GLASS JARS/Sliced  Black Natural Picual Olives.png',
    is_published: true,
    is_featured: false,
    display_order: 12
  },
  {
    slug: 'olive-black-natural-dolce',
    category: 'black-olives',
    name_en: 'Olive Black Natural Dolce',
    name_ar: 'زيتون دولسي أسود طبيعي',
    name_ru: 'Натуральные оливки Дольче',
    description_en: 'Sweet natural black olives',
    description_ar: 'زيتون أسود طبيعي حلو',
    description_ru: 'Сладкие натуральные черные оливки',
    main_image: '/assets/images/products/GLASS JARS/Olive Black Natural Dolce.png',
    is_published: true,
    is_featured: false,
    display_order: 13
  },
  {
    slug: 'pitted-black-natural-dolce',
    category: 'black-olives',
    name_en: 'Pitted Black Natural Dolce',
    name_ar: 'زيتون دولسي أسود طبيعي منزوع النوى',
    name_ru: 'Натуральные оливки Дольче без косточек',
    description_en: 'Pitted sweet black olives',
    description_ar: 'زيتون أسود حلو منزوع النوى',
    description_ru: 'Сладкие черные оливки без косточек',
    main_image: '/assets/images/products/GLASS JARS/Pitted Black Natural Dolce.png',
    is_published: true,
    is_featured: false,
    display_order: 14
  },

  // PEPPERS
  {
    slug: 'pepperoncini-pepper',
    category: 'peppers',
    name_en: 'Pepperoncini Pepper',
    name_ar: 'فلفل بيبيرونشيني',
    name_ru: 'Пепперончини перец',
    description_en: 'Mild Italian pepperoncini peppers',
    description_ar: 'فلفل بيبيرونشيني إيطالي معتدل',
    description_ru: 'Мягкий итальянский перец пепперончини',
    main_image: '/assets/images/products/GLASS JARS/pepperoncini Pepper.png',
    is_published: true,
    is_featured: true,
    display_order: 15
  },
  {
    slug: 'cherry-pepper',
    category: 'peppers',
    name_en: 'Cherry Pepper',
    name_ar: 'فلفل الكرز',
    name_ru: 'Перец черри',
    description_en: 'Sweet and tangy cherry peppers',
    description_ar: 'فلفل كرز حلو وحامض',
    description_ru: 'Сладкий и острый перец черри',
    main_image: '/assets/images/products/GLASS JARS/Cherry Pepper.png',
    is_published: true,
    is_featured: false,
    display_order: 16
  },
  {
    slug: 'kardoula-pepper',
    category: 'peppers',
    name_en: 'Kardoula Pepper',
    name_ar: 'فلفل كاردولا',
    name_ru: 'Перец Кардула',
    description_en: 'Traditional Greek Kardoula peppers',
    description_ar: 'فلفل كاردولا يوناني تقليدي',
    description_ru: 'Традиционный греческий перец Кардула',
    main_image: '/assets/images/products/GLASS JARS/Kardoula Pepper.png',
    is_published: true,
    is_featured: false,
    display_order: 17
  },
  {
    slug: 'whole-lombardi-pepper',
    category: 'peppers',
    name_en: 'Whole Lombardi Pepper',
    name_ar: 'فلفل لومباردي كامل',
    name_ru: 'Целый перец Ломбарди',
    description_en: 'Whole Lombardi peppers',
    description_ar: 'فلفل لومباردي كامل',
    description_ru: 'Целый перец Ломбарди',
    main_image: '/assets/images/products/GLASS JARS/Whole Lombardi Pepper.jpg',
    is_published: true,
    is_featured: false,
    display_order: 18
  },
  {
    slug: 'sliced-lombardi-pepper',
    category: 'peppers',
    name_en: 'Sliced Lombardi Pepper',
    name_ar: 'فلفل لومباردي مقطع',
    name_ru: 'Нарезанный перец Ломбарди',
    description_en: 'Sliced Lombardi peppers',
    description_ar: 'فلفل لومباردي مقطع',
    description_ru: 'Нарезанный перец Ломбарди',
    main_image: '/assets/images/products/GLASS JARS/Sliced Lombardi Pepper.png',
    is_published: true,
    is_featured: false,
    display_order: 19
  },
  {
    slug: 'sliced-green-jalapeno-pepper',
    category: 'peppers',
    name_en: 'Sliced Green Jalapeno Pepper',
    name_ar: 'فلفل هالابينو أخضر مقطع',
    name_ru: 'Нарезанный зеленый перец халапеньо',
    description_en: 'Spicy sliced green jalapeno',
    description_ar: 'فلفل هالابينو أخضر مقطع حار',
    description_ru: 'Острый нарезанный зеленый халапеньо',
    main_image: '/assets/images/products/GLASS JARS/Sliced Green Jalapeno Pepper.png',
    is_published: true,
    is_featured: false,
    display_order: 20
  },
  {
    slug: 'sliced-red-jalapeno-pepper',
    category: 'peppers',
    name_en: 'Sliced Red Jalapeno Pepper',
    name_ar: 'فلفل هالابينو أحمر مقطع',
    name_ru: 'Нарезанный красный перец халапеньо',
    description_en: 'Spicy sliced red jalapeno',
    description_ar: 'فلفل هالابينو أحمر مقطع حار',
    description_ru: 'Острый нарезанный красный халапеньо',
    main_image: '/assets/images/products/GLASS JARS/Sliced Red en Jalapeno Pepper.png',
    is_published: true,
    is_featured: false,
    display_order: 21
  },
  {
    slug: 'habiba-pepper',
    category: 'peppers',
    name_en: 'Habiba Pepper',
    name_ar: 'فلفل حبيبة',
    name_ru: 'Перец Хабиба',
    description_en: 'Traditional Habiba peppers',
    description_ar: 'فلفل حبيبة تقليدي',
    description_ru: 'Традиционный перец Хабиба',
    main_image: '/assets/images/products/GLASS JARS/Habiba Peppper.jpg',
    is_published: true,
    is_featured: false,
    display_order: 22
  },
  {
    slug: 'mexican-pepper',
    category: 'peppers',
    name_en: 'Mexican Pepper',
    name_ar: 'فلفل مكسيكي',
    name_ru: 'Мексиканский перец',
    description_en: 'Authentic Mexican peppers',
    description_ar: 'فلفل مكسيكي أصلي',
    description_ru: 'Подлинный мексиканский перец',
    main_image: '/assets/images/products/GLASS JARS/Mexican Pepper.png',
    is_published: true,
    is_featured: false,
    display_order: 23
  },
  {
    slug: 'macedonian-pepper',
    category: 'peppers',
    name_en: 'Macedonian Pepper',
    name_ar: 'فلفل مقدوني',
    name_ru: 'Македонский перец',
    description_en: 'Mediterranean Macedonian peppers',
    description_ar: 'فلفل مقدوني متوسطي',
    description_ru: 'Средиземноморский македонский перец',
    main_image: '/assets/images/products/GLASS JARS/Macedonian pepper jar.png',
    is_published: true,
    is_featured: false,
    display_order: 24
  },

  // ARTICHOKES
  {
    slug: 'artichoke-hearts',
    category: 'artichokes',
    name_en: 'Artichoke Hearts',
    name_ar: 'قلوب الخرشوف',
    name_ru: 'Сердцевины артишоков',
    description_en: 'Tender artichoke hearts',
    description_ar: 'قلوب خرشوف طرية',
    description_ru: 'Нежные сердцевины артишоков',
    main_image: '/assets/images/products/GLASS JARS/Artichoke Hearts .png',
    is_published: true,
    is_featured: true,
    display_order: 25
  },
  {
    slug: 'artichoke-quarter',
    category: 'artichokes',
    name_en: 'Artichoke Quarter',
    name_ar: 'خرشوف مقسم ربع',
    name_ru: 'Артишоки четвертинками',
    description_en: 'Quartered artichokes',
    description_ar: 'خرشوف مقسم أرباع',
    description_ru: 'Артишоки четвертинками',
    main_image: '/assets/images/products/GLASS JARS/Artichoke Quarter .png',
    is_published: true,
    is_featured: false,
    display_order: 26
  },
  {
    slug: 'artichoke-bottom',
    category: 'artichokes',
    name_en: 'Artichoke Bottom',
    name_ar: 'قعر الخرشوف',
    name_ru: 'Донышки артишоков',
    description_en: 'Premium artichoke bottoms',
    description_ar: 'قعر خرشوف ممتاز',
    description_ru: 'Премиум донышки артишоков',
    main_image: '/assets/images/products/GLASS JARS/Artichoke Bottom jar.png',
    is_published: true,
    is_featured: false,
    display_order: 27
  }
];

async function migrateProducts() {
  console.log('🚀 Starting product migration...\n');
  
  try {
    // First, clear existing products (optional - comment out if you want to keep test data)
    console.log('🗑️  Clearing existing products...');
    const { error: deleteError } = await supabaseAdmin
      .from('products')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    
    if (deleteError && deleteError.code !== 'PGRST116') { // PGRST116 = no rows to delete
      console.error('Error clearing products:', deleteError);
    } else {
      console.log('✅ Existing products cleared\n');
    }

    // Insert all products
    console.log(`📦 Inserting ${products.length} products...\n`);
    
    let successCount = 0;
    let errorCount = 0;

    for (const product of products) {
      const { data, error } = await supabaseAdmin
        .from('products')
        .insert([product])
        .select()
        .single();

      if (error) {
        console.error(`❌ Error inserting "${product.name_en}":`, error.message);
        errorCount++;
      } else {
        console.log(`✅ #${data.display_id} - ${product.name_en} (${product.category})`);
        successCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`\n🎉 Migration Complete!`);
    console.log(`   ✅ Success: ${successCount} products`);
    console.log(`   ❌ Failed: ${errorCount} products`);
    console.log(`   📊 Total: ${products.length} products\n`);

    // Show category breakdown
    console.log('📊 Products by Category:');
    const categories = {};
    products.forEach(p => {
      categories[p.category] = (categories[p.category] || 0) + 1;
    });
    Object.entries(categories).forEach(([cat, count]) => {
      console.log(`   - ${cat}: ${count} products`);
    });

    console.log('\n✨ You can now view these products in the Website Editor!');
    console.log('   URL: http://localhost:3000/website-editor\n');

  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateProducts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });

