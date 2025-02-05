const cities = {
  Cairo: 'Cairo',
  Alexandria: 'Alexandria',
  Giza: 'Giza',
  ShubraElKheima: 'Shubra El Kheima',
  PortSaid: 'Port Said',
  Suez: 'Suez',
  Luxor: 'Luxor',
  Mansoura: 'Mansoura',
  ElMahallaElKubra: 'El-Mahalla El-Kubra',
  Tanta: 'Tanta',
  Asyut: 'Asyut',
  Ismailia: 'Ismailia',
  Faiyum: 'Faiyum',
  Zagazig: 'Zagazig',
  Damietta: 'Damietta',
  Aswan: 'Aswan',
  Minya: 'Minya',
  Damanhur: 'Damanhur',
  BeniSuef: 'Beni Suef',
  Hurghada: 'Hurghada',
}

const colors = {
  red: 'Red',
  blue: 'Blue',
  green: 'Green',
  yellow: 'Yellow',
  orange: 'Orange',
  purple: 'Purple',
  pink: 'Pink',
  white: 'White',
  black: 'Black',
  gray: 'Gray',
  brown: 'Brown',
  gold: 'Gold',
  silver: 'Silver',
  beige: 'Beige',
  navy: 'Navy',
  turquoise: 'Turquoise',
  olive: 'Olive',
  indigo: 'Indigo',
  peach: 'Peach',
  lavender: 'Lavender',
}

