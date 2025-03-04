
import { useMenuItems } from './menu/useMenuItems';
import { useMenuMutations } from './menu/useMenuMutations';
import { useMenuRealtime } from './menu/useMenuRealtime';

/**
 * Main hook for menu state management
 * Aggregates functionality from smaller, more focused hooks
 */
export const useMenuState = () => {
  // Fetch menu items
  const { data: menuItems = [], isLoading, error } = useMenuItems();
  
  // Get mutation functions
  const { 
    addMenuItem, 
    updateMenuItem, 
    deleteMenuItem,
    updateMenuItemAvailability,
    updateMenuItemPrice
  } = useMenuMutations();
  
  // Set up real-time subscription
  useMenuRealtime();

  return {
    menuItems,
    isLoading,
    error: error instanceof Error ? error.message : null,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    updateMenuItemAvailability,
    updateMenuItemPrice,
  };
};
