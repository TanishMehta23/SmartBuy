import {
  LayoutGrid,
  Apple,
  Wheat,
  Milk,
  Wine,
  Cookie,
  Snowflake,
  Fish,
  ShoppingBasket,
  Sparkles,
  Home,
  Package,
  Heart,
  Droplet,
  Coffee,
  Smile,
} from 'lucide-react';

/**
 * Intelligent helper to resolve the appropriate Lucide icon for any category name
 * using exact matching, normalized keyword detection, and safe fallback.
 */
export const getCategoryIcon = (categoryName = '') => {
  if (!categoryName) return Package;
  const name = categoryName.trim();
  const lower = name.toLowerCase();

  // 1. All products special handler
  if (lower === 'all' || lower.includes('all products') || lower.includes('todos os produtos')) {
    return LayoutGrid;
  }

  // 2. Bathroom & Personal Hygiene
  if (lower.includes('bath') || lower.includes('banho') || lower.includes('hygiene') || lower.includes('higiene') || lower.includes('soap') || lower.includes('shower')) {
    return Droplet;
  }

  // 3. Makeup & Beauty & Cosmetics & Skincare
  if (lower.includes('makeup') || lower.includes('make-up') || lower.includes('maquilhagem') || lower.includes('beauty') || lower.includes('beleza') || lower.includes('cosmetic') || lower.includes('skin')) {
    return Sparkles;
  }

  // 4. Eatables & Pantry & Groceries
  if (lower.includes('eatable') || lower.includes('pantry') || lower.includes('despensa') || lower.includes('grocery') || lower.includes('mercearia')) {
    return ShoppingBasket;
  }

  // 5. Fresh Fruits
  if (lower.includes('fruit') || lower.includes('fruta') || lower.includes('apple') || lower.includes('maçã')) {
    return Apple;
  }

  // 6. Fresh Vegetables & Greens
  if (lower.includes('vegetable') || lower.includes('legume') || lower.includes('hortali') || lower.includes('verdura')) {
    return ShoppingBasket;
  }

  // 7. Bakery & Pastry & Bread
  if (lower.includes('baker') || lower.includes('padaria') || lower.includes('bread') || lower.includes('pão') || lower.includes('pastelaria')) {
    return Wheat;
  }

  // 8. Dairy, Milk, Cheese & Eggs
  if (lower.includes('dair') || lower.includes('latic') || lower.includes('milk') || lower.includes('leite') || lower.includes('queijo') || lower.includes('cheese') || lower.includes('egg') || lower.includes('ovo')) {
    return Milk;
  }

  // 9. Drinks, Beverages, Wine, Coffee, Juices
  if (lower.includes('drink') || lower.includes('beverage') || lower.includes('bebida') || lower.includes('wine') || lower.includes('vinho') || lower.includes('juice') || lower.includes('sumo') || lower.includes('water') || lower.includes('água')) {
    return Wine;
  }

  // 10. Snacks, Sweets, Biscuits, Chocolates
  if (lower.includes('snack') || lower.includes('sweet') || lower.includes('doce') || lower.includes('chocolate') || lower.includes('cookie') || lower.includes('bolacha') || lower.includes('biscuit') || lower.includes('chips')) {
    return Cookie;
  }

  // 11. Household & Cleaning & Home
  if (lower.includes('house') || lower.includes('clean') || lower.includes('limpeza') || lower.includes('casa') || lower.includes('lar') || lower.includes('home')) {
    return Home;
  }

  // 12. Seafood & Fish
  if (lower.includes('fish') || lower.includes('seafood') || lower.includes('peixe') || lower.includes('marisco')) {
    return Fish;
  }

  // 13. Frozen
  if (lower.includes('frozen') || lower.includes('congelado')) {
    return Snowflake;
  }

  // Default fallback
  return Package;
};

/**
 * Intelligent helper to resolve modern color gradients and borders based on category theme
 */
