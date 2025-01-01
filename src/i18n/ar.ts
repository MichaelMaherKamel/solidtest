export const arDict = {
  common: {
    loading: 'جاري التحميل...',
    error: 'حدث خطأ',
    save: 'حفظ',
    cancel: 'إلغاء',
    search: 'بحث...',
    product: 'منتج',
    products: 'منتجات',
    total: 'الإجمالي',
    success: 'نجاح',
    loadMore: 'تحميل المزيد',
    noProductsFound: 'لا توجد منتجات في هذه الفئة',
  },

  auth: {
    title: 'مرحباً بك في سوق الرفايع',
    subtitle: 'سجل دخول لمواصلة التسوق',
    signIn: 'تسجيل الدخول',
    signOut: 'تسجيل الخروج',
    signOutError: 'حدث خطأ أثناء تسجيل الخروج. حاول مرة أخرى.',
    googleButton: 'المتابعة باستخدام Google',
    facebookButton: 'المتابعة باستخدام Facebook',
    error: 'تعذر تسجيل الدخول في الوقت الحالي. يرجى المحاولة مرة أخرى.',
  },

  nav: {
    home: 'الرئيسية',
    about: 'مين إحنا',
    stores: 'المتاجر',
    gallery: 'المعرض',
    admin: 'الإدارة',
    products: 'المنتجات',
    seller: 'البائع',
    account: 'حسابي',
    userMenu: 'قائمة المستخدم',
  },

  hero: {
    title: 'أهلاً بيك في سوق الرفايع',
    subtitle: 'كل اللي بيتك محتاجه في مكان واحد',
    cta: 'اتسوق دلوقتي',
    imageAlt: 'صورة الصفحة الرئيسية',
  },

  sections: {
    categories: 'الأقسام',
    featuredStores: 'المتاجر المميزة',
    contact: 'اتصل بنا',
  },

  categories: {
    kitchensupplies: 'مستلزمات المطبخ', // Full name
    bathroomsupplies: 'مستلزمات الحمام',
    homesupplies: 'مستلزمات المنزل',
    // Short names for tabs
    tabNames: {
      kitchensupplies: 'المطبخ',
      bathroomsupplies: 'الحمام',
      homesupplies: 'المنزل',
    },
  },

  pagination: {
    previous: 'السابق',
    next: 'التالي',
    page: 'صفحة',
    of: 'من',
  },

  stores: {
    kitchen: 'جنة المطبخ',
    kitchenDesc: 'معدات وإكسسوارات مطبخ فاخرة',
    bath: 'الحمام وما بعده',
    bathDesc: 'مستلزمات الحمام الفاخرة',
    home: 'راحة المنزل',
    homeDesc: 'كل ما تحتاجه لحياة مريحة',
  },

  form: {
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    message: 'الرسالة',
    namePlaceholder: 'اسمك',
    emailPlaceholder: 'بريدك@الالكتروني.com',
    messagePlaceholder: 'كيف يمكننا مساعدتك؟',
    submit: 'إرسال الرسالة',
  },

  footer: {
    tagline: 'وجهتك للحصول على مستلزمات منزلية عالية الجودة',
    quickLinks: 'روابط سريعة',
    email: 'البريد الإلكتروني',
    phone: 'الهاتف',
    copyright: '© {{year}} سوق الرفايع. جميع الحقوق محفوظة',
    terms: 'الشروط',
    companyInfo: '© {{year}} تشغيل بواسطة وارك ميز',
  },

  seller: {
    layout: {
      storeOverview: 'نظرة عامة على متجرك',
      dashboard: 'لوحة التحكم',
      products: 'المنتجات',
      orders: 'الطلبات',
      settings: 'الإعدادات',
      unauthorized: 'يجب أن تكون بائعاً للوصول إلى هذه الصفحة',
      noProducts: 'لا توجد منتجات',
    },

    sidebar: {
      storeName: 'سوق الرفايع',
      storeNameEn: 'Souq El Rafay3',
      mainMenu: 'القائمة الرئيسية',
      overview: 'نظرة عامة',
      dashboard: 'لوحة التحكم',
      products: 'المنتجات',
      orders: 'الطلبات',
      settings: 'الإعدادات',
      logout: 'تسجيل الخروج',
    },

    dashboard: {
      title: 'لوحة التحكم',
      subtitle: 'نظرة عامة على متجرك',
      stats: {
        totalSales: 'إجمالي المبيعات',
        totalOrders: 'إجمالي الطلبات',
        totalProducts: 'إجمالي المنتجات',
        totalRevenue: 'إجمالي الإيرادات',
        noData: 'لا توجد بيانات متاحة',
      },
      charts: {
        salesOverTime: 'المبيعات عبر الزمن',
        topProducts: 'المنتجات الأكثر مبيعاً',
        revenueByCategory: 'الإيرادات حسب الفئة',
        inventoryLevels: 'مستويات المخزون',
        orderStatus: 'حالة الطلبات',
      },
    },

    products: {
      title: 'المنتجات',
      subtitle: 'إدارة منتجات متجرك',
      addProduct: 'إضافة منتج',
      confirmDelete: 'هل أنت متأكد من حذف هذا المنتج؟',

      table: {
        name: 'اسم المنتج',
        description: 'الوصف',
        category: 'الفئة',
        price: 'السعر',
        inventory: 'المخزون',
        actions: 'الإجراءات',
        color: {
          inventory: '{color}: {count}',
          inStock: 'متوفر',
          outOfStock: 'غير متوفر',
        },
      },

      colorVariants: {
        title: 'ألوان المنتج',
        add: 'إضافة لون جديد',
        edit: 'تعديل اللون',
        color: 'اللون',
        images: 'الصور (حتى 5)',
        setDefault: 'تعيين كلون اساسى',
        dropImages: 'اسحب الصور هنا',
        clickOrDrag: 'انقر أو اسحب الصور',
        imagesUploaded: 'صور تم رفعها',
        fileTypes: 'PNG, JPG, GIF حتى {{size}} ميجابايت',
        uploading: 'جاري رفع الصورة...',
        remove: 'حذف الصورة',
        preview: 'معاينة الصورة',
        noImages: 'لم يتم رفع أي صور',
        uploadText: 'انقر أو اسحب الصور',
        uploadStatus: '{current} / {max} صور تم رفعها',
        maxSize: 'حتى {size} ميجابايت',
      },

      form: {
        errors: {
          required: 'الحقول المطلوبة مفقودة',
          invalidFormat: 'تنسيق ألوان غير صالح',
          createFailed: 'فشل في إنشاء المنتج',
          updateFailed: 'فشل في تحديث المنتج',
          deleteFailed: 'فشل في حذف المنتج',
          imageRequired: 'مطلوب صورة واحدة على الأقل',
          invalidPrice: 'يجب أن يكون السعر أكبر من 0',
        },
        success: {
          created: 'تم إنشاء المنتج بنجاح',
          updated: 'تم تحديث المنتج بنجاح',
          deleted: 'تم حذف المنتج بنجاح',
        },
        placeholders: {
          name: 'أدخل اسم المنتج',
          description: 'أدخل وصف المنتج',
          price: 'أدخل السعر',
          selectCategory: 'اختر الفئة',
        },
        buttons: {
          creating: 'جاري الإنشاء...',
          updating: 'جاري التحديث...',
          create: 'إنشاء منتج',
          update: 'تحديث المنتج',
          edit: 'تعديل المنتج',
          delete: 'حذف المنتج',
          cancel: 'إلغاء',
        },
        labels: {
          productName: 'اسم المنتج',
          productDescription: 'وصف المنتج',
          category: 'الفئة',
          price: 'السعر',
          colors: 'الألوان',
          inventory: 'المخزون',
        },
      },
    },

    orders: {
      title: 'الطلبات',
      subtitle: 'إدارة طلبات متجرك',
      table: {
        orderId: 'رقم الطلب',
        customer: 'العميل',
        date: 'التاريخ',
        status: 'الحالة',
        total: 'الإجمالي',
        actions: 'الإجراءات',
      },
      status: {
        pending: 'قيد الانتظار',
        processing: 'قيد المعالجة',
        shipped: 'تم الشحن',
        delivered: 'تم التسليم',
        cancelled: 'ملغي',
      },
    },

    settings: {
      title: 'إعدادات المتجر',
      subtitle: 'إدارة معلومات متجرك',
      storeInfo: {
        name: 'اسم المتجر',
        image: 'صورة المتجر',
        phone: 'رقم الهاتف',
        address: 'العنوان',
        subscription: 'نوع الاشتراك',
        featured: 'متجر مميز',
      },
      save: 'حفظ التغييرات',
      cancel: 'إلغاء',
    },
  },
}
