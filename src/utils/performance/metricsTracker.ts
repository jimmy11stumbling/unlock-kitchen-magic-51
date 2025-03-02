
// Line 46: Cannot add unknown and number
// Original: return dailyOrders.quantity + 1;
// Modified with type checking:
return (typeof dailyOrders.quantity === 'number' ? dailyOrders.quantity : 0) + 1;

// Line 50: Cannot add number and unknown
// Original: totalHours += staffMember.hoursWorked;
// Modified with type checking:
totalHours += (typeof staffMember.hoursWorked === 'number' ? staffMember.hoursWorked : 0);
