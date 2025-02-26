
import type { KitchenOrder, StaffMember } from "@/types/staff";

interface ChefWorkload {
  chefId: number;
  name: string;
  activeOrders: number;
  totalItems: number;
}

export const chefService = {
  calculateWorkloads(orders: KitchenOrder[], staff: StaffMember[]): ChefWorkload[] {
    const chefs = staff.filter(member => member.role === "chef");
    
    return chefs.map(chef => {
      const assignedItems = orders.flatMap(order => 
        order.items.filter(item => 
          item.assigned_chef === chef.name && 
          ["pending", "preparing"].includes(item.status)
        )
      );

      const activeOrders = new Set(
        assignedItems.map(item => 
          orders.find(order => 
            order.items.some(orderItem => orderItem.id === item.id)
          )?.id
        )
      ).size;

      return {
        chefId: chef.id,
        name: chef.name,
        activeOrders,
        totalItems: assignedItems.length
      };
    });
  },

  recommendChef(workloads: ChefWorkload[]): string | undefined {
    if (workloads.length === 0) return undefined;
    
    return workloads.reduce((prev, current) => 
      current.totalItems < prev.totalItems ? current : prev
    ).name;
  },

  getChefPerformance(orders: KitchenOrder[], chefName: string) {
    const completedItems = orders.flatMap(order =>
      order.items.filter(item =>
        item.assigned_chef === chefName &&
        item.status === "ready" &&
        item.completion_time &&
        item.start_time
      )
    );

    if (completedItems.length === 0) return null;

    const totalPrepTime = completedItems.reduce((sum, item) => {
      const start = new Date(item.start_time!).getTime();
      const end = new Date(item.completion_time!).getTime();
      return sum + (end - start);
    }, 0);

    return {
      averagePrepTime: Math.round(totalPrepTime / completedItems.length / 60000),
      completedItems: completedItems.length,
      onTimeDelivery: completedItems.filter(item => {
        const prepTime = (new Date(item.completion_time!).getTime() - new Date(item.start_time!).getTime()) / 60000;
        return prepTime <= 15;
      }).length / completedItems.length * 100
    };
  }
};