export const getCategoryColors = (categoryName = '') => {
  if (!categoryName) {
    return {
      activeGrad: 'from-cyan-500 to-blue-600 shadow-cyan-500/30 text-white ring-cyan-400/40',
      idleBg: 'bg-gradient-to-br from-cyan-50 to-sky-50/80 dark:from-cyan-950/40 dark:to-sky-950/30 border-cyan-200/80 dark:border-cyan-800/60 text-cyan-600 dark:text-cyan-400 group-hover:border-cyan-400 group-hover:shadow-md',
      activeText: 'text-cyan-700 dark:text-cyan-300 font-extrabold',
      activePill: 'bg-cyan-50 dark:bg-cyan-950/40 ring-1 ring-cyan-200 dark:ring-cyan-800',
    };
  }

  const lower = categoryName.trim().toLowerCase();

  if (lower === 'all' || lower.includes('all products') || lower.includes('todos os produtos')) {
    return {
      activeGrad: 'from-cyan-500 to-blue-600 shadow-cyan-500/30 text-white ring-cyan-400/40',
      idleBg: 'bg-gradient-to-br from-cyan-50 to-blue-50/80 dark:from-cyan-950/40 dark:to-blue-950/30 border-cyan-200/80 dark:border-cyan-800/60 text-cyan-600 dark:text-cyan-400 group-hover:border-cyan-400 group-hover:shadow-md group-hover:shadow-cyan-500/15',
      activeText: 'text-cyan-700 dark:text-cyan-300 font-extrabold',
      activePill: 'bg-cyan-50/90 dark:bg-cyan-950/50 ring-1 ring-cyan-200 dark:ring-cyan-800',
    };
  }

  if (lower.includes('eatable') || lower.includes('pantry') || lower.includes('despensa') || lower.includes('grocery')) {
    return {
      activeGrad: 'from-amber-500 to-yellow-600 shadow-amber-500/30 text-white ring-amber-400/40',
      idleBg: 'bg-gradient-to-br from-amber-50 to-yellow-50/80 dark:from-amber-950/40 dark:to-yellow-950/30 border-amber-200/80 dark:border-amber-800/60 text-amber-600 dark:text-amber-400 group-hover:border-amber-400 group-hover:shadow-md group-hover:shadow-amber-500/15',
      activeText: 'text-amber-700 dark:text-amber-300 font-extrabold',
      activePill: 'bg-amber-50/90 dark:bg-amber-950/50 ring-1 ring-amber-200 dark:ring-amber-800',
    };
  }

  if (lower.includes('bath') || lower.includes('banho') || lower.includes('hygiene') || lower.includes('higiene')) {
    return {
      activeGrad: 'from-teal-500 to-cyan-600 shadow-teal-500/30 text-white ring-teal-400/40',
      idleBg: 'bg-gradient-to-br from-teal-50 to-cyan-50/80 dark:from-teal-950/40 dark:to-cyan-950/30 border-teal-200/80 dark:border-teal-800/60 text-teal-600 dark:text-teal-400 group-hover:border-teal-400 group-hover:shadow-md group-hover:shadow-teal-500/15',
      activeText: 'text-teal-700 dark:text-teal-300 font-extrabold',
      activePill: 'bg-teal-50/90 dark:bg-teal-950/50 ring-1 ring-teal-200 dark:ring-teal-800',
    };
  }

  if (lower.includes('makeup') || lower.includes('beauty') || lower.includes('beleza') || lower.includes('maquilhagem')) {
    return {
      activeGrad: 'from-fuchsia-500 to-pink-600 shadow-fuchsia-500/30 text-white ring-fuchsia-400/40',
      idleBg: 'bg-gradient-to-br from-fuchsia-50 to-pink-50/80 dark:from-fuchsia-950/40 dark:to-pink-950/30 border-fuchsia-200/80 dark:border-fuchsia-800/60 text-fuchsia-600 dark:text-fuchsia-400 group-hover:border-fuchsia-400 group-hover:shadow-md group-hover:shadow-fuchsia-500/15',
      activeText: 'text-fuchsia-700 dark:text-fuchsia-300 font-extrabold',
      activePill: 'bg-fuchsia-50/90 dark:bg-fuchsia-950/50 ring-1 ring-fuchsia-200 dark:ring-fuchsia-800',
    };
  }

  if (lower.includes('fruit') || lower.includes('fruta')) {
    return {
      activeGrad: 'from-emerald-500 to-teal-600 shadow-emerald-500/30 text-white ring-emerald-400/40',
      idleBg: 'bg-gradient-to-br from-emerald-50 to-teal-50/80 dark:from-emerald-950/40 dark:to-teal-950/30 border-emerald-200/80 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 group-hover:border-emerald-400 group-hover:shadow-md group-hover:shadow-emerald-500/15',
      activeText: 'text-emerald-700 dark:text-emerald-300 font-extrabold',
      activePill: 'bg-emerald-50/90 dark:bg-emerald-950/50 ring-1 ring-emerald-200 dark:ring-emerald-800',
    };
  }

  if (lower.includes('veg') || lower.includes('legume') || lower.includes('hortali')) {
    return {
      activeGrad: 'from-green-500 to-emerald-600 shadow-green-500/30 text-white ring-green-400/40',
      idleBg: 'bg-gradient-to-br from-green-50 to-emerald-50/80 dark:from-green-950/40 dark:to-emerald-950/30 border-green-200/80 dark:border-green-800/60 text-green-600 dark:text-green-400 group-hover:border-green-400 group-hover:shadow-md group-hover:shadow-green-500/15',
      activeText: 'text-green-700 dark:text-green-300 font-extrabold',
      activePill: 'bg-green-50/90 dark:bg-green-950/50 ring-1 ring-green-200 dark:ring-green-800',
    };
  }

  if (lower.includes('baker') || lower.includes('padaria') || lower.includes('bread') || lower.includes('pão')) {
    return {
      activeGrad: 'from-amber-500 to-orange-600 shadow-amber-500/30 text-white ring-amber-400/40',
      idleBg: 'bg-gradient-to-br from-amber-50 to-orange-50/80 dark:from-amber-950/40 dark:to-orange-950/30 border-amber-200/80 dark:border-amber-800/60 text-amber-600 dark:text-amber-400 group-hover:border-amber-400 group-hover:shadow-md group-hover:shadow-amber-500/15',
      activeText: 'text-amber-700 dark:text-amber-300 font-extrabold',
      activePill: 'bg-amber-50/90 dark:bg-amber-950/50 ring-1 ring-amber-200 dark:ring-amber-800',
    };
  }

  if (lower.includes('dair') || lower.includes('latic') || lower.includes('milk') || lower.includes('egg') || lower.includes('ovo')) {
    return {
      activeGrad: 'from-blue-500 to-indigo-600 shadow-blue-500/30 text-white ring-blue-400/40',
      idleBg: 'bg-gradient-to-br from-blue-50 to-indigo-50/80 dark:from-blue-950/40 dark:to-indigo-950/30 border-blue-200/80 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 group-hover:border-blue-400 group-hover:shadow-md group-hover:shadow-blue-500/15',
      activeText: 'text-blue-700 dark:text-blue-300 font-extrabold',
      activePill: 'bg-blue-50/90 dark:bg-blue-950/50 ring-1 ring-blue-200 dark:ring-blue-800',
    };
  }

  if (lower.includes('drink') || lower.includes('beverage') || lower.includes('bebida') || lower.includes('wine')) {
    return {
      activeGrad: 'from-rose-500 to-pink-600 shadow-rose-500/30 text-white ring-rose-400/40',
      idleBg: 'bg-gradient-to-br from-rose-50 to-pink-50/80 dark:from-rose-950/40 dark:to-pink-950/30 border-rose-200/80 dark:border-rose-800/60 text-rose-600 dark:text-rose-400 group-hover:border-rose-400 group-hover:shadow-md group-hover:shadow-rose-500/15',
      activeText: 'text-rose-700 dark:text-rose-300 font-extrabold',
      activePill: 'bg-rose-50/90 dark:bg-rose-950/50 ring-1 ring-rose-200 dark:ring-rose-800',
    };
  }

  if (lower.includes('snack') || lower.includes('sweet') || lower.includes('doce') || lower.includes('cookie')) {
    return {
      activeGrad: 'from-amber-500 to-yellow-600 shadow-amber-500/30 text-white ring-amber-400/40',
      idleBg: 'bg-gradient-to-br from-amber-50 to-yellow-50/80 dark:from-amber-950/40 dark:to-yellow-950/30 border-amber-200/80 dark:border-amber-800/60 text-amber-600 dark:text-amber-400 group-hover:border-amber-400 group-hover:shadow-md group-hover:shadow-amber-500/15',
      activeText: 'text-amber-700 dark:text-amber-300 font-extrabold',
      activePill: 'bg-amber-50/90 dark:bg-amber-950/50 ring-1 ring-amber-200 dark:ring-amber-800',
    };
  }

  if (lower.includes('house') || lower.includes('clean') || lower.includes('limpeza') || lower.includes('home')) {
    return {
      activeGrad: 'from-indigo-500 to-violet-600 shadow-indigo-500/30 text-white ring-indigo-400/40',
      idleBg: 'bg-gradient-to-br from-indigo-50 to-violet-50/80 dark:from-indigo-950/40 dark:to-violet-950/30 border-indigo-200/80 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 group-hover:border-indigo-400 group-hover:shadow-md group-hover:shadow-indigo-500/15',
      activeText: 'text-indigo-700 dark:text-indigo-300 font-extrabold',
      activePill: 'bg-indigo-50/90 dark:bg-indigo-950/50 ring-1 ring-indigo-200 dark:ring-indigo-800',
    };
  }

  return {
    activeGrad: 'from-cyan-500 to-blue-600 shadow-cyan-500/30 text-white ring-cyan-400/40',
    idleBg: 'bg-gradient-to-br from-cyan-50 to-sky-50/80 dark:from-cyan-950/40 dark:to-sky-950/30 border-cyan-200/80 dark:border-cyan-800/60 text-cyan-600 dark:text-cyan-400 group-hover:border-cyan-400 group-hover:shadow-md',
    activeText: 'text-cyan-700 dark:text-cyan-300 font-extrabold',
    activePill: 'bg-cyan-50 dark:bg-cyan-950/40 ring-1 ring-cyan-200 dark:ring-cyan-800',
  };
};
