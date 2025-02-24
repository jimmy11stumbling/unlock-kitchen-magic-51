
import { supabase } from "@/integrations/supabase/client";

export const checkTableExists = async () => {
  try {
    const { data: existingTable, error: checkError } = await supabase
      .from('staff_members')
      .select('id')
      .limit(1);

    return !checkError;
  } catch (error) {
    return false;
  }
};
