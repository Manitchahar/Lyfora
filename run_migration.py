#!/usr/bin/env python3
"""
Script to run Supabase database migrations
"""
import os
import sys

# Supabase connection details - set these as environment variables
SUPABASE_URL = os.environ.get("VITE_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
DB_PASSWORD = os.environ.get("SUPABASE_DB_PASSWORD")

def run_migration():
    """Read and execute the migration SQL"""
    migration_file = "supabase/migrations/20251031012958_create_wellness_schema.sql"
    
    if not os.path.exists(migration_file):
        print(f"Migration file not found: {migration_file}")
        sys.exit(1)
    
    with open(migration_file, 'r') as f:
        sql = f.read()
    
    print(f"Migration file loaded: {len(sql)} characters")
    print("\nSQL Content Preview:")
    print("=" * 80)
    print(sql[:500] + "...\n")
    
    # For now, just display the migration
    print("\nTo run this migration, use one of these options:")
    print("1. Supabase Dashboard > SQL Editor > Paste the migration SQL")
    print("2. Use Supabase CLI: supabase db push")
    print("3. Use psql directly if you have database access")
    
    return sql

if __name__ == "__main__":
    sql = run_migration()
    print("\n✓ Migration file is ready to execute")
