
import { ShoppingBag, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Order } from "@/types/staff";

interface OrderHeaderProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  statusFilter: Order["status"] | "all";
  setStatusFilter: (value: Order["status"] | "all") => void;
  sortBy: "newest" | "oldest" | "highest" | "lowest";
  setSortBy: (value: "newest" | "oldest" | "highest" | "lowest") => void;
}

export const OrderHeader = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
}: OrderHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <ShoppingBag className="h-5 w-5" />
        Order Management
      </h2>
      <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
        <Input
          placeholder="Search orders by ID, table, or items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as Order["status"] | "all")}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as "newest" | "oldest" | "highest" | "lowest")}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="highest">Highest Total</SelectItem>
              <SelectItem value="lowest">Lowest Total</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
