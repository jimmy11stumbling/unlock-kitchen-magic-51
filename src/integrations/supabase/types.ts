export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_models: {
        Row: {
          base_config: Json | null
          config: Json | null
          created_at: string | null
          fine_tuning_config: Json | null
          id: string
          metrics: Json | null
          model_data: string
          model_files: Json | null
          model_format: string | null
          model_type: string | null
          name: string
          status: Database["public"]["Enums"]["model_status"] | null
          training_progress: number | null
          updated_at: string | null
        }
        Insert: {
          base_config?: Json | null
          config?: Json | null
          created_at?: string | null
          fine_tuning_config?: Json | null
          id?: string
          metrics?: Json | null
          model_data: string
          model_files?: Json | null
          model_format?: string | null
          model_type?: string | null
          name: string
          status?: Database["public"]["Enums"]["model_status"] | null
          training_progress?: number | null
          updated_at?: string | null
        }
        Update: {
          base_config?: Json | null
          config?: Json | null
          created_at?: string | null
          fine_tuning_config?: Json | null
          id?: string
          metrics?: Json | null
          model_data?: string
          model_files?: Json | null
          model_format?: string | null
          model_type?: string | null
          name?: string
          status?: Database["public"]["Enums"]["model_status"] | null
          training_progress?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          parent_id: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_history: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          assistant_response: string
          created_at: string
          id: string
          metadata: Json | null
          session_id: string | null
          updated_at: string
          user_message: string
        }
        Insert: {
          assistant_response: string
          created_at?: string
          id?: string
          metadata?: Json | null
          session_id?: string | null
          updated_at?: string
          user_message: string
        }
        Update: {
          assistant_response?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          session_id?: string | null
          updated_at?: string
          user_message?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          config: Json | null
          created_at: string | null
          id: string
          model_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          id?: string
          model_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          id?: string
          model_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "ai_models"
            referencedColumns: ["id"]
          },
        ]
      }
      dataset_items: {
        Row: {
          created_at: string
          dataset_id: string | null
          embeddings: number[] | null
          id: string
          metadata: Json | null
          original_text: string
          processed_text: string | null
        }
        Insert: {
          created_at?: string
          dataset_id?: string | null
          embeddings?: number[] | null
          id?: string
          metadata?: Json | null
          original_text: string
          processed_text?: string | null
        }
        Update: {
          created_at?: string
          dataset_id?: string | null
          embeddings?: number[] | null
          id?: string
          metadata?: Json | null
          original_text?: string
          processed_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dataset_items_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "datasets"
            referencedColumns: ["id"]
          },
        ]
      }
      datasets: {
        Row: {
          config: string | null
          created_at: string
          description: string | null
          huggingface_id: string | null
          id: string
          name: string
          source: string
          status: string
          updated_at: string
        }
        Insert: {
          config?: string | null
          created_at?: string
          description?: string | null
          huggingface_id?: string | null
          id?: string
          name: string
          source: string
          status?: string
          updated_at?: string
        }
        Update: {
          config?: string | null
          created_at?: string
          description?: string | null
          huggingface_id?: string | null
          id?: string
          name?: string
          source?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      feature_access: {
        Row: {
          allowed_roles: Database["public"]["Enums"]["user_role"][]
          created_at: string
          feature_name: string
          id: string
          subscription_tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string
        }
        Insert: {
          allowed_roles: Database["public"]["Enums"]["user_role"][]
          created_at?: string
          feature_name: string
          id?: string
          subscription_tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
        }
        Update: {
          allowed_roles?: Database["public"]["Enums"]["user_role"][]
          created_at?: string
          feature_name?: string
          id?: string
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
        }
        Relationships: []
      }
      financial_transactions: {
        Row: {
          amount: number
          category_id: string | null
          created_at: string | null
          created_by: string | null
          date: string
          description: string | null
          id: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          reference_number: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string | null
        }
        Insert: {
          amount: number
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          date?: string
          description?: string | null
          id?: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          reference_number?: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
        }
        Update: {
          amount?: number
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          date?: string
          description?: string | null
          id?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          reference_number?: string | null
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      kitchen_orders: {
        Row: {
          coursing: string
          created_at: string | null
          estimated_delivery_time: string
          id: number
          items: Json
          notes: string | null
          order_id: number | null
          priority: string
          updated_at: string | null
        }
        Insert: {
          coursing: string
          created_at?: string | null
          estimated_delivery_time: string
          id?: number
          items: Json
          notes?: string | null
          order_id?: number | null
          priority: string
          updated_at?: string | null
        }
        Update: {
          coursing?: string
          created_at?: string | null
          estimated_delivery_time?: string
          id?: number
          items?: Json
          notes?: string | null
          order_id?: number | null
          priority?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kitchen_orders_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      leases: {
        Row: {
          created_at: string
          end_date: string
          id: string
          lease_terms: Json | null
          monthly_rent: number
          security_deposit: number | null
          start_date: string
          status: string | null
          tenant_name: string
          unit_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          lease_terms?: Json | null
          monthly_rent: number
          security_deposit?: number | null
          start_date: string
          status?: string | null
          tenant_name: string
          unit_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          lease_terms?: Json | null
          monthly_rent?: number
          security_deposit?: number | null
          start_date?: string
          status?: string | null
          tenant_name?: string
          unit_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leases_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_records: {
        Row: {
          attachments: string[] | null
          category: string
          completed_date: string | null
          cost: number | null
          created_at: string
          description: string | null
          id: string
          property_id: string
          provider: string | null
          scheduled_date: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attachments?: string[] | null
          category?: string
          completed_date?: string | null
          cost?: number | null
          created_at?: string
          description?: string | null
          id?: string
          property_id: string
          provider?: string | null
          scheduled_date?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attachments?: string[] | null
          category?: string
          completed_date?: string | null
          cost?: number | null
          created_at?: string
          description?: string | null
          id?: string
          property_id?: string
          provider?: string | null
          scheduled_date?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_records_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_requests: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          priority: Database["public"]["Enums"]["maintenance_priority"] | null
          property_id: string
          status: Database["public"]["Enums"]["maintenance_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["maintenance_priority"] | null
          property_id: string
          status?: Database["public"]["Enums"]["maintenance_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["maintenance_priority"] | null
          property_id?: string
          status?: Database["public"]["Enums"]["maintenance_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          allergens: string[] | null
          available: boolean | null
          category: string
          created_at: string | null
          description: string | null
          id: number
          image_url: string | null
          name: string
          order_count: number | null
          preparation_time: number | null
          price: number
          updated_at: string | null
        }
        Insert: {
          allergens?: string[] | null
          available?: boolean | null
          category: string
          created_at?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          name: string
          order_count?: number | null
          preparation_time?: number | null
          price: number
          updated_at?: string | null
        }
        Update: {
          allergens?: string[] | null
          available?: boolean | null
          category?: string
          created_at?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          name?: string
          order_count?: number | null
          preparation_time?: number | null
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          sender_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: number
          menu_item_id: number | null
          notes: string | null
          order_id: number | null
          price_at_time: number
          quantity: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          menu_item_id?: number | null
          notes?: string | null
          order_id?: number | null
          price_at_time: number
          quantity: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          menu_item_id?: number | null
          notes?: string | null
          order_id?: number | null
          price_at_time?: number
          quantity?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          estimated_prep_time: number
          guest_count: number
          id: number
          items: Json
          payment_method: string | null
          payment_status: string | null
          server_name: string
          special_instructions: string | null
          status: string
          subtotal: number
          table_id: number | null
          table_number: number
          tax: number
          timestamp: string | null
          tip: number | null
          total: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          estimated_prep_time: number
          guest_count: number
          id?: number
          items: Json
          payment_method?: string | null
          payment_status?: string | null
          server_name: string
          special_instructions?: string | null
          status: string
          subtotal?: number
          table_id?: number | null
          table_number: number
          tax?: number
          timestamp?: string | null
          tip?: number | null
          total: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          estimated_prep_time?: number
          guest_count?: number
          id?: number
          items?: Json
          payment_method?: string | null
          payment_status?: string | null
          server_name?: string
          special_instructions?: string | null
          status?: string
          subtotal?: number
          table_id?: number | null
          table_number?: number
          tax?: number
          timestamp?: string | null
          tip?: number | null
          total?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "tables"
            referencedColumns: ["id"]
          },
        ]
      }
      pay_stubs: {
        Row: {
          created_at: string | null
          document_url: string
          id: number
          payroll_entry_id: number | null
        }
        Insert: {
          created_at?: string | null
          document_url: string
          id?: number
          payroll_entry_id?: number | null
        }
        Update: {
          created_at?: string | null
          document_url?: string
          id?: number
          payroll_entry_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pay_stubs_payroll_entry_id_fkey"
            columns: ["payroll_entry_id"]
            isOneToOne: false
            referencedRelation: "payroll_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_entries: {
        Row: {
          created_at: string | null
          deductions: Json | null
          gross_pay: number
          id: number
          net_pay: number
          overtime_hours: number
          overtime_rate: number
          pay_period_end: string
          pay_period_start: string
          payment_date: string | null
          regular_hours: number
          regular_rate: number
          staff_id: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deductions?: Json | null
          gross_pay: number
          id?: number
          net_pay: number
          overtime_hours?: number
          overtime_rate: number
          pay_period_end: string
          pay_period_start: string
          payment_date?: string | null
          regular_hours?: number
          regular_rate: number
          staff_id?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deductions?: Json | null
          gross_pay?: number
          id?: number
          net_pay?: number
          overtime_hours?: number
          overtime_rate?: number
          pay_period_end?: string
          pay_period_start?: string
          payment_date?: string | null
          regular_hours?: number
          regular_rate?: number
          staff_id?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payroll_entries_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_periods: {
        Row: {
          created_at: string | null
          end_date: string
          id: string
          pay_date: string | null
          start_date: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: string
          pay_date?: string | null
          start_date: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: string
          pay_date?: string | null
          start_date?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          created_at: string | null
          id: string
          image_url: string | null
          name: string
          units: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          name: string
          units?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          name?: string
          units?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      property_documents: {
        Row: {
          category: string
          created_at: string
          description: string | null
          file_url: string
          id: string
          property_id: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          file_url: string
          id?: string
          property_id: string
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          file_url?: string
          id?: string
          property_id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_documents_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      receipts: {
        Row: {
          generated_at: string | null
          id: number
          order_id: number | null
          printed_at: string | null
          receipt_data: Json
          voided_at: string | null
        }
        Insert: {
          generated_at?: string | null
          id?: number
          order_id?: number | null
          printed_at?: string | null
          receipt_data: Json
          voided_at?: string | null
        }
        Update: {
          generated_at?: string | null
          id?: number
          order_id?: number | null
          printed_at?: string | null
          receipt_data?: Json
          voided_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "receipts_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      rental_applications: {
        Row: {
          additional_info: Json | null
          applicant_name: string
          created_at: string
          current_address: string | null
          desired_move_in_date: string | null
          email: string
          employment_status: string | null
          id: string
          monthly_income: number | null
          phone: string | null
          status: Database["public"]["Enums"]["application_status"] | null
          unit_id: string
          updated_at: string
        }
        Insert: {
          additional_info?: Json | null
          applicant_name: string
          created_at?: string
          current_address?: string | null
          desired_move_in_date?: string | null
          email: string
          employment_status?: string | null
          id?: string
          monthly_income?: number | null
          phone?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          unit_id: string
          updated_at?: string
        }
        Update: {
          additional_info?: Json | null
          applicant_name?: string
          created_at?: string
          current_address?: string | null
          desired_move_in_date?: string | null
          email?: string
          employment_status?: string | null
          id?: string
          monthly_income?: number | null
          phone?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          unit_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rental_applications_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          created_at: string
          description: string | null
          download_url: string | null
          id: string
          last_generated_at: string | null
          next_generation_at: string | null
          parameters: Json | null
          schedule_frequency: string | null
          scheduled: boolean | null
          status: string
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          download_url?: string | null
          id?: string
          last_generated_at?: string | null
          next_generation_at?: string | null
          parameters?: Json | null
          schedule_frequency?: string | null
          scheduled?: boolean | null
          status?: string
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          download_url?: string | null
          id?: string
          last_generated_at?: string | null
          next_generation_at?: string | null
          parameters?: Json | null
          schedule_frequency?: string | null
          scheduled?: boolean | null
          status?: string
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      secrets: {
        Row: {
          created_at: string
          id: string
          name: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          value?: string
        }
        Relationships: []
      }
      staff_members: {
        Row: {
          address: string | null
          bank_info: Json | null
          benefits: Json | null
          certifications: string[] | null
          created_at: string | null
          department: string | null
          email: string | null
          emergency_contact: Json | null
          employment_status:
            | Database["public"]["Enums"]["employment_status"]
            | null
          hire_date: string | null
          hourly_rate: number | null
          id: number
          name: string
          notes: string | null
          overtime_rate: number | null
          performance_rating: number | null
          phone: string | null
          role: Database["public"]["Enums"]["staff_role"]
          salary: number | null
          schedule: Json | null
          shift: string | null
          status: Database["public"]["Enums"]["staff_status"] | null
          tax_id: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          bank_info?: Json | null
          benefits?: Json | null
          certifications?: string[] | null
          created_at?: string | null
          department?: string | null
          email?: string | null
          emergency_contact?: Json | null
          employment_status?:
            | Database["public"]["Enums"]["employment_status"]
            | null
          hire_date?: string | null
          hourly_rate?: number | null
          id?: number
          name: string
          notes?: string | null
          overtime_rate?: number | null
          performance_rating?: number | null
          phone?: string | null
          role: Database["public"]["Enums"]["staff_role"]
          salary?: number | null
          schedule?: Json | null
          shift?: string | null
          status?: Database["public"]["Enums"]["staff_status"] | null
          tax_id?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          bank_info?: Json | null
          benefits?: Json | null
          certifications?: string[] | null
          created_at?: string | null
          department?: string | null
          email?: string | null
          emergency_contact?: Json | null
          employment_status?:
            | Database["public"]["Enums"]["employment_status"]
            | null
          hire_date?: string | null
          hourly_rate?: number | null
          id?: number
          name?: string
          notes?: string | null
          overtime_rate?: number | null
          performance_rating?: number | null
          phone?: string | null
          role?: Database["public"]["Enums"]["staff_role"]
          salary?: number | null
          schedule?: Json | null
          shift?: string | null
          status?: Database["public"]["Enums"]["staff_status"] | null
          tax_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          active: boolean
          created_at: string
          end_date: string | null
          id: string
          payment_status: string | null
          start_date: string
          subscription_data: Json | null
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          end_date?: string | null
          id?: string
          payment_status?: string | null
          start_date?: string
          subscription_data?: Json | null
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          end_date?: string | null
          id?: string
          payment_status?: string | null
          start_date?: string
          subscription_data?: Json | null
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tables: {
        Row: {
          capacity: number
          created_at: string | null
          id: number
          number: number
          section: string
          status: Database["public"]["Enums"]["table_status"] | null
          updated_at: string | null
        }
        Insert: {
          capacity: number
          created_at?: string | null
          id?: number
          number: number
          section: string
          status?: Database["public"]["Enums"]["table_status"] | null
          updated_at?: string | null
        }
        Update: {
          capacity?: number
          created_at?: string | null
          id?: number
          number?: number
          section?: string
          status?: Database["public"]["Enums"]["table_status"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_to: string | null
          category: string
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: string | null
          property_id: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          category?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          property_id: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          category?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          property_id?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string | null
          status: Database["public"]["Enums"]["tenant_status"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name: string
          phone?: string | null
          status?: Database["public"]["Enums"]["tenant_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["tenant_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      time_entries: {
        Row: {
          break_end: string | null
          break_start: string | null
          clock_in: string
          clock_out: string | null
          created_at: string | null
          id: string
          staff_id: number | null
          total_hours: number | null
          updated_at: string | null
        }
        Insert: {
          break_end?: string | null
          break_start?: string | null
          clock_in: string
          clock_out?: string | null
          created_at?: string | null
          id?: string
          staff_id?: number | null
          total_hours?: number | null
          updated_at?: string | null
        }
        Update: {
          break_end?: string | null
          break_start?: string | null
          clock_in?: string
          clock_out?: string | null
          created_at?: string | null
          id?: string
          staff_id?: number | null
          total_hours?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "time_entries_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          },
        ]
      }
      training_jobs: {
        Row: {
          config: Json | null
          created_at: string | null
          error_message: string | null
          id: string
          metrics: Json | null
          model_id: string | null
          status: Database["public"]["Enums"]["model_status"] | null
          updated_at: string | null
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          metrics?: Json | null
          model_id?: string | null
          status?: Database["public"]["Enums"]["model_status"] | null
          updated_at?: string | null
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          metrics?: Json | null
          model_id?: string | null
          status?: Database["public"]["Enums"]["model_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_jobs_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "ai_models"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          date: string
          description: string | null
          due_date: string | null
          id: string
          is_deductible: boolean | null
          late_fee: number | null
          late_fee_config: Json | null
          notes: string | null
          payment_method: string | null
          property_id: string | null
          status: string | null
          tax_category: string | null
          tenant: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          date?: string
          description?: string | null
          due_date?: string | null
          id?: string
          is_deductible?: boolean | null
          late_fee?: number | null
          late_fee_config?: Json | null
          notes?: string | null
          payment_method?: string | null
          property_id?: string | null
          status?: string | null
          tax_category?: string | null
          tenant?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          date?: string
          description?: string | null
          due_date?: string | null
          id?: string
          is_deductible?: boolean | null
          late_fee?: number | null
          late_fee_config?: Json | null
          notes?: string | null
          payment_method?: string | null
          property_id?: string | null
          status?: string | null
          tax_category?: string | null
          tenant?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      units: {
        Row: {
          amenities: Json | null
          available_date: string | null
          bathrooms: number | null
          bedrooms: number | null
          created_at: string
          description: string | null
          id: string
          monthly_rent: number
          property_id: string
          square_feet: number | null
          status: Database["public"]["Enums"]["unit_status"] | null
          unit_number: string
          updated_at: string
        }
        Insert: {
          amenities?: Json | null
          available_date?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string
          description?: string | null
          id?: string
          monthly_rent: number
          property_id: string
          square_feet?: number | null
          status?: Database["public"]["Enums"]["unit_status"] | null
          unit_number: string
          updated_at?: string
        }
        Update: {
          amenities?: Json | null
          available_date?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string
          description?: string | null
          id?: string
          monthly_rent?: number
          property_id?: string
          square_feet?: number | null
          status?: Database["public"]["Enums"]["unit_status"] | null
          unit_number?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "units_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      workflow_connections: {
        Row: {
          config: Json | null
          created_at: string
          id: string
          source_node_id: string | null
          target_node_id: string | null
          updated_at: string
          workflow_id: string | null
        }
        Insert: {
          config?: Json | null
          created_at?: string
          id?: string
          source_node_id?: string | null
          target_node_id?: string | null
          updated_at?: string
          workflow_id?: string | null
        }
        Update: {
          config?: Json | null
          created_at?: string
          id?: string
          source_node_id?: string | null
          target_node_id?: string | null
          updated_at?: string
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_connections_source_node_id_fkey"
            columns: ["source_node_id"]
            isOneToOne: false
            referencedRelation: "workflow_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_connections_target_node_id_fkey"
            columns: ["target_node_id"]
            isOneToOne: false
            referencedRelation: "workflow_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_connections_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_executions: {
        Row: {
          completed_at: string | null
          error: string | null
          id: string
          results: Json | null
          started_at: string
          status: string | null
          user_id: string
          workflow_id: string
        }
        Insert: {
          completed_at?: string | null
          error?: string | null
          id?: string
          results?: Json | null
          started_at?: string
          status?: string | null
          user_id: string
          workflow_id: string
        }
        Update: {
          completed_at?: string | null
          error?: string | null
          id?: string
          results?: Json | null
          started_at?: string
          status?: string | null
          user_id?: string
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_executions_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_nodes: {
        Row: {
          config: Json | null
          created_at: string
          id: string
          label: string
          position: Json
          type: Database["public"]["Enums"]["workflow_node_type"]
          updated_at: string
          workflow_id: string | null
        }
        Insert: {
          config?: Json | null
          created_at?: string
          id?: string
          label: string
          position?: Json
          type: Database["public"]["Enums"]["workflow_node_type"]
          updated_at?: string
          workflow_id?: string | null
        }
        Update: {
          config?: Json | null
          created_at?: string
          id?: string
          label?: string
          position?: Json
          type?: Database["public"]["Enums"]["workflow_node_type"]
          updated_at?: string
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_nodes_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflows: {
        Row: {
          created_at: string
          description: string | null
          edges: Json
          id: string
          name: string
          nodes: Json
          status: string | null
          updated_at: string
          user_id: string
          version: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          edges?: Json
          id?: string
          name: string
          nodes?: Json
          status?: string | null
          updated_at?: string
          user_id: string
          version?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          edges?: Json
          id?: string
          name?: string
          nodes?: Json
          status?: string | null
          updated_at?: string
          user_id?: string
          version?: number
        }
        Relationships: []
      }
    }
    Views: {
      financial_summaries: {
        Row: {
          category: string | null
          month: string | null
          total_amount: number | null
          transaction_count: number | null
          type: string | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_estimated_delivery_time: {
        Args: {
          order_items: Json
        }
        Returns: string
      }
      has_feature_access: {
        Args: {
          user_id: string
          feature_name: string
        }
        Returns: boolean
      }
      refresh_financial_summaries: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      application_status: "pending" | "approved" | "rejected" | "withdrawn"
      employment_status: "full_time" | "part_time" | "contract" | "terminated"
      maintenance_priority: "low" | "medium" | "high"
      maintenance_status: "pending" | "in-progress" | "completed"
      model_status: "active" | "training" | "error"
      node_type:
        | "trigger"
        | "action"
        | "condition"
        | "transformer"
        | "api"
        | "database"
        | "email"
        | "webhook"
      order_status: "pending" | "preparing" | "ready" | "delivered"
      pay_frequency: "weekly" | "biweekly" | "monthly"
      payment_method: "cash" | "card" | "bank_transfer" | "check"
      property_status: "active" | "inactive" | "archived"
      staff_role: "manager" | "chef" | "server" | "host" | "bartender"
      staff_status: "active" | "on_break" | "off_duty"
      subscription_tier: "free" | "starter" | "professional" | "enterprise"
      table_status: "available" | "occupied" | "reserved" | "cleaning"
      tenant_status: "active" | "inactive" | "pending"
      transaction_type: "income" | "expense"
      unit_status: "vacant" | "occupied" | "maintenance" | "reserved"
      user_role: "admin" | "manager" | "staff" | "kitchen"
      workflow_node_type: "trigger" | "action" | "condition" | "transformer"
      workflow_status: "draft" | "active" | "archived"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
