export interface RevenueItem {
    month: string;
    value: number;
  }
  
  export interface DashboardData {
    totalReceived: number;
    totalPending: number;
    totalOverdue: number;
    defaultRate: number;
  
    totalProperties: number;
    availableProperties: number;
    rentedProperties: number;
    occupancyRate: number;
  
    activeContracts: number;
    totalTenants: number;
  
    revenueChart: RevenueItem[];
  }