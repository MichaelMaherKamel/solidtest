export const enDict = {
  common: {
    loading: 'Loading...',
    error: 'An error occurred',
    save: 'Save',
    cancel: 'Cancel',
    search: 'Search...',
    product: 'product',
    products: 'products',
    total: 'total',
    success: 'Success',
    loadMore: 'Load More',
    noProductsFound: 'No products found in this category',
  },

  auth: {
    title: 'Welcome to Souq El Rafay3',
    subtitle: 'Sign in to continue shopping',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    signOutError: 'Error signing out. Please try again.',
    googleButton: 'Continue with Google',
    facebookButton: 'Continue with Facebook',
    error: 'Unable to sign in at the moment. Please try again.',
  },

  nav: {
    home: 'Home',
    about: 'About',
    stores: 'Stores',
    gallery: 'Gallery',
    admin: 'Admin',
    products: 'Products',
    seller: 'Seller',
    account: 'My Account',
    userMenu: 'User Menu',
  },

  cart: {
    title: 'Shopping Cart',
    empty: 'Your cart is empty',
    emptyTitle: 'Your Cart is Empty',
    emptyMessage: 'Start shopping to add items to your cart',
    continueShopping: 'Continue Shopping',
    quantity: 'Quantity',
    total: 'Total',
    items: 'items',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    checkout: 'Checkout',
    remove: 'Remove',
    clear: 'Clear Cart',
    increase: 'Increase quantity',
    decrease: 'Decrease quantity',
    loading: 'Updating cart...',
    error: 'Error updating cart',
    confirmClear: 'Are you sure you want to clear your cart?',
    currency: '${value}', // Used for price formatting
  },

  checkout: {
    errors: {
      updateQuantity: 'Failed to update quantity',
      removeItem: 'Failed to remove item',
      address: 'Failed to save address',
      noAddress: 'Please select or add a delivery address',
      noPayment: 'Please select a payment method',
      general: 'An error occurred during checkout',
    },
    paymentDetails: {
      cod: 'Pay when your order arrives',
      card: 'Secure online payment',
    },
    cardPaymentNote: 'You will be redirected to a secure payment gateway to complete your transaction',
    delivery: {
      estimatedDate: 'Estimated delivery by {date}',
      method: 'Delivery Method',
      select: 'Select delivery method',
      standard: 'Standard Delivery (3-5 days)',
      express: 'Express Delivery (1-2 days)',
      sameDay: 'Same Day Delivery',
      days: '{days} days',
      today: 'Today',
      information: 'Delivery Information',
      fee: 'Delivery Fee'
    }
  },
  
  address: {
    namePlaceholder: 'Enter your full name',
    emailPlaceholder: 'Enter your email',
    phonePlaceholder: 'Enter your phone number',
    districtPlaceholder: 'Enter your district',
    streetAddressPlaceholder: 'Enter your street address'
  },

  hero: {
    title: 'Welcome to Souq El Rafay3',
    subtitle: 'Everything your home needs in one place',
    cta: 'Shop Now',
    imageAlt: 'Hero Background Image',
  },

  sections: {
    categories: 'Categories',
    featuredStores: 'Featured Stores',
    contact: 'Contact Us',
  },

  categories: {
    kitchensupplies: 'Kitchen Supplies', // Full name
    bathroomsupplies: 'Bathroom Supplies',
    homesupplies: 'Home Supplies',
    // Short names for tabs
    tabNames: {
      kitchensupplies: 'Kitchen',
      bathroomsupplies: 'Bathroom',
      homesupplies: 'Home',
    },
  },

  pagination: {
    previous: 'Previous',
    next: 'Next',
    page: 'Page',
    of: 'of',
  },

  product: {
    inStock: '{{count}} in stock',
    outOfStock: 'Out of stock',
    addToCart: 'Add to Cart',
    addedToCart: 'Added to Cart',
    addToWishlist: 'Add to Wishlist',
    share: 'Share Product',
    brand: 'Brand',
    rating: 'Rating',
    discount: 'OFF',
  },

  stores: {
    kitchen: 'Kitchen Paradise',
    kitchenDesc: 'Premium kitchen equipment and accessories',
    bath: 'Bath & Beyond',
    bathDesc: 'Luxury bathroom essentials',
    home: 'Home Comfort',
    homeDesc: 'Everything for your comfortable living',
  },

  form: {
    name: 'Name',
    email: 'Email',
    message: 'Message',
    namePlaceholder: 'Your name',
    emailPlaceholder: 'your@email.com',
    messagePlaceholder: 'How can we help?',
    submit: 'Send Message',
  },

  footer: {
    tagline: 'Your destination for quality home essentials',
    quickLinks: 'Quick Links',
    email: 'Email',
    phone: 'Phone',
    copyright: '© {{year}} Souq El Rafay3. All rights reserved.',
    terms: 'Terms',
    companyInfo: '© {{year}} Operated by Wark Maze',
  },

  seller: {
    layout: {
      storeOverview: 'Store Overview',
      dashboard: 'Dashboard',
      products: 'Products',
      orders: 'Orders',
      settings: 'Settings',
      unauthorized: 'You must be a seller to access this page',
      noProducts: 'No products found',
    },

    sidebar: {
      storeName: 'Souq El Rafay3',
      storeNameEn: 'Souq El Rafay3',
      mainMenu: 'Main Menu',
      overview: 'Overview',
      dashboard: 'Dashboard',
      products: 'Products',
      orders: 'Orders',
      settings: 'Settings',
      logout: 'Logout',
    },

    dashboard: {
      title: 'Dashboard',
      subtitle: 'Overview of your store',
      stats: {
        totalSales: 'Total Sales',
        totalOrders: 'Total Orders',
        totalProducts: 'Total Products',
        totalRevenue: 'Total Revenue',
        noData: 'No data available',
      },
      charts: {
        salesOverTime: 'Sales Over Time',
        topProducts: 'Top Selling Products',
        revenueByCategory: 'Revenue by Category',
        inventoryLevels: 'Inventory Levels',
        orderStatus: 'Order Status',
      },
    },

    products: {
      title: 'Products',
      subtitle: 'Manage your store products',
      addProduct: 'Add Product',
      confirmDelete: 'Are you sure you want to delete this product?',

      table: {
        name: 'Product Name',
        description: 'Description',
        category: 'Category',
        price: 'Price',
        inventory: 'Inventory',
        actions: 'Actions',
        color: {
          inventory: '{color}: {count}',
          inStock: 'in stock',
          outOfStock: 'out of stock',
        },
      },

      colorVariants: {
        title: 'Color Variants',
        add: 'Add Color Variant',
        edit: 'Edit Color Variant',
        color: 'Color',
        images: 'Images (Up to 5)',
        setDefault: 'Set as default color',
        dropImages: 'Drop images here',
        clickOrDrag: 'Click or drag images',
        imagesUploaded: 'images uploaded',
        fileTypes: 'PNG, JPG, GIF up to {{size}}MB',
        uploading: 'Uploading image...',
        remove: 'Remove image',
        preview: 'Image Preview',
        noImages: 'No images uploaded',
        uploadText: 'Click or drag images',
        uploadStatus: '{current} / {max} images uploaded',
        maxSize: 'Up to {size}MB',
      },

      form: {
        errors: {
          required: 'Required fields are missing',
          invalidFormat: 'Invalid color variants format',
          createFailed: 'Failed to create product',
          updateFailed: 'Failed to update product',
          deleteFailed: 'Failed to delete product',
          imageRequired: 'At least one image is required',
          invalidPrice: 'Price must be greater than 0',
        },
        success: {
          created: 'Product has been created successfully',
          updated: 'Product has been updated successfully',
          deleted: 'Product has been deleted successfully',
        },
        placeholders: {
          name: 'Enter product name',
          description: 'Enter product description',
          price: 'Enter price',
          selectCategory: 'Select category',
        },
        buttons: {
          creating: 'Creating...',
          updating: 'Updating...',
          create: 'Create Product',
          update: 'Update Product',
          edit: 'Edit Product',
          delete: 'Delete Product',
          cancel: 'Cancel',
        },
        labels: {
          productName: 'Product Name',
          productDescription: 'Product Description',
          category: 'Category',
          price: 'Price',
          colors: 'Colors',
          inventory: 'Inventory',
        },
      },
    },

    orders: {
      title: 'Orders',
      subtitle: 'Manage your store orders',
      table: {
        orderId: 'Order ID',
        customer: 'Customer',
        date: 'Date',
        status: 'Status',
        total: 'Total',
        actions: 'Actions',
      },
      status: {
        pending: 'Pending',
        processing: 'Processing',
        shipped: 'Shipped',
        delivered: 'Delivered',
        cancelled: 'Cancelled',
      },
    },

    settings: {
      title: 'Store Settings',
      subtitle: 'Manage your store information',
      storeInfo: {
        name: 'Store Name',
        image: 'Store Image',
        phone: 'Phone Number',
        address: 'Address',
        subscription: 'Subscription Plan',
        featured: 'Featured Store',
      },
      save: 'Save Changes',
      cancel: 'Cancel',
    },
  },
}
