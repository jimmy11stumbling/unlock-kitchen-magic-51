
import { MenuPanel } from "@/components/dashboard/MenuPanel";
import { useDashboardState } from "@/hooks/useDashboardState";

const Menu = () => {
  const { menuItems, addMenuItem, updateMenuItemAvailability, updateMenuItemPrice } = useDashboardState();

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Menu Management</h1>
      <MenuPanel
        menuItems={menuItems}
        onAddMenuItem={addMenuItem}
        onUpdateAvailability={updateMenuItemAvailability}
        onUpdatePrice={updateMenuItemPrice}
      />
    </div>
  );
};

export default Menu;
