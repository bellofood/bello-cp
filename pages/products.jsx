import PageBanner from "@/src/components/PageBanner";
import Layout from "@/src/layouts/Layout";
import Link from "next/link";
import { useTranslation } from 'next-i18next';
import { useState, useEffect } from 'react';

const Products = () => {
  const { t } = useTranslation('common');
  
  // State to manage active product category
  const [activeCategory, setActiveCategory] = useState('all');
  
  // State to manage view type for each individual product
  const [productViews, setProductViews] = useState({});
  
  // State for search functionality
  const [searchQuery, setSearchQuery] = useState('');

  // State for database products
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for category images
  const [categoryImages, setCategoryImages] = useState({});
  const [imageRefreshKey, setImageRefreshKey] = useState(0);

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?published_only=true');
        const data = await response.json();
        if (data.success) {
          setDbProducts(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch category images from website-images API
  useEffect(() => {
    const fetchCategoryImages = async () => {
      try {
        // Add cache-busting to ensure fresh images
        const response = await fetch(`/api/website-images/config?t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        const data = await response.json();
        if (data.success && data.images) {
          console.log('✅ Loaded category images:', {
            'category-all': data.images['category-all'],
            'category-green-olives': data.images['category-green-olives'],
            'category-black-olives': data.images['category-black-olives']
          });
          
          // Add timestamp to each image URL to force browser reload
          const timestamp = Date.now();
          const addCacheBuster = (url) => {
            if (!url) return url;
            const separator = url.includes('?') ? '&' : '?';
            return `${url}${separator}_refresh=${timestamp}`;
          };
          
          const newCategoryImages = {
            'all': addCacheBuster(data.images['category-all'] || '/assets/images/products/GLASS JARS/Whole Green Olives .png'),
            'green-olives': addCacheBuster(data.images['category-green-olives'] || '/assets/images/products/GLASS JARS/Whole Green Olives .png'),
            'black-olives': addCacheBuster(data.images['category-black-olives'] || '/assets/images/products/GLASS JARS/Whole Black Olives.png'),
            'peppers': addCacheBuster(data.images['category-peppers'] || '/assets/images/products/GLASS JARS/pepperoncini Pepper.png'),
            'artichokes': addCacheBuster(data.images['category-pickles'] || '/assets/images/products/GLASS JARS/Artichoke Hearts .png')
          };
          
          setCategoryImages(newCategoryImages);
          
          // Force image refresh by updating key
          setImageRefreshKey(prev => prev + 1);
          
          console.log('🔄 Updated category images with cache-busting:', newCategoryImages);
        }
      } catch (error) {
        console.error('Error fetching category images:', error);
        // Use default images if fetch fails
        setCategoryImages({
          'all': '/assets/images/products/GLASS JARS/Whole Green Olives .png',
          'green-olives': '/assets/images/products/GLASS JARS/Whole Green Olives .png',
          'black-olives': '/assets/images/products/GLASS JARS/Whole Black Olives.png',
          'peppers': '/assets/images/products/GLASS JARS/pepperoncini Pepper.png',
          'artichokes': '/assets/images/products/GLASS JARS/Artichoke Hearts .png'
        });
      }
    };

    fetchCategoryImages();
    
    // Refresh images every 30 seconds to catch updates
    const refreshInterval = setInterval(fetchCategoryImages, 30000);
    
    return () => clearInterval(refreshInterval);
  }, []);

  // Category data - updated to match database categories with dynamic images
  const categories = [
    { id: 'all', name: 'All Products', image: categoryImages['all'] || '/assets/images/products/GLASS JARS/Whole Green Olives .png' },
    { id: 'green-olives', name: t('productsPage.categories.greenOlives'), image: categoryImages['green-olives'] || '/assets/images/products/GLASS JARS/Whole Green Olives .png' },
    { id: 'black-olives', name: t('productsPage.categories.blackOlives'), image: categoryImages['black-olives'] || '/assets/images/products/GLASS JARS/Whole Black Olives.png' },
    { id: 'peppers', name: t('productsPage.categories.peppers'), image: categoryImages['peppers'] || '/assets/images/products/GLASS JARS/pepperoncini Pepper.png' },
    { id: 'artichokes', name: t('productsPage.categories.picklesVegetables'), image: categoryImages['artichokes'] || '/assets/images/products/GLASS JARS/Artichoke Hearts .png' }
  ];

  // Helper function to get current view for a specific product
  const getProductView = (productName) => {
    const availablePackaging = getAvailablePackaging(productName);
    return productViews[productName] || availablePackaging[0] || 'glass-jars';
  };

  // Helper function to set view for a specific product
  const setProductView = (productName, packaging) => {
    setProductViews(prev => ({
      ...prev,
      [productName]: packaging
    }));
  };

  // Helper function to render packaging buttons
  const renderPackagingButtons = (productName) => {
    const availablePackaging = getAvailablePackaging(productName);
    const currentView = getProductView(productName);
    const packagingLabels = {
      'glass-jars': t('productsPage.packagingTypes.glassJars'),
      'cans': t('productsPage.packagingTypes.cans'), 
      'vacuum-bags': t('productsPage.packagingTypes.vacuum'),
      'plastic-buckets': t('productsPage.packagingTypes.buckets'),
      'barrels': t('productsPage.packagingTypes.barrels'),
      'pet-packs': t('productsPage.packagingTypes.petPacks')
    };
    
    return availablePackaging.map((packaging) => (
      <button 
        key={packaging}
        className={`view-toggle-btn ${currentView === packaging ? 'active' : ''}`}
        onClick={() => setProductView(productName, packaging)}
      >
        {packagingLabels[packaging]}
      </button>
    ));
  };

  const getAvailablePackaging = (productName) => {
    const packagingMap = {
      // Green Olives - available in GLASS JARS, CANS, VACUUM BAGS + generic types
      'Whole Green Olives': ['glass-jars', 'cans', 'vacuum-bags', 'plastic-buckets', 'barrels', 'pet-packs'],
      'Pitted Green Olives': ['glass-jars', 'cans', 'vacuum-bags', 'plastic-buckets', 'barrels', 'pet-packs'],
      'Sliced Green Olives': ['glass-jars', 'cans', 'vacuum-bags', 'plastic-buckets', 'barrels', 'pet-packs'],
      
      // Black Olives - specific availability based on actual image files
      'Whole Black Olives': ['glass-jars', 'cans', 'vacuum-bags', 'plastic-buckets', 'barrels', 'pet-packs'],
      'Pitted Black Olives': ['glass-jars', 'cans', 'vacuum-bags', 'plastic-buckets', 'barrels', 'pet-packs'],
      'Sliced Black Olives': ['glass-jars', 'cans', 'vacuum-bags', 'plastic-buckets', 'barrels', 'pet-packs'],
      'Whole Black Natural Kalamata Olives': ['glass-jars', 'cans', 'vacuum-bags', 'plastic-buckets', 'barrels', 'pet-packs'],
      'Pitted Black Natural Kalamata Olives': ['glass-jars', 'cans', 'vacuum-bags', 'plastic-buckets', 'barrels', 'pet-packs'],
      'Sliced Black Natural Kalamata Olives': ['glass-jars', 'cans', 'vacuum-bags', 'plastic-buckets', 'barrels', 'pet-packs'],
      'Whole Black Natural Picual Olives': ['glass-jars', 'cans', 'vacuum-bags', 'plastic-buckets', 'barrels', 'pet-packs'],
      'Pitted Black Natural Picual Olives': ['glass-jars', 'cans', 'vacuum-bags', 'plastic-buckets', 'barrels', 'pet-packs'],
      'Sliced Black Natural Picual Olives': ['glass-jars', 'cans', 'vacuum-bags', 'plastic-buckets', 'barrels', 'pet-packs'],
      'Olive Black Natural Dolce': ['glass-jars', 'cans', 'vacuum-bags', 'plastic-buckets', 'barrels', 'pet-packs'],
      'Pitted Black Natural Dolce': ['glass-jars', 'cans', 'vacuum-bags', 'plastic-buckets', 'barrels', 'pet-packs'],
      
      // Peppers - based on actual image availability
      'Pepperoncini Pepper': ['glass-jars', 'cans', 'vacuum-bags', 'plastic-buckets', 'barrels', 'pet-packs'],
      'Cherry Pepper': ['glass-jars', 'cans', 'vacuum-bags', 'plastic-buckets', 'barrels', 'pet-packs'],
      'Kardoula Pepper': ['glass-jars', 'cans', 'vacuum-bags', 'plastic-buckets', 'barrels', 'pet-packs'],
      'Whole Lombardi Pepper': ['glass-jars', 'cans', 'vacuum-bags', 'plastic-buckets', 'barrels', 'pet-packs'],
      'Sliced Lombardi Pepper': ['glass-jars', 'cans', 'vacuum-bags', 'plastic-buckets', 'barrels', 'pet-packs'],
      'Sliced Green Jalapeno Pepper': ['glass-jars', 'cans', 'vacuum-bags', 'plastic-buckets', 'barrels', 'pet-packs'],
      'Sliced Red en Jalapeno Pepper': ['glass-jars', 'cans', 'vacuum-bags', 'plastic-buckets', 'barrels', 'pet-packs'],
      'Habiba Pepper': ['glass-jars', 'cans', 'vacuum-bags', 'plastic-buckets', 'barrels', 'pet-packs'],
      'Mexican Pepper': ['glass-jars', 'cans', 'vacuum-bags', 'plastic-buckets', 'barrels', 'pet-packs'],
      'Macedonian Pepper': ['glass-jars', 'cans', 'vacuum-bags', 'plastic-buckets', 'barrels', 'pet-packs'],
      
      // Artichokes
      'Artichoke Hearts': ['glass-jars', 'cans', 'vacuum-bags', 'plastic-buckets', 'barrels', 'pet-packs'],
      'Artichoke Quarter': ['glass-jars', 'cans', 'vacuum-bags', 'plastic-buckets', 'barrels', 'pet-packs'],
      'Artichoke Bottom': ['glass-jars', 'cans', 'vacuum-bags', 'plastic-buckets', 'barrels', 'pet-packs'],
    };
    
    return packagingMap[productName] || ['plastic-buckets']; // Default to plastic buckets if no specific mapping
  };

  // Function to get the correct image based on product name and its current packaging view
  const getProductImage = (productName) => {
    const currentView = getProductView(productName);
    const availablePackaging = getAvailablePackaging(productName);
    
    const folderMap = {
      'glass-jars': 'GLASS JARS',
      'cans': 'CANS', 
      'vacuum-bags': 'VACUUM BAGS',
      'plastic-buckets': 'PLASTIC BUCKETS',
      'barrels': 'BARRELS',
      'pet-packs': 'PET PACKS'
    };
    
    // Comprehensive image mapping for each packaging type based on actual files
    const imageMapByPackaging = {
      'glass-jars': {
        'Whole Green Olives': 'Whole Green Olives .png',
        'Pitted Green Olives': 'Pitted Green Olives .png',
        'Sliced Green Olives': 'Sliced Green Olives .png',
        'Whole Black Olives': 'Whole Black Olives.png',
        'Pitted Black Olives': 'Pitted Black Olives .png',
        'Sliced Black Olives': 'Sliced Black Olives .png',
        'Whole Black Natural Picual Olives': 'Whole Black Natural Picual Olives .jpg',
        'Pitted Black Natural Picual Olives': 'Pitted Black Natural Picual Olives.png',
        'Sliced Black Natural Picual Olives': 'Sliced  Black Natural Picual Olives.png',
        'Sliced Lombardi Pepper': 'Sliced Lombardi Pepper.png',
        'Pepperoncini Pepper': 'pepperoncini Pepper.png',
        'Cherry Pepper': 'Cherry Pepper.png',
        'Kardoula Pepper': 'Kardoula Pepper.png',
        'Whole Lombardi Pepper': 'Whole Lombardi Pepper.jpg',
        'Sliced Green Jalapeno Pepper': 'Sliced Green Jalapeno Pepper.png',
        'Sliced Red en Jalapeno Pepper': 'Sliced Red en Jalapeno Pepper.png',
        'Habiba Pepper': 'Habiba Peppper.jpg',
        'Mexican Pepper': 'Mexican Pepper.png',
        'Macedonian Pepper': 'Macedonian pepper jar.png',
        'Olive Black Natural Dolce': 'Olive Black Natural Dolce.png',
        'Pitted Black Natural Dolce': 'Pitted Black Natural Dolce.png',
        'Pitted Black Natural Kalamata Olives': 'Pitted Black Natural Kalamata Olives.png',
        'Sliced Black Natural Kalamata Olives': 'Sliced Black Natural Kalamata Olives.png',
        'Whole Black Natural Kalamata Olives': 'Whole Black Natural Kalamata Olives.png',
        'Artichoke Hearts': 'Artichoke Hearts .png',
        'Artichoke Quarter': 'Artichoke Quarter .png',
        'Artichoke Bottom': 'Artichoke Bottom jar.png',
      },
      'cans': {
        'Whole Green Olives': 'Whole Green Olives .jpg',
        'Pitted Green Olives': 'Pitted Green Olives .jpg',
        'Sliced Green Olives': 'Sliced Green Olives .jpg',
        'Whole Black Olives': 'Whole Black Olives .jpg',
        'Pitted Black Olives': 'Pitted Black Olives .jpg',
        'Sliced Black Olives': 'Sliced Black Olives .jpg',
        'Cherry Pepper': 'Cherry Pepper.jpg',
        'Habiba Pepper': 'Habiba Peppper.jpg',
        'Kardoula Pepper': 'Kardoula Pepper.jpg',
        'Sliced Green Jalapeno Pepper': 'Sliced Green Jalapeno Pepper.jpg',
        'Sliced Red en Jalapeno Pepper': 'Sliced Red en Jalapeno Pepper.png',
        'Whole Lombardi Pepper': 'Whole Lombardi Pepper.jpg',
        'Mexican Pepper': 'Mexican Pepper.png',
        'Olive Black Natural Dolce': 'Olive Black Natural Dolce can.png',
        'Pitted Black Natural Dolce': 'Pitted Black Natural Dolce can.png',
        'Pitted Black Natural Kalamata Olives': 'Pitted Black Natural Kalamata Olives can.png',
        'Whole Black Natural Kalamata Olives': 'Whole Black Natural Kalamata Olives can.png',
        'Sliced Black Natural Kalamata Olives': 'Sliced Black Natural Kalamata Olives (2).png',
        'Whole Black Natural Picual Olives': 'Whole Black Natural Picual Olives.png',
        'Sliced Black Natural Picual Olives': 'Sliced  Black Natural Picual Olives.png',
        'Sliced Lombardi Pepper': 'Sliced Lombardi Pepper can.png',
        'Pepperoncini Pepper': 'pepperoncini Pepper.png',
        'Macedonian Pepper': 'Macedonian pepper can.png',
        'Artichoke Hearts': 'Artichoke Hearts .jpg',
        'Artichoke Quarter': 'Artichoke Quarter .jpg',
        'Artichoke Bottom': 'Artichoke Bottom can.png',
      },
      'vacuum-bags': {
        'Whole Green Olives': 'Whole Green Olives .jpg',
        'Pitted Green Olives': 'Pitted Green Olives.jpg', // Note: no space
        'Sliced Green Olives': 'Sliced Green Olives .jpg',
        'Whole Black Olives': 'Whole Black Olives .jpg',
        'Pitted Black Olives': 'Pitted Black Olives .jpg',
        'Sliced Black Olives': 'Sliced Black Olives .jpg',
        'Whole Black Natural Kalamata Olives': 'Whole Black Natural Kalamata Olives .jpg',
        'Pitted Black Natural Kalamata Olives': 'Pitted Black Natural Kalamata Olives .jpg',
        'Sliced Black Natural Kalamata Olives': 'Sliced Black Natural Kalamata Olives .jpg',
        'Whole Black Natural Picual Olives': 'Whole Black Natural Picual Olives .jpg',
        'Pitted Black Natural Picual Olives': 'Pitted Black Natural Picual Olives .jpg',
        'Sliced Black Natural Picual Olives': 'Sliced  Black Natural Picual Olives .jpg', // Note: double space
        'Olive Black Natural Dolce': 'Whole Black Natural Dolce.jpg',
        'Pitted Black Natural Dolce': 'Pitted Black Natural Dolce.jpg',
        'Pepperoncini Pepper': 'pepperoncini Pepper.jpg',
        'Cherry Pepper': 'Cherry Pepper.jpg',
        'Kardoula Pepper': 'Kardoula Pepper.jpg',
        'Whole Lombardi Pepper': 'Whole Lombardi Pepper.jpg',
        'Sliced Lombardi Pepper': 'Sliced Lombardi Pepper.jpg',
        'Sliced Green Jalapeno Pepper': 'Sliced Green Jalapeno Pepper.jpg',
        'Sliced Red en Jalapeno Pepper': 'Sliced Red en Jalapeno Pepper.jpg',
        'Habiba Pepper': 'Habiba Peppper.jpg',
        'Mexican Pepper': 'Mexican pepper.jpg',
        'Macedonian Pepper': 'Macedonian pepper.jpg',
        'Artichoke Hearts': 'Artichoke Hearts .jpg',
        'Artichoke Quarter': 'Artichoke Quarter .jpg',
        'Artichoke Bottom': 'Artichoke Bottom.jpg',
      }
    };
    
    // Handle generic packaging types (only one image per type for all products)
    if (currentView === 'plastic-buckets' || currentView === 'barrels' || currentView === 'pet-packs') {
      const folder = folderMap[currentView];
      const genericImages = {
        'plastic-buckets': 'Untitled-14.png',
        'barrels': 'blue.png',
        'pet-packs': 'pet packs.png'
      };
      return `/assets/images/products/${folder}/${genericImages[currentView]}`;
    }
    
    // For specific packaging types, use the mapped image
    const folder = folderMap[currentView];
    const imageMap = imageMapByPackaging[currentView];
    const imageName = imageMap && imageMap[productName];
    
    if (imageName) {
      return `/assets/images/products/${folder}/${imageName}`;
    }
    
    // Fallback: try to find image in another packaging type if current doesn't have it
    for (const [packagingType, images] of Object.entries(imageMapByPackaging)) {
      if (images[productName] && availablePackaging.includes(packagingType)) {
        const fallbackFolder = folderMap[packagingType];
        return `/assets/images/products/${fallbackFolder}/${images[productName]}`;
      }
    }
    
    // Final fallback to a default image
    return '/assets/images/products/GLASS JARS/Whole Green Olives .jpg';
  };

  // All products data
  const allProducts = {
    greenOlives: [
      { key: 'Whole Green Olives', name: t('productsPage.products.wholeGreenOlives'), description: t('productsPage.descriptions.wholeGreenOlives') },
      { key: 'Pitted Green Olives', name: t('productsPage.products.pittedGreenOlives'), description: t('productsPage.descriptions.pittedGreenOlives') },
      { key: 'Sliced Green Olives', name: t('productsPage.products.slicedGreenOlives'), description: t('productsPage.descriptions.slicedGreenOlives') }
    ],
    blackOlives: [
      { key: 'Whole Black Olives', name: t('productsPage.products.wholeBlackOlives'), description: t('productsPage.descriptions.wholeBlackOlives') },
      { key: 'Pitted Black Olives', name: t('productsPage.products.pittedBlackOlives'), description: t('productsPage.descriptions.pittedBlackOlives') },
      { key: 'Sliced Black Olives', name: t('productsPage.products.slicedBlackOlives'), description: t('productsPage.descriptions.slicedBlackOlives') },
      { key: 'Whole Black Natural Kalamata Olives', name: t('productsPage.products.wholeBlackNaturalKalamataOlives'), description: t('productsPage.descriptions.wholeBlackNaturalKalamataOlives') },
      { key: 'Pitted Black Natural Kalamata Olives', name: t('productsPage.products.pittedBlackNaturalKalamataOlives'), description: t('productsPage.descriptions.pittedBlackNaturalKalamataOlives') },
      { key: 'Sliced Black Natural Kalamata Olives', name: t('productsPage.products.slicedBlackNaturalKalamataOlives'), description: t('productsPage.descriptions.slicedBlackNaturalKalamataOlives') },
      { key: 'Whole Black Natural Picual Olives', name: t('productsPage.products.wholeBlackNaturalPicualOlives'), description: t('productsPage.descriptions.wholeBlackNaturalPicualOlives') },
      { key: 'Pitted Black Natural Picual Olives', name: t('productsPage.products.pittedBlackNaturalPicualOlives'), description: t('productsPage.descriptions.pittedBlackNaturalPicualOlives') },
      { key: 'Sliced Black Natural Picual Olives', name: t('productsPage.products.slicedBlackNaturalPicualOlives'), description: t('productsPage.descriptions.slicedBlackNaturalPicualOlives') },
      { key: 'Olive Black Natural Dolce', name: t('productsPage.products.oliveBlackNaturalDolce'), description: t('productsPage.descriptions.oliveBlackNaturalDolce') },
      { key: 'Pitted Black Natural Dolce', name: t('productsPage.products.pittedBlackNaturalDolce'), description: t('productsPage.descriptions.pittedBlackNaturalDolce') }
    ],
    peppers: [
      { key: 'Pepperoncini Pepper', name: t('productsPage.products.pepperonciniPepper'), description: t('productsPage.descriptions.pepperonciniPepper') },
      { key: 'Cherry Pepper', name: t('productsPage.products.cherryPepper'), description: t('productsPage.descriptions.cherryPepper') },
      { key: 'Kardoula Pepper', name: t('productsPage.products.kardoulaPepper'), description: t('productsPage.descriptions.kardoulaPepper') },
      { key: 'Whole Lombardi Pepper', name: t('productsPage.products.wholeLombardiPepper'), description: t('productsPage.descriptions.wholeLombardiPepper') },
      { key: 'Sliced Lombardi Pepper', name: t('productsPage.products.slicedLombardiPepper'), description: t('productsPage.descriptions.slicedLombardiPepper') },
      { key: 'Sliced Green Jalapeno Pepper', name: t('productsPage.products.slicedGreenJalapenoPepper'), description: t('productsPage.descriptions.slicedGreenJalapenoPepper') },
      { key: 'Sliced Red en Jalapeno Pepper', name: t('productsPage.products.slicedRedJalapenoPepper'), description: t('productsPage.descriptions.slicedRedJalapenoPepper') },
      { key: 'Habiba Pepper', name: t('productsPage.products.habibaPepper'), description: t('productsPage.descriptions.habibaPepper') },
      { key: 'Mexican Pepper', name: t('productsPage.products.mexicanPepper'), description: t('productsPage.descriptions.mexicanPepper') },
      { key: 'Macedonian Pepper', name: t('productsPage.products.macedonianPepper'), description: t('productsPage.descriptions.macedonianPepper') }
    ],
    picklesVegetables: [
      { key: 'Artichoke Hearts', name: t('productsPage.products.artichokeHearts'), description: t('productsPage.descriptions.artichokeHearts') },
      { key: 'Artichoke Quarter', name: t('productsPage.products.artichokeQuarter'), description: t('productsPage.descriptions.artichokeQuarter') },
      { key: 'Artichoke Bottom', name: t('productsPage.products.artichokeBottom'), description: t('productsPage.descriptions.artichokeBottom') }
    ]
  };

  // Get ONLY CMS products (database managed)
  const getAllProducts = () => {
    // Convert database products to display format
    const dbConverted = dbProducts.map(p => {
      const gallery = p.gallery_images 
        ? (typeof p.gallery_images === 'string' ? JSON.parse(p.gallery_images) : p.gallery_images)
        : [];
      
      return {
        key: p.slug,
        name: p.name_en,
        name_en: p.name_en,
        name_ar: p.name_ar,
        name_ru: p.name_ru,
        description: p.description_en || p.short_description_en,
        description_en: p.description_en || p.short_description_en,
        description_ar: p.description_ar || p.short_description_ar,
        description_ru: p.description_ru || p.short_description_ru,
        mainImage: p.main_image,  // Glass Jars (default)
        galleryImages: gallery,   // Other packaging types
        isFromDB: true,
        category: p.category,
        // Keep original product for search
        originalProduct: p
      };
    });

    // Filter by category if needed
    if (activeCategory === 'all') {
      return dbConverted;
    } else {
      return dbConverted.filter(p => p.category === activeCategory);
    }
  };

  // Get filtered products for current category
  const getFilteredProducts = () => {
    let products = getAllProducts();

    // Filter by search query with improved accuracy
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      // Split query into individual words for more accurate matching
      const queryWords = query.split(/\s+/).filter(word => word.length > 0);
      
      products = products.filter(product => {
        // Collect all searchable text from product
        const searchableTexts = [
          product.name,
          product.name_en,
          product.name_ar,
          product.name_ru,
          product.key,
          product.description,
          product.description_en,
          product.description_ar,
          product.description_ru,
          // Also search in original product fields if available
          product.originalProduct?.name_en,
          product.originalProduct?.name_ar,
          product.originalProduct?.name_ru,
          product.originalProduct?.slug,
          product.originalProduct?.short_description_en,
          product.originalProduct?.short_description_ar,
          product.originalProduct?.short_description_ru,
        ].filter(Boolean).map(text => text.toLowerCase().trim());
        
        // Create a combined searchable text
        const combinedText = searchableTexts.join(' ');
        
        // If single word query, check for exact matches first, then partial
        if (queryWords.length === 1) {
          const word = queryWords[0];
          // Exact match (highest priority)
          if (searchableTexts.some(text => text === word)) {
            return true;
          }
          // Word boundary match (starts with word)
          if (searchableTexts.some(text => 
            text.startsWith(word) || 
            text.includes(` ${word}`) || 
            text.includes(`${word} `) ||
            text.includes(`-${word}`) ||
            text.includes(`${word}-`)
          )) {
            return true;
          }
          // Partial match (contains word)
          if (combinedText.includes(word)) {
            return true;
          }
        } else {
          // Multi-word query: all words must be found (AND logic)
          const allWordsFound = queryWords.every(word => {
            // Check for exact word match first
            if (searchableTexts.some(text => 
              text === word || 
              text.startsWith(word + ' ') ||
              text.endsWith(' ' + word) ||
              text.includes(' ' + word + ' ') ||
              text.includes('-' + word) ||
              text.includes(word + '-')
            )) {
              return true;
            }
            // Then check for partial match
            return combinedText.includes(word);
          });
          
          if (allWordsFound) {
            return true;
          }
        }
        
        return false;
      });
      
      // Sort results by relevance (exact matches first, then partial matches)
      products.sort((a, b) => {
        const queryLower = query.toLowerCase();
        const aName = (a.name || a.name_en || '').toLowerCase();
        const bName = (b.name || b.name_en || '').toLowerCase();
        
        // Exact match gets highest priority
        const aExact = aName === queryLower || a.key?.toLowerCase() === queryLower;
        const bExact = bName === queryLower || b.key?.toLowerCase() === queryLower;
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        
        // Starts with query gets second priority
        const aStarts = aName.startsWith(queryLower);
        const bStarts = bName.startsWith(queryLower);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        
        // Then by position of match (earlier in string = more relevant)
        const aIndex = aName.indexOf(queryLower);
        const bIndex = bName.indexOf(queryLower);
        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex;
        }
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        
        return 0;
      });
    }

    return products;
  };

  // Get current image for CMS product
  const getCurrentProductImage = (product) => {
    const productKey = product.key;
    const currentView = productViews[productKey] || 'glass-jars';
    
    // If viewing Glass Jars (default), show main image
    if (currentView === 'glass-jars') {
      return product.mainImage;
    }
    
    // Find the gallery image for the selected packaging type
    const galleryImg = product.galleryImages?.find(img => img.type === currentView);
    return galleryImg ? galleryImg.url : product.mainImage;
  };

  // Render packaging buttons for CMS products
  const renderProductPackagingButtons = (product) => {
    const productKey = product.key;
    
    // If no gallery images, don't show buttons
    if (!product.galleryImages || product.galleryImages.length === 0) {
      return null;
    }
    
    const currentView = productViews[productKey] || 'glass-jars';
    
    return (
      <>
        <button
          className={`view-toggle-btn ${currentView === 'glass-jars' ? 'active' : ''}`}
          onClick={() => setProductViews(prev => ({ ...prev, [productKey]: 'glass-jars' }))}
        >
          Glass Jars
        </button>
        {product.galleryImages.map((img, idx) => (
          <button
            key={idx}
            className={`view-toggle-btn ${currentView === img.type ? 'active' : ''}`}
            onClick={() => setProductViews(prev => ({ ...prev, [productKey]: img.type }))}
          >
            {img.label}
          </button>
        ))}
      </>
    );
  };

  // State for PDF viewer
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [currentPDF, setCurrentPDF] = useState(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (pdfBlobUrl) {
        window.URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [pdfBlobUrl]);

  // Render a single product card (SAME STYLE for all products)
  const renderProductCard = (product, index) => {
    const productKey = product.key;
    const productName = product.name;
    const productDesc = product.description;
    
    return (
      <div key={productKey} className="col-xl-3 col-lg-4 col-md-6 col-sm-12">
      <div className="product-card mb-40 wow fadeInUp" data-wow-delay={`${0.1 + index * 0.05}s`}>
        <div className="product-image">
            <img 
              src={getCurrentProductImage(product)} 
              alt={productName} 
            />
        </div>
        <div className="product-info">
          <div className="product-header">
            <h5 className="product-name">{productName}</h5>
            <Link legacyBehavior href={`/specifications?package=${getProductView(productKey)}`}>
              <a className="specs-link">
                <i className="fas fa-info-circle"></i> {t('productsPage.buttons.viewSpecs')}
              </a>
            </Link>
          </div>
          <p className="product-package">{productDesc}</p>
          <div className="product-details">
            <div className="view-toggle-buttons">
                {renderProductPackagingButtons(product)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  };

  return (
    <Layout header={3} footer={3}>
      <PageBanner pageName={t('productsPage.pageTitle')} />
      
      {/*====== Start Catalog Section (Moved to Top) ======*/}
      <section className="catalog-section pt-80 pb-60">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-10 col-lg-12">
              <div className="catalog-wrapper">
                <div className="section-title text-center mb-40 wow fadeInDown">
                  <span className="sub-title">
                    <i className="flaticon-plant" />
                    {t('catalog.title', 'Download Our Product Catalog')}
                  </span>
                  <h2 style={{ fontSize: '28px', marginTop: '10px' }}>
                    {t('catalog.heading', 'Premium Egyptian Olives & Pickles')}
                  </h2>
                </div>
                
                <div className="catalog-cards-wrapper wow fadeInUp">
                  <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-8">
                      <div className="catalog-card unified-card">
                        {/* Language Selector */}
                        <div className="language-selector">
                          <button 
                            className={`language-btn ${selectedLanguage === 'en' ? 'active' : ''}`}
                            onClick={() => setSelectedLanguage('en')}
                          >
                            <span>English</span>
                          </button>
                          <button 
                            className={`language-btn ${selectedLanguage === 'ru' ? 'active' : ''}`}
                            onClick={() => setSelectedLanguage('ru')}
                          >
                            <span>Russian</span>
                          </button>
                        </div>
                        
                        <h4 className="catalog-card-title">
                          {selectedLanguage === 'en' 
                            ? t('catalog.english', 'English Catalog')
                            : t('catalog.russian', 'Russian Catalog')
                          }
                        </h4>
                        
                        <p className="catalog-card-desc">
                          {selectedLanguage === 'en'
                            ? 'Complete product specifications and details'
                            : 'Полная спецификация и детали продукции'
                          }
                        </p>
                        
                        <div className="catalog-card-info">
                          <span><i className="far fa-file-pdf"></i> PDF Format</span>
                          <span><i className="far fa-hdd"></i> {selectedLanguage === 'en' ? '45 MB' : '25 MB'}</span>
                        </div>
                        
                        <div className="catalog-card-actions">
                          <button 
                            className="catalog-btn catalog-btn-view"
                            onClick={async () => {
                              // Use API endpoint that serves files directly from public folder
                              const apiPath = `/api/catalog/${selectedLanguage}`;
                              
                              try {
                                // Fetch PDF as blob for reliable iframe display
                                const response = await fetch(apiPath);
                                if (!response.ok) {
                                  throw new Error('Failed to fetch PDF');
                                }
                                const blob = await response.blob();
                                const blobUrl = window.URL.createObjectURL(blob);
                                
                                setCurrentPDF(apiPath);
                                setPdfBlobUrl(blobUrl);
                                setShowPDFViewer(true);
                              } catch (error) {
                                console.error('Error loading PDF:', error);
                                // Fallback: use API path directly
                                setCurrentPDF(apiPath);
                                setPdfBlobUrl(null);
                                setShowPDFViewer(true);
                              }
                            }}
                          >
                            <i className="far fa-eye"></i> 
                            {selectedLanguage === 'en' ? 'View Catalog' : 'Просмотр каталога'}
                          </button>
                          <button 
                            className="catalog-btn catalog-btn-download"
                            onClick={async () => {
                              // Use API endpoint that serves files directly from public folder
                              const apiPath = `/api/catalog/${selectedLanguage}`;
                              const fileName = selectedLanguage === 'en'
                                ? 'Bello-Food-Catalog-English.pdf'
                                : 'Bello-Food-Catalog-Russian.pdf';
                              
                              try {
                                const response = await fetch(apiPath);
                                if (!response.ok) {
                                  throw new Error('Failed to fetch PDF');
                                }
                                const blob = await response.blob();
                                const url = window.URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = fileName;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                window.URL.revokeObjectURL(url);
                              } catch (error) {
                                console.error('Error downloading PDF:', error);
                                // Fallback: open API endpoint in new tab
                                window.open(apiPath, '_blank');
                              }
                            }}
                          >
                            <i className="far fa-download"></i> 
                            {selectedLanguage === 'en' ? 'Download' : 'Скачать'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*====== End Catalog Section ======*/}

      {/* Main Title Section */}
      <section className="service-section pt-50 pb-40">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="section-title text-center mb-50 wow fadeInDown">
                <span className="sub-title">
                  <i className="flaticon-plant" />
                  {t('productsPage.subtitle')}
                </span>
                <h2>{t('productsPage.title')}</h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs Section */}
      <section className="products-tabs-section pt-50 pb-100">
        <div className="container">
          {/* Category Tabs */}
          <div className="row justify-content-center mb-60">
            <div className="col-lg-12">
              <div className="category-tabs-wrapper">
                <div className="category-tabs">
                  {categories.map((category, index) => (
                    <button
                      key={category.id}
                      className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
                      onClick={() => {
                        setActiveCategory(category.id);
                        setSearchQuery(''); // Clear search when changing category
                      }}
                      data-wow-delay={`${0.1 + index * 0.1}s`}
                    >
                      <div className="category-tab-image">
                        <img 
                          key={`${category.id}-${imageRefreshKey}-${category.image}`}
                          src={category.image} 
                          alt={category.name}
                          style={{
                            display: 'block',
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                          onLoad={() => {
                            console.log(`✅ Image loaded: ${category.id} - ${category.image}`);
                          }}
                          onError={(e) => {
                            console.error(`❌ Image failed to load: ${category.id} - ${category.image}`);
                            // Fallback to default if Supabase image fails
                            const fallback = category.image.split('?')[0];
                            if (e.target.src !== fallback) {
                              e.target.src = fallback;
                            }
                          }}
                        />
                      </div>
                      <span className="tab-name">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="row justify-content-center mb-40">
            <div className="col-lg-6">
              <div className="product-search-wrapper">
                <div className="search-form">
                  <input
                    type="text"
                    className="form-control search-input"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button className="search-btn">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid - Dynamic */}
          <div className="products-content">
            <div className="category-content active">
              {loading ? (
                <div className="row">
                  <div className="col-12 text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                    <p className="mt-3">Loading products...</p>
                  </div>
                </div>
              ) : (
              <div className="row">
                {getFilteredProducts().map((product, index) => renderProductCard(product, index))}
                {getFilteredProducts().length === 0 && (
                  <div className="col-12">
                    <div className="no-products-found text-center py-5">
                      <i className="fas fa-search" style={{fontSize: '4rem', color: '#ccc', marginBottom: '20px'}}></i>
                      <h4>No products found</h4>
                      <p>Try adjusting your search or browse our categories</p>
                    </div>
                  </div>
                )}
              </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* PDF Viewer Modal */}
      {showPDFViewer && (
        <div className="pdf-viewer-modal" onClick={() => {
          // Clean up blob URL when closing
          if (pdfBlobUrl) {
            window.URL.revokeObjectURL(pdfBlobUrl);
            setPdfBlobUrl(null);
          }
          setShowPDFViewer(false);
        }}>
          <div className="pdf-viewer-content" onClick={(e) => e.stopPropagation()}>
            <div className="pdf-viewer-header">
              <h3><i className="far fa-file-pdf"></i> Product Catalog</h3>
              <button className="pdf-close-btn" onClick={() => {
                // Clean up blob URL when closing
                if (pdfBlobUrl) {
                  window.URL.revokeObjectURL(pdfBlobUrl);
                  setPdfBlobUrl(null);
                }
                setShowPDFViewer(false);
              }}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="pdf-viewer-body">
              <iframe
                src={pdfBlobUrl || currentPDF}
                width="100%"
                height="100%"
                style={{ border: 'none' }}
                title="PDF Viewer"
              />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .catalog-card {
          background: white;
          border-radius: 16px;
          padding: 35px 30px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
          text-align: center;
          height: 100%;
          border: 2px solid transparent;
        }

        .catalog-card.unified-card {
          padding: 25px 25px;
        }

        .catalog-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(90, 114, 73, 0.12);
          border-color: #5a7249;
        }

        .language-selector {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #f0f0f0;
        }

        .language-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 20px;
          background: #f8f9fa;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
          font-weight: 600;
          color: #666;
        }

        .language-btn:hover {
          background: #e9ecef;
          border-color: #5a7249;
          transform: translateY(-2px);
        }

        .language-btn.active {
          background: linear-gradient(135deg, #5a7249 0%, #4a6039 100%);
          border-color: #5a7249;
          color: white;
          box-shadow: 0 3px 10px rgba(90, 114, 73, 0.25);
        }


        .catalog-card-title {
          font-size: 18px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 8px;
        }

        .catalog-card-desc {
          font-size: 13px;
          color: #666;
          margin-bottom: 15px;
          min-height: 35px;
        }

        .catalog-card-info {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-bottom: 18px;
          padding: 12px 0;
          border-top: 1px solid #f0f0f0;
          border-bottom: 1px solid #f0f0f0;
        }

        .catalog-card-info span {
          font-size: 12px;
          color: #888;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .catalog-card-info i {
          color: #5a7249;
          font-size: 14px;
        }

        .catalog-card-actions {
          display: flex;
          gap: 8px;
          justify-content: center;
        }

        .catalog-btn {
          flex: 1;
          padding: 10px 16px;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .catalog-btn-view {
          background: #5a7249;
          color: white;
        }

        .catalog-btn-view:hover {
          background: #4a6039;
          transform: scale(1.05);
        }

        .catalog-btn-download {
          background: #f8f9fa;
          color: #5a7249;
          border: 2px solid #5a7249;
        }

        .catalog-btn-download:hover {
          background: #5a7249;
          color: white;
          transform: scale(1.05);
        }

        /* PDF Viewer Modal */
        .pdf-viewer-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .pdf-viewer-content {
          background: white;
          border-radius: 12px;
          width: 100%;
          max-width: 1200px;
          height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .pdf-viewer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 25px;
          border-bottom: 2px solid #f0f0f0;
          background: linear-gradient(135deg, #5a7249 0%, #4a6039 100%);
          border-radius: 12px 12px 0 0;
        }

        .pdf-viewer-header h3 {
          margin: 0;
          font-size: 20px;
          font-weight: 700;
          color: white;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .pdf-close-btn {
          background: rgba(255,255,255,0.2);
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 18px;
          transition: all 0.3s ease;
        }

        .pdf-close-btn:hover {
          background: rgba(255,255,255,0.3);
          transform: rotate(90deg);
        }

        .pdf-viewer-body {
          flex: 1;
          padding: 0;
          overflow: hidden;
        }

        .pdf-viewer-body iframe {
          width: 100%;
          height: 100%;
        }

        .category-tabs {
          display: flex;
          justify-content: center;
          gap: 15px;
          flex-wrap: nowrap;
        }

        .category-tab {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          padding: 20px;
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 180px;
          flex-shrink: 0;
        }

        .category-tab:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(90, 114, 73, 0.15);
          border-color: #5a7249;
        }

        .category-tab.active {
          background: linear-gradient(135deg, #5a7249 0%, #4a6039 100%);
          border-color: #5a7249;
          box-shadow: 0 8px 25px rgba(90, 114, 73, 0.3);
        }

        .category-tab.active .tab-name {
          color: white;
        }

        .category-tab-image {
          width: 120px;
          height: 120px;
          border-radius: 12px;
          overflow: hidden;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(0,0,0,0.12);
          transition: all 0.3s ease;
        }

        .category-tab.active .category-tab-image {
          box-shadow: 0 8px 20px rgba(255,255,255,0.4);
          transform: scale(1.05);
        }

        .category-tab-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .tab-name {
          font-size: 15px;
          font-weight: 600;
          color: #333;
          transition: color 0.3s ease;
          text-align: center;
        }

        @media (max-width: 768px) {
          .catalog-card {
            padding: 20px 15px;
          }

          .catalog-card.unified-card {
            padding: 20px 15px;
          }

          .language-selector {
            flex-direction: column;
            gap: 8px;
            margin-bottom: 15px;
            padding-bottom: 12px;
          }

          .language-btn {
            width: 100%;
            justify-content: center;
            padding: 8px 16px;
            font-size: 13px;
          }

          .catalog-card-actions {
            flex-direction: column;
          }

          .catalog-btn {
            width: 100%;
            padding: 10px 14px;
            font-size: 12px;
          }

          .catalog-card-title {
            font-size: 16px;
          }

          .catalog-card-desc {
            font-size: 12px;
          }

          .pdf-viewer-content {
            height: 85vh;
          }

          .pdf-viewer-header h3 {
            font-size: 16px;
          }

          .category-tabs {
            gap: 10px;
            flex-wrap: wrap;
            justify-content: center;
          }

          .category-tab {
            min-width: 140px;
            padding: 15px;
            flex-shrink: 0;
          }

          .category-tab-image {
            width: 90px;
            height: 90px;
            border-radius: 10px;
          }

          .tab-name {
            font-size: 13px;
          }
        }
      `}</style>

    </Layout>
  );
};

export async function getStaticProps({ locale }) {
  const { serverSideTranslations } = await import('next-i18next/serverSideTranslations');
  
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}

export default Products;