export const enDict = {
  common: {
    loading: 'Loading...',
    error: 'An error occurred',
    save: 'Save',
    saving: 'Saving...',
    cancel: 'Cancel',
    search: 'Search...',
    product: 'product',
    products: 'products',
    total: 'total',
    success: 'Success',
    loadMore: 'Load More',
    noProductsFound: 'No products found in this category',
    goToHome: 'Go to Home Page',
    backToOrders: 'Back to Orders',
    update: 'Update',
    updating: 'Updating...',
    actions: 'Actions',
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
    calculatedAtCheckout: 'Calculated at checkout',
    currency: '${value}',
    color: 'Color: {color}',
    errorMsg: 'Sorry, an error occurred. Please try again.',
  },

  checkout: {
    secureCheckout: 'Secure Checkout',
    pageHeader: 'Checkout',
    quantity: 'Quantity',
    businessDays: 'business days',
    steps: {
      cart: 'Shopping Cart',
      shipping: 'Delivery Address',
      payment: 'Payment Method',
      confirmation: 'Order Confirmation',
    },
    buttons: {
      checkoutAddress: 'Continue to Delivery Address',
      backToCart: 'Back to Shopping Cart',
      proceedToPayment: 'Select Payment Method',
      backToAddress: 'Back to Delivery Address',
      reviewOrder: 'Review Your Order',
      editPayment: 'Edit Payment Method',
    },
    payment: {
      status: {
        pending: 'Payment Pending',
        processing: 'Processing Payment',
        completed: 'Payment Completed',
        failed: 'Payment Failed',
        refunded: 'Refunded',
        paid: 'Paid',
      },
      error: {
        noPendingOrder: 'No pending order found. Please try again.',
        description: 'An error occurred while processing your payment. Please try again.',
      },
      paymentMethod: 'Payment Method',
    },
    cashOnDelivery: 'Cash on Delivery',
    payByFawry: 'Pay with Fawry',
    cashOnDeliveryDescription: 'Pay cash when your order arrives',
    fawryDescription: 'Pay securely using Fawry Pay service',
    orderReview: {
      title: 'Order Review & Confirmation',
      subtitle: 'Please review your order details',
      items: 'Items in Your Order',
      deliveryDetails: 'Delivery Details',
      subtotal: 'Items Subtotal',
      shippingCost: 'Delivery Cost',
      total: 'Order Total',
      deliveryAddress: 'Delivery Address',
      contactInfo: 'Contact Information',
      buttons: {
        confirmCod: 'Confirm Order & Pay on Delivery',
        confirmFawry: 'Confirm Order & Pay with Fawry',
        editOrder: 'Edit Order',
        editDelivery: 'Edit Delivery Address',
        editPayment: 'Edit Payment Method',
      },
    },
    order: {
      success: {
        title: 'Order Placed',
        description: 'Your order has been placed successfully.',
      },
      error: {
        title: 'Order Failed',
        description: 'There was an error placing your order. Please try again.',
      },
    },
  },
  address: {
    title: 'Shipping Address',
    notFound: 'No delivery address found',
    form: {
      name: 'Name',
      email: 'Email Address',
      phone: 'Phone Number',
      address: 'Street Address',
      apartment: 'Apartment, Suite, etc. (optional)',
      buildingNumber: 'Building',
      floorNumber: 'Floor',
      flatNumber: 'Flat',
      city: 'City',
      district: 'District',
      zipCode: 'ZIP/Postal Code',
      country: 'Country',
      edit: 'Edit Address',
    },
    placeholders: {
      name: 'Enter your name',
      email: 'Enter your email address',
      phone: 'Enter your phone number',
      address: 'Enter your street address',
      apartment: 'Apartment, Suite, Unit, etc.',
      buildingNumber: 'Enter building number',
      floorNumber: 'Enter floor number',
      flatNumber: 'Enter flat number',
      city: 'Select your city',
      district: 'Enter your district',
      zipCode: 'Enter postal code',
    },
    validation: {
      required: 'This field is required',
      invalidEmail: 'Please enter a valid email address',
      invalidPhone: 'Please enter a valid phone number',
      invalidZip: 'Please enter a valid postal code',
    },
    city: {
      label: 'City',
      placeholder: 'Select City',
      ...cities,
    },
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
    kitchensupplies: 'Kitchen Supplies',
    bathroomsupplies: 'Bathroom Supplies',
    homesupplies: 'Home Supplies',
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
    adjustedCart: {
      line1: 'Only {{max}} available. You have {{existing}} in cart',
      line2: 'Added {{added}}',
    },
    addToWishlist: 'Add to Wishlist',
    share: 'Share Product',
    brand: 'Brand',
    rating: 'Rating',
    discount: 'OFF',
    totalInventory: 'Total Inventory',
    category: 'Category',
    store: 'Store',
    availableIn: 'Available in {color}',
    colors: {
      title: 'Available Colors',
      ...colors,
    },
  },

  stores: {
    kitchen: 'Kitchen Supplies',
    kitchenDesc: 'Premium kitchen equipment and accessories',
    bath: 'Bath & Beyond',
    bathDesc: 'Luxury bathroom essentials',
    home: 'Home Comfort',
    homeDesc: 'Everything for your comfortable living',
    viewStore: 'View Store',
    storeProducts: 'Store Products',
    followStore: 'Follow Store',
    contactStore: 'Contact Store',
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
      noStore: 'No store found. Please contact the admin to create a store.',
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
        variants: 'variants',
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
          edited: 'Product has been edited successfully',
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
        refunded: 'Refunded',
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

  order: {
    details: {
      title: 'Order Details',
      orderNumber: 'Order Number',
    },
    number: 'Order Number',
    items: {
      title: 'Order Items',
    },
    notFound: {
      title: 'Order Not Found',
      description: "We couldn't find the order you're looking for...",
      viewAllOrders: 'View All Orders',
    },
    status: {
      pending: 'Pending',
      processing: 'Processing',
      confirmed: 'Confirmed',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      refunded: 'Refunded',
      label: 'Status',
    },
    search: {
      title: 'Track Your Order',
      orderNumber: 'Order Number',
      placeholder: 'Enter your order number',
      search: 'Search Order',
      searching: 'Searching...',
      enterOrderNumber: 'Please enter an order number',
      notFound: 'No order found with this number',
      error: 'An error occurred while searching for the order',
      description: 'Enter your order number to track your order status',
    },
    storeOrderStatus: 'Order Status',
    updateStatus: 'Update Order Status',
    paymentMethod: {
      card: 'Pay with Fawry',
      cash: 'Cash on Delivery',
      paymentMethod: 'Payment Method',
    },
    seller: {
      title: 'Orders',
      subtitle: 'Manage your store orders',
      searchPlaceholder: 'Search orders...',
      noOrders: 'No orders found for this store.',
      statusUpdateSuccess: 'Order status updated successfully.',
      statusUpdateError: 'Failed to update order status.',
      customer: 'Customer',
      total: 'Total',
      date: 'Date',
      pluralKeys: {
        0: 'No orders',
        1: '1 order',
        other: '{{count}} orders',
      },
    },
  },
  payment: {
    status: {
      pending: 'Payment Pending',
      processing: 'Processing Payment',
      completed: 'Payment Completed',
      failed: 'Payment Failed',
      refunded: 'Refunded',
    },
  },
}
